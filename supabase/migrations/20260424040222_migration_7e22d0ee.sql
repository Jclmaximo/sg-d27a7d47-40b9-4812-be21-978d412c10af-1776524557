ALTER TABLE user_productivity DROP COLUMN contacted_prospects;
ALTER TABLE user_productivity ADD COLUMN contacted_prospects boolean DEFAULT false;