DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'id'
      AND data_type IN ('integer', 'bigint', 'smallint')
  ) THEN
    ALTER TABLE users
      DROP CONSTRAINT IF EXISTS users_pkey,
      ALTER COLUMN id DROP DEFAULT;
    DROP SEQUENCE IF EXISTS users_id_seq;
    ALTER TABLE users
      ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE users ADD PRIMARY KEY (id);
  END IF;
END $$;
