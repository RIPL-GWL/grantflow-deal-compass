CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.employees (employee_id, employee_code, full_name, designation, department, work_location, date_of_joining, official_email) VALUES
('RI-EMP-1024','7F3A9','Rohit Sharma','Business Development Manager','Sales & Marketing','Gwalior, Madhya Pradesh','2024-01-12','rohit.sharma@rishishwarindustry.in'),
('RI-EMP-1025','K8M2Q','Neha Gupta','Marketing Executive','Sales & Marketing','Gwalior, Madhya Pradesh','2024-03-04','neha.gupta@rishishwarindustry.in'),
('RI-EMP-1026','P4X7T','Amit Singh','Operations Executive','Operations','Gwalior, Madhya Pradesh','2024-05-20','amit.singh@rishishwarindustry.in'),
('RI-EMP-1027','H2R9L','Priya Mehta','HR Executive','Human Resources','Gwalior, Madhya Pradesh','2024-07-01','priya.mehta@rishishwarindustry.in'),
('RI-EMP-1028','D6W3N','Karan Verma','Software Developer','Technology','Gwalior, Madhya Pradesh','2024-08-15','karan.verma@rishishwarindustry.in'),
('RI-EMP-1029','B9C5Z','Sneha Jain','Finance Executive','Finance','Gwalior, Madhya Pradesh','2024-10-10','sneha.jain@rishishwarindustry.in')
ON CONFLICT (employee_id) DO NOTHING;