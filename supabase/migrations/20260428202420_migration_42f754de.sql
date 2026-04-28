-- Add missing columns to message_templates
ALTER TABLE message_templates 
ADD COLUMN emoji text DEFAULT '📝',
ADD COLUMN category text DEFAULT 'general';