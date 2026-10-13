CREATE OR REPLACE FUNCTION public.auto_assign_lead() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE st text; assignee uuid;
BEGIN
  st := coalesce(new.details->>'state', new.details->>'State', '');
  SELECT a.user_id INTO assignee FROM public.staff_assignments a
  WHERE (cardinality(a.lead_types) = 0 OR new.lead_type = ANY(a.lead_types))
    AND (cardinality(a.states) = 0 OR st = ANY(a.states))
  ORDER BY (CASE WHEN st <> '' AND st = ANY(a.states) THEN 1 ELSE 0 END) DESC,
    (CASE WHEN new.lead_type = ANY(a.lead_types) THEN 1 ELSE 0 END) DESC,
    a.priority DESC, random()
  LIMIT 1;
  IF assignee IS NOT NULL THEN new.assigned_to := assignee; END IF;
  RETURN new;
END $$;