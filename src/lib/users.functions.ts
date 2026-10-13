import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ROLES = ["super_admin", "admin", "lead_manager", "sales_executive", "store_manager", "funding_manager", "global_manager", "content_editor", "hr_manager", "viewer", "partner"] as const;

const schema = z.object({
  email: z.string().trim().email().max(200),
  fullName: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(72),
  roles: z.array(z.enum(ROLES)).min(1),
});

/** Super Admin creates a ready-to-use, already-approved staff account. */
export const createStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => schema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: isSuper } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "super_admin" });
    if (!isSuper) throw new Error("Only the Super Admin can create users.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error || !created.user) {
      const msg = error?.message ?? "Could not create user";
      throw new Error(/already/i.test(msg) ? "An account with this email already exists." : msg);
    }
    const id = created.user.id;
    await supabaseAdmin.from("profiles").upsert({ id, email: data.email, full_name: data.fullName, approval_status: "approved", reviewed_at: new Date().toISOString() });
    const { error: roleErr } = await supabaseAdmin.from("user_roles").insert(data.roles.map((role) => ({ user_id: id, role })));
    if (roleErr) throw new Error("User created, but roles could not be saved. Add them from the list.");
    return { id };
  });
