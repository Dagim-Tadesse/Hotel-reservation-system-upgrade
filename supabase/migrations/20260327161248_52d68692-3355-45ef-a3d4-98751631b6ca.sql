
-- Fix overly permissive RLS on bookings
DROP POLICY IF EXISTS "Allow public write bookings" ON public.bookings;
CREATE POLICY "Authenticated can insert bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix overly permissive RLS on rooms
DROP POLICY IF EXISTS "Allow public write rooms" ON public.rooms;
CREATE POLICY "Admins can write rooms" ON public.rooms
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update rooms" ON public.rooms
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete rooms" ON public.rooms
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix overly permissive RLS on guests
DROP POLICY IF EXISTS "Allow public write guests" ON public.guests;
CREATE POLICY "Admins can write guests" ON public.guests
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update guests" ON public.guests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete guests" ON public.guests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix overly permissive RLS on payment_reports
DROP POLICY IF EXISTS "Allow public write payment_reports" ON public.payment_reports;
CREATE POLICY "Admins can write payment_reports" ON public.payment_reports
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payment_reports" ON public.payment_reports
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payment_reports" ON public.payment_reports
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
