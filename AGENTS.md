<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the target TanStack runtime configuration when importing source; source pages live in routes and reusable presentation in frontend.
- Keep imported media as Lovable Assets pointers and generated media as bundled ES imports, so media remains available independently of the source project.
- Scope Funding Programme design tokens and controls to its page to preserve other imported page designs.
- Preserve original IDs when importing future user records; verified identity mapping must control access, never client-submitted roles.
- Keep programme calculation rules in a browser-safe module with concrete unit tests so registration terms remain consistent.
- Mount the funding promotion dialog once in the root shell with an explicit allowlist (home + public funding pages); registration links bypass it so applications remain accessible.
- Keep team authentication on Cloud Auth with password sign-in and email+password signup (no email OTP or sign-in links); new accounts need admin approval; password reset uses a public recovery-link page, because emailed sign-in links proved unreliable and Cloud stores password hashes.
- Grant the first Super Admin role only after the fixed owner email is verified server-side, because client-supplied identity or roles must never authorize access.
