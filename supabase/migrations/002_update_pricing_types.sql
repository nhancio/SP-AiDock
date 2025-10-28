-- Update pricing types to only include Free, Freemium, and Paid
-- This migration removes 'subscription' and 'one_time' from the pricing_type enum

-- First, update any existing data that uses the old pricing types
UPDATE tools 
SET pricing_type = 'paid' 
WHERE pricing_type IN ('subscription', 'one_time');

-- Drop the old enum type
DROP TYPE IF EXISTS pricing_type CASCADE;

-- Create the new enum type with only the three pricing options
CREATE TYPE pricing_type AS ENUM ('free', 'freemium', 'paid');

-- Recreate the tools table with the new pricing_type
-- (This will be handled by the main schema, but we need to ensure the enum is correct)
