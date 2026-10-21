# Remove email code (OTP) login — password only

## What changes
- The team sign-in page will show only **Email + Password** and a **Sign in** button. The "Email code" tab, "Send email code", code box and "Resend code" are removed.
- No more sign-in links or codes will be sent by email when someone logs in.
- "Forgot password?" stays as a backup way to reset your password by email (only sent when you click it). It can be removed too if you want.
- New team members can't sign themselves up from this page. The Super Admin adds them from the Users list (Add user, with email + password).
- Your Super Admin login (harsh@rishishwarindustry.in + your password) keeps working as it does now.

## Technical details
- `src/routes/auth.tsx`: remove the `otp` mode, Tabs, `sendCode`/`verifyCode`, the code state and the session-from-link effect. Password form becomes the default and only form. Keep `resetPasswordForEmail` and `/reset-password`.
- Turn off public sign-up (`disable_signup: true`) so accounts can only be created by the admin. Other auth settings stay the same.
- `src/test/otp-auth.test.ts`: change it to check that the sign-in page uses password sign-in and has no `signInWithOtp` / `verifyOtp`.
- Update the project knowledge rule from "email OTP and password" to "password only".
- Check: sign in with password in a test browser and confirm the Admin panel opens.
