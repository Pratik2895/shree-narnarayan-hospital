-- Supabase Schema for Shree NarNarayan Children Hospital
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    child_name TEXT,
    child_age TEXT,
    service TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_appointments_phone ON public.appointments(phone);
CREATE INDEX idx_appointments_created_at ON public.appointments(created_at DESC);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for website form)
CREATE POLICY "Allow anonymous appointment booking"
    ON public.appointments
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated read all appointments"
    ON public.appointments
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update appointments"
    ON public.appointments
    FOR UPDATE
    TO authenticated
    USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Optional: Contact inquiries table (for general inquiries)
CREATE TABLE public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous contact inquiries"
    ON public.contact_inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read all inquiries"
    ON public.contact_inquiries
    FOR SELECT
    TO authenticated
    USING (true);

CREATE TRIGGER update_contact_inquiries_updated_at
    BEFORE UPDATE ON public.contact_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Optional: Vaccination records table (for future patient portal)
CREATE TABLE public.vaccination_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_name TEXT NOT NULL,
    age_schedule TEXT NOT NULL, -- e.g., "Birth", "6-14 weeks", "9-12 months"
    doses INTEGER DEFAULT 1,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default vaccination schedule
INSERT INTO public.vaccination_schedule (vaccine_name, age_schedule, doses, notes, display_order) VALUES
('BCG', 'Birth', 1, 'Tuberculosis vaccine', 1),
('Hepatitis B (1st dose)', 'Birth', 1, 'Within 24 hours of birth', 2),
('OPV (Oral Polio Vaccine)', 'Birth', 1, 'Zero dose', 3),
('DPT (Diphtheria, Pertussis, Tetanus)', '6-14 weeks', 3, 'Primary series at 6, 10, 14 weeks', 4),
('OPV', '6-14 weeks', 3, 'With DPT', 5),
('Hepatitis B', '6-14 weeks', 3, '2nd, 3rd dose with DPT', 6),
('IPV (Inactivated Polio Vaccine)', '6-14 weeks', 2, 'At 6 and 14 weeks', 7),
('MMR (Measles, Mumps, Rubella)', '9-12 months', 1, 'First dose', 8),
('Typhoid', '9-12 months', 1, 'Typhoid conjugate vaccine', 9),
('Hepatitis A', '9-12 months', 2, '2 doses 6 months apart', 10),
('DPT Booster', '16-24 months', 1, 'First booster', 11),
('MMR (2nd dose)', '16-24 months', 1, 'Second dose', 12),
('OPV Booster', '16-24 months', 1, 'Booster dose', 13);

ALTER TABLE public.vaccination_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read vaccination schedule"
    ON public.vaccination_schedule
    FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);