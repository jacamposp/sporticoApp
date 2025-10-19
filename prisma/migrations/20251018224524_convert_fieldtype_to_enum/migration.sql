-- CreateEnum (si no existe)
DO $$ BEGIN
    CREATE TYPE "public"."FieldType" AS ENUM ('FIVE_VS_FIVE', 'SEVEN_VS_SEVEN', 'ELEVEN_VS_ELEVEN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Convertir valores existentes de string a enum
-- Primero actualizamos los valores para que coincidan con el enum
UPDATE "public"."Field"
SET "fieldType" = CASE
    WHEN "fieldType" = '5vs5' THEN 'FIVE_VS_FIVE'
    WHEN "fieldType" = '7vs7' THEN 'SEVEN_VS_SEVEN'
    WHEN "fieldType" = '11vs11' THEN 'ELEVEN_VS_ELEVEN'
    ELSE "fieldType"
END
WHERE "fieldType" IN ('5vs5', '7vs7', '11vs11');

-- Alterar la columna para usar el enum
ALTER TABLE "public"."Field" 
ALTER COLUMN "fieldType" TYPE "public"."FieldType" 
USING "fieldType"::"public"."FieldType";

