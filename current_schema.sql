

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO user_profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_card_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles 
    SET total_cards = total_cards + NEW.quantity
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE user_profiles 
    SET total_cards = total_cards + (NEW.quantity - OLD.quantity)
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_profiles 
    SET total_cards = total_cards - OLD.quantity
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_user_card_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."card_packs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "pack_type" "text" DEFAULT 'booster'::"text" NOT NULL,
    "card_count" integer DEFAULT 5 NOT NULL,
    "rarity_weights" "jsonb" DEFAULT '{"rare": 8, "common": 70, "uncommon": 20, "legendary": 2}'::"jsonb",
    "price" integer DEFAULT 100 NOT NULL,
    "is_available" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "card_packs_card_count_check" CHECK (("card_count" > 0)),
    CONSTRAINT "card_packs_pack_type_check" CHECK (("pack_type" = ANY (ARRAY['starter'::"text", 'booster'::"text", 'premium'::"text", 'special'::"text"]))),
    CONSTRAINT "card_packs_price_check" CHECK (("price" >= 0))
);


ALTER TABLE "public"."card_packs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_openings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pack_id" "uuid" NOT NULL,
    "cards_received" "jsonb" DEFAULT '[]'::"jsonb",
    "opened_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."pack_openings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."readings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "spread_type" "text" DEFAULT 'three_card'::"text" NOT NULL,
    "cards_drawn" "jsonb" DEFAULT '[]'::"jsonb",
    "interpretation" "text" DEFAULT ''::"text",
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    CONSTRAINT "readings_spread_type_check" CHECK (("spread_type" = ANY (ARRAY['single_card'::"text", 'three_card'::"text", 'celtic_cross'::"text", 'horseshoe'::"text", 'custom'::"text"]))),
    CONSTRAINT "readings_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."readings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tarot_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text",
    "card_type" "text" NOT NULL,
    "suit" "text",
    "number" integer,
    "keywords" "text"[] DEFAULT '{}'::"text"[],
    "meaning_upright" "text" NOT NULL,
    "meaning_reversed" "text" NOT NULL,
    "rarity" "text" DEFAULT 'common'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "tarot_cards_card_type_check" CHECK (("card_type" = ANY (ARRAY['major_arcana'::"text", 'minor_arcana'::"text"]))),
    CONSTRAINT "tarot_cards_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'uncommon'::"text", 'rare'::"text", 'legendary'::"text"]))),
    CONSTRAINT "tarot_cards_suit_check" CHECK ((("suit" = ANY (ARRAY['cups'::"text", 'wands'::"text", 'swords'::"text", 'pentacles'::"text"])) OR ("suit" IS NULL)))
);


ALTER TABLE "public"."tarot_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "initiator_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "initiator_cards" "jsonb" DEFAULT '[]'::"jsonb",
    "recipient_cards" "jsonb" DEFAULT '[]'::"jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "message" "text" DEFAULT ''::"text",
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "trades_check" CHECK (("initiator_id" <> "recipient_id")),
    CONSTRAINT "trades_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."trades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "card_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "is_tradeable" boolean DEFAULT true,
    "acquired_at" timestamp with time zone DEFAULT "now"(),
    "acquired_method" "text" DEFAULT 'unknown'::"text",
    CONSTRAINT "user_cards_acquired_method_check" CHECK (("acquired_method" = ANY (ARRAY['pack_opening'::"text", 'trade'::"text", 'reward'::"text", 'purchase'::"text", 'gift'::"text", 'unknown'::"text"]))),
    CONSTRAINT "user_cards_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."user_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "avatar_url" "text",
    "bio" "text" DEFAULT ''::"text",
    "level" integer DEFAULT 1,
    "experience_points" integer DEFAULT 0,
    "total_cards" integer DEFAULT 0,
    "total_trades" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."card_packs"
    ADD CONSTRAINT "card_packs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_openings"
    ADD CONSTRAINT "pack_openings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tarot_cards"
    ADD CONSTRAINT "tarot_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trades"
    ADD CONSTRAINT "trades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_user_id_card_id_key" UNIQUE ("user_id", "card_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_username_key" UNIQUE ("username");



CREATE INDEX "idx_card_packs_available" ON "public"."card_packs" USING "btree" ("is_available");



CREATE INDEX "idx_pack_openings_opened_at" ON "public"."pack_openings" USING "btree" ("opened_at" DESC);



CREATE INDEX "idx_pack_openings_user_id" ON "public"."pack_openings" USING "btree" ("user_id");



CREATE INDEX "idx_readings_created_at" ON "public"."readings" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_readings_public" ON "public"."readings" USING "btree" ("is_public");



CREATE INDEX "idx_readings_status" ON "public"."readings" USING "btree" ("status");



CREATE INDEX "idx_readings_user_id" ON "public"."readings" USING "btree" ("user_id");



CREATE INDEX "idx_tarot_cards_rarity" ON "public"."tarot_cards" USING "btree" ("rarity");



CREATE INDEX "idx_tarot_cards_suit" ON "public"."tarot_cards" USING "btree" ("suit");



CREATE INDEX "idx_tarot_cards_type" ON "public"."tarot_cards" USING "btree" ("card_type");



CREATE INDEX "idx_trades_expires_at" ON "public"."trades" USING "btree" ("expires_at");



CREATE INDEX "idx_trades_initiator" ON "public"."trades" USING "btree" ("initiator_id");



CREATE INDEX "idx_trades_recipient" ON "public"."trades" USING "btree" ("recipient_id");



CREATE INDEX "idx_trades_status" ON "public"."trades" USING "btree" ("status");



CREATE INDEX "idx_user_cards_card_id" ON "public"."user_cards" USING "btree" ("card_id");



CREATE INDEX "idx_user_cards_tradeable" ON "public"."user_cards" USING "btree" ("is_tradeable");



CREATE INDEX "idx_user_cards_user_id" ON "public"."user_cards" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "update_trades_updated_at" BEFORE UPDATE ON "public"."trades" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_card_count_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_cards" FOR EACH ROW EXECUTE FUNCTION "public"."update_user_card_count"();



ALTER TABLE ONLY "public"."pack_openings"
    ADD CONSTRAINT "pack_openings_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."card_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_openings"
    ADD CONSTRAINT "pack_openings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trades"
    ADD CONSTRAINT "trades_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trades"
    ADD CONSTRAINT "trades_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."tarot_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can view available packs" ON "public"."card_packs" FOR SELECT TO "authenticated" USING (("is_available" = true));



CREATE POLICY "Anyone can view tarot cards" ON "public"."tarot_cards" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Trade participants can update trades" ON "public"."trades" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "initiator_id") OR ("auth"."uid"() = "recipient_id")));



CREATE POLICY "Users can create trades" ON "public"."trades" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "initiator_id"));



CREATE POLICY "Users can delete own cards" ON "public"."user_cards" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own readings" ON "public"."readings" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own cards" ON "public"."user_cards" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own pack openings" ON "public"."pack_openings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."user_profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert own readings" ON "public"."readings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own cards" ON "public"."user_cards" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."user_profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own readings" ON "public"."readings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view all profiles" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view own cards" ON "public"."user_cards" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own pack openings" ON "public"."pack_openings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own readings" ON "public"."readings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view public readings" ON "public"."readings" FOR SELECT TO "authenticated" USING (("is_public" = true));



CREATE POLICY "Users can view trades they're involved in" ON "public"."trades" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "initiator_id") OR ("auth"."uid"() = "recipient_id")));



ALTER TABLE "public"."card_packs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_openings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."readings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tarot_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_card_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_card_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_card_count"() TO "service_role";



GRANT ALL ON TABLE "public"."card_packs" TO "anon";
GRANT ALL ON TABLE "public"."card_packs" TO "authenticated";
GRANT ALL ON TABLE "public"."card_packs" TO "service_role";



GRANT ALL ON TABLE "public"."pack_openings" TO "anon";
GRANT ALL ON TABLE "public"."pack_openings" TO "authenticated";
GRANT ALL ON TABLE "public"."pack_openings" TO "service_role";



GRANT ALL ON TABLE "public"."readings" TO "anon";
GRANT ALL ON TABLE "public"."readings" TO "authenticated";
GRANT ALL ON TABLE "public"."readings" TO "service_role";



GRANT ALL ON TABLE "public"."tarot_cards" TO "anon";
GRANT ALL ON TABLE "public"."tarot_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."tarot_cards" TO "service_role";



GRANT ALL ON TABLE "public"."trades" TO "anon";
GRANT ALL ON TABLE "public"."trades" TO "authenticated";
GRANT ALL ON TABLE "public"."trades" TO "service_role";



GRANT ALL ON TABLE "public"."user_cards" TO "anon";
GRANT ALL ON TABLE "public"."user_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."user_cards" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
