import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  employeeId: z.string().trim().min(3).max(40),
  employeeCode: z.string().trim().min(3).max(40),
});

export type VerifiedEmployee = {
  employeeId: string; name: string; designation: string; department: string;
  workLocation: string; dateOfJoining: string | null; officialEmail: string | null;
};

/** Returns only ID-card details, and only when BOTH employee ID and employee code match an active employee. */
export const verifyEmployee = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<{ verified: true; employee: VerifiedEmployee } | { verified: false }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("employees")
      .select("employee_id, employee_code, full_name, designation, department, work_location, date_of_joining, official_email, is_active")
      .eq("employee_id", data.employeeId.toUpperCase())
      .maybeSingle();
    if (!row || !row.is_active || row.employee_code.toUpperCase() !== data.employeeCode.toUpperCase()) {
      return { verified: false };
    }
    return {
      verified: true,
      employee: {
        employeeId: row.employee_id, name: row.full_name, designation: row.designation, department: row.department,
        workLocation: row.work_location, dateOfJoining: row.date_of_joining, officialEmail: row.official_email,
      },
    };
  });
