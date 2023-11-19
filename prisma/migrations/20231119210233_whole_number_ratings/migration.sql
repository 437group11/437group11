-- Create a new column to store the updated ratings
ALTER TABLE Review ADD COLUMN updatedRating Int;

-- Update the new column with the converted ratings, handling cases where the result is 0
-- This is because we originally had ratings from 0 to 100, but we want them to be 1 to 10 now.
UPDATE Review
SET updatedRating = CASE WHEN FLOOR(rating / 10) = 0 THEN 1 ELSE FLOOR(rating / 10) END;

-- Drop the old rating column
ALTER TABLE Review DROP COLUMN rating;

-- Rename the updatedRating column to 'rating'
ALTER TABLE Review RENAME COLUMN updatedRating TO rating;
