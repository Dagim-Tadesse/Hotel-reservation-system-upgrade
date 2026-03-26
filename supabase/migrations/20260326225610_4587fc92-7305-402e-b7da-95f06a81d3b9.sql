
-- Drop existing unrelated tables if needed (they belong to a different project)
-- We'll create hotel-specific tables

-- Rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'suite')),
  room_price NUMERIC(10,2) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_under_maintenance BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment reports table
CREATE TABLE public.payment_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  phone_number TEXT,
  room_number TEXT NOT NULL,
  room_type TEXT NOT NULL,
  room_price NUMERIC(10,2) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reports ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for demo - admin-only system)
CREATE POLICY "Allow public read rooms" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write rooms" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read guests" ON public.guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write guests" ON public.guests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read payment_reports" ON public.payment_reports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write payment_reports" ON public.payment_reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Function to auto-update room availability when booking is created
CREATE OR REPLACE FUNCTION public.handle_booking_room_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rooms SET is_available = FALSE WHERE id = NEW.room_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rooms SET is_available = TRUE WHERE id = OLD.room_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.room_id != NEW.room_id THEN
    UPDATE rooms SET is_available = TRUE WHERE id = OLD.room_id;
    UPDATE rooms SET is_available = FALSE WHERE id = NEW.room_id;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_room_availability
AFTER INSERT OR UPDATE OR DELETE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_booking_room_availability();
