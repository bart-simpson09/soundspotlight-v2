--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: albums_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.albums_status_enum AS ENUM (
    'pending',
    'published',
    'rejected'
);


ALTER TYPE public.albums_status_enum OWNER TO postgres;

--
-- Name: reviews_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reviews_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.reviews_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: albums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.albums (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    album_title character varying NOT NULL,
    number_of_songs integer NOT NULL,
    description text NOT NULL,
    "avgRate" double precision DEFAULT 0 NOT NULL,
    cover_image_url character varying NOT NULL,
    release_date date NOT NULL,
    upload_date timestamp without time zone DEFAULT now() NOT NULL,
    author_id uuid,
    language_id uuid,
    category_id uuid,
    status public.albums_status_enum DEFAULT 'pending'::public.albums_status_enum NOT NULL,
    added_by_id uuid
);


ALTER TABLE public.albums OWNER TO postgres;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    album_id uuid
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    create_date timestamp without time zone DEFAULT now() NOT NULL,
    rate integer NOT NULL,
    content text NOT NULL,
    author_id uuid,
    album_id uuid,
    status public.reviews_status_enum DEFAULT 'pending'::public.reviews_status_enum NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    avatar character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.albums VALUES ('3ce123b9-347d-42f4-b6d3-4d2fa7c138ad', 'To Pimp a Butterfly', 16, 'To Pimp a Butterfly by Kendrick Lamar is a critically acclaimed hip-hop album that blends jazz, funk, and spoken word elements. With profound lyrics addressing themes of race, identity, and personal struggle, the album features standout tracks like "Alright," "King Kunta," and "The Blacker the Berry." Kendrick''s lyrical prowess and innovative production make this album a powerful statement on contemporary social issues.', 2, '../src/assets/covers/To Pimp a Butterfly-1736675289094.jpeg', '2015-03-15', '2025-01-12 09:48:09.150601', 'ea911e8b-bab6-4eb8-8078-fde8d9f0f69b', 'dc3424f5-39d0-4fb5-a1df-ab4e7764ffc6', '360af967-8b4e-4cda-88c1-7f1517197dc5', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('8e14391f-23e8-45c6-95f4-4bb937fcbde3', 'The Four Seasons', 4, 'The Four Seasons by Antonio Vivaldi is a set of four violin concertos that represent the seasons of the year. Each concerto captures the essence of its respective season through vivid musical imagery. Vivaldi''s masterful composition and expressive melodies have made The Four Seasons one of the most popular and enduring works in the classical music repertoire.', 2.5, '../src/assets/covers/The Four Seasons-1736675157678.jpeg', '1725-05-21', '2025-01-12 09:45:57.718644', '0f723236-ac03-4326-8fae-baf10559b8ff', '4ac9aea9-45b2-4939-a598-74c3c403cade', '7f1961a0-a73d-47f2-ad7c-fe78709f6364', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('d9e50792-7531-4353-99da-e1de8da1289d', 'The College Dropout', 21, 'The College Dropout by Kanye West is a groundbreaking hip-hop album that showcases Kanye''s talent as a producer and lyricist. With hits like "Jesus Walks," "Through the Wire," and "All Falls Down," the album explores themes of self-determination, social issues, and personal ambition. Kanye''s unique style and innovative approach to hip-hop have made The College Dropout a classic in the genre.', 0, '../src/assets/covers/The College Dropout-1736675251779.jpeg', '2004-02-10', '2025-01-12 09:47:31.854411', '10191630-82cb-4df1-8f3a-38bdf04a1ff9', 'a420fe70-5c5f-4e91-81c2-847b96c8fa5e', '360af967-8b4e-4cda-88c1-7f1517197dc5', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('147e545e-ef85-48d0-9884-ea8c01acc842', 'Nevermind', 12, 'Nevermind by Nirvana is a seminal rock album that defined the grunge era of the early 1990s. With hits like "Smells Like Teen Spirit," "Come as You Are," and "Lithium," the album combines raw emotion, powerful lyrics, and Kurt Cobain''s distinctive voice. Nevermind brought alternative rock into the mainstream and remains a pivotal album in the history of rock music.', 3.5, '../src/assets/covers/Nevermind-1736675333639.jpeg', '1991-09-24', '2025-01-12 09:48:53.677274', '0e806e74-1987-4436-9a89-53a845d4e8b9', 'dc3424f5-39d0-4fb5-a1df-ab4e7764ffc6', '92975427-9ff7-4782-a71b-8e1f4b3f7b9f', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('669a32ad-cc30-4ec2-912c-d227e2f1a662', 'Back in Black', 10, 'Back in Black by AC/DC is a legendary rock album that has become a cornerstone of the genre. Featuring iconic tracks like "Hells Bells," "You Shook Me All Night Long," and the title track "Back in Black," the album is known for its powerful riffs, driving rhythms, and memorable lyrics. It is one of the best-selling albums of all time and a testament to AC/DC''s enduring influence on rock music.', 3, '../src/assets/covers/Back in Black-1736675376371.jpeg', '1980-07-25', '2025-01-12 09:49:36.408659', 'c58e14a9-498d-4827-a083-72e92e6ebc8f', 'dc3424f5-39d0-4fb5-a1df-ab4e7764ffc6', 'a34b6cd8-ce51-4820-ab3a-30e15d16563d', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('c9711fd3-435b-4a1a-ae99-d844dc54bf8e', 'Future Nostalgia', 11, 'Future Nostalgia by Dua Lipa is a groundbreaking pop album that blends retro disco vibes with modern pop sensibilities. Known for its danceable beats and catchy melodies, the album features hits like "Don''t Start Now," "Physical," and "Levitating." Dua Lipa''s powerful vocals and confident delivery, combined with high-quality production, make this album a standout in the pop genre. It has received critical acclaim and numerous awards, cementing Dua Lipa''s place as a pop icon.', 4, '../src/assets/covers/Future Nostalgia-1736674646962.jpeg', '2020-03-27', '2025-01-12 09:37:27.024338', 'c8c01ee0-d492-4407-a7d9-1bc06afa81bf', 'a420fe70-5c5f-4e91-81c2-847b96c8fa5e', '92975427-9ff7-4782-a71b-8e1f4b3f7b9f', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('52736c59-7c23-434b-9b90-c6f811eedfc6', '1989', 13, '1989 by Taylor Swift marked a significant shift in her career from country to pop music. The album features chart-topping singles such as "Shake It Off," "Blank Space," and "Style." Known for its polished production and catchy hooks, 1989 explores themes of love, heartbreak, and personal growth. Taylor''s songwriting prowess and ability to craft memorable pop anthems have made 1989 one of the most influential pop albums of the decade.', 4.5, '../src/assets/covers/1989-1736675073159.png', '2014-10-27', '2025-01-12 09:44:33.189416', '5f3d14d0-4d17-492f-ba57-99b70c7469a9', 'dc3424f5-39d0-4fb5-a1df-ab4e7764ffc6', '92975427-9ff7-4782-a71b-8e1f4b3f7b9f', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('789bd411-be57-4e87-85e6-21a7b58ee6e8', 'Symphony No. 9', 8, 'The final complete symphony by Ludwig van Beethoven, composed between 1822 and 1824. It was first performed in Vienna on 7 May 1824. The symphony is regarded by many critics and musicologists as a masterpiece of Western classical music and one of the supreme achievements in the history of music.', 0, '../src/assets/covers/Beethoven- Symphony No. 9-1736675727812.jpeg', '1824-05-07', '2025-01-12 09:55:27.866961', 'df276085-88f0-42b5-8802-5b5a0e61eb11', '4ac9aea9-45b2-4939-a598-74c3c403cade', 'dd47d9cd-efcb-4f53-87f4-5af627d53c14', 'pending', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('dc0bc03e-28c9-4857-8ebf-264b62e342a8', 'Scary Monsters and Nice Sprites', 8, 'Second extended play (EP) by American electronic music producer Skrillex. It was released exclusively through Beatport on October 22, 2010, through mau5trap and Big Beat Records, while being released on December 20 for digital download via other online retailers and on March 1, 2011, as a physical release.', 0, '../src/assets/covers/Scary Monsters and Nice Sprites-1736675595968.jpg', '2010-10-22', '2025-01-12 09:53:16.004647', '0b6626bc-654a-4fa1-95e0-43b4517a73f0', '4972c9a1-5dbd-4e07-80f8-890a0c326ce3', '7f6e6e73-e35c-4443-b365-57bb5bf4ff85', 'rejected', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');
INSERT INTO public.albums VALUES ('111a0417-664b-4f6b-b3b1-e83e404a4f2b', 'Random Access Memories', 13, 'Random Access Memories by Daft Punk is a critically acclaimed EDM album that pays homage to the disco and funk music of the 1970s and 1980s. Featuring hits like "Get Lucky" and "Instant Crush," the album combines live instrumentation with electronic production. Daft Punk''s innovative approach and high-quality production have made Random Access Memories a standout in the EDM genre.', 3, '../src/assets/covers/Random Access Memories-1736675205640.png', '2013-05-17', '2025-01-12 09:46:45.709776', '796c448e-cdc8-49c8-bada-4f81d0891b56', '4972c9a1-5dbd-4e07-80f8-890a0c326ce3', '7f6e6e73-e35c-4443-b365-57bb5bf4ff85', 'published', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5');


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authors VALUES ('c8c01ee0-d492-4407-a7d9-1bc06afa81bf', 'Dua Lipa');
INSERT INTO public.authors VALUES ('5f3d14d0-4d17-492f-ba57-99b70c7469a9', 'Taylor Swift');
INSERT INTO public.authors VALUES ('0f723236-ac03-4326-8fae-baf10559b8ff', 'Antonio Vivaldi');
INSERT INTO public.authors VALUES ('796c448e-cdc8-49c8-bada-4f81d0891b56', 'Daft Punk');
INSERT INTO public.authors VALUES ('10191630-82cb-4df1-8f3a-38bdf04a1ff9', 'Kanye West');
INSERT INTO public.authors VALUES ('ea911e8b-bab6-4eb8-8078-fde8d9f0f69b', 'Kendrick Lamar');
INSERT INTO public.authors VALUES ('0e806e74-1987-4436-9a89-53a845d4e8b9', 'Nirvana');
INSERT INTO public.authors VALUES ('c58e14a9-498d-4827-a083-72e92e6ebc8f', 'AC/DC');
INSERT INTO public.authors VALUES ('0b6626bc-654a-4fa1-95e0-43b4517a73f0', 'Skrillex');
INSERT INTO public.authors VALUES ('df276085-88f0-42b5-8802-5b5a0e61eb11', 'Ludwig van Beethoven');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES ('92975427-9ff7-4782-a71b-8e1f4b3f7b9f', 'Pop');
INSERT INTO public.categories VALUES ('a34b6cd8-ce51-4820-ab3a-30e15d16563d', 'Rock');
INSERT INTO public.categories VALUES ('64357863-e721-4428-805f-7a9e87fb63d6', 'Country');
INSERT INTO public.categories VALUES ('deffedfe-def7-4de5-90ce-f48d0b988dfb', 'Jazz');
INSERT INTO public.categories VALUES ('dd47d9cd-efcb-4f53-87f4-5af627d53c14', 'Indie');
INSERT INTO public.categories VALUES ('689e8269-83d0-41f5-acf6-cab187298e20', 'Reggae');
INSERT INTO public.categories VALUES ('7f6e6e73-e35c-4443-b365-57bb5bf4ff85', 'EDM');
INSERT INTO public.categories VALUES ('360af967-8b4e-4cda-88c1-7f1517197dc5', 'Hip-hop');
INSERT INTO public.categories VALUES ('7f1961a0-a73d-47f2-ad7c-fe78709f6364', 'Instrumental');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.favorites VALUES ('ba8c6110-71d3-4b58-a526-f4fe919f95e9', '2b26b681-c279-4326-89bd-f1edf490f45d', '669a32ad-cc30-4ec2-912c-d227e2f1a662');
INSERT INTO public.favorites VALUES ('8b233e2d-514d-481e-ada0-ccbf17c0d897', '2b26b681-c279-4326-89bd-f1edf490f45d', '52736c59-7c23-434b-9b90-c6f811eedfc6');
INSERT INTO public.favorites VALUES ('637d6112-30cb-422c-9efe-9bff9de324ba', '2b26b681-c279-4326-89bd-f1edf490f45d', 'd9e50792-7531-4353-99da-e1de8da1289d');
INSERT INTO public.favorites VALUES ('fec6a363-002e-45b4-b219-93c4c5114fe1', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', 'c9711fd3-435b-4a1a-ae99-d844dc54bf8e');
INSERT INTO public.favorites VALUES ('2096fed5-b582-4e27-a0b8-6c899e10c701', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '8e14391f-23e8-45c6-95f4-4bb937fcbde3');
INSERT INTO public.favorites VALUES ('63b81880-9b53-417a-9b37-7e2073b97346', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '3ce123b9-347d-42f4-b6d3-4d2fa7c138ad');


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.languages VALUES ('dc3424f5-39d0-4fb5-a1df-ab4e7764ffc6', 'Polish');
INSERT INTO public.languages VALUES ('a420fe70-5c5f-4e91-81c2-847b96c8fa5e', 'English');
INSERT INTO public.languages VALUES ('4ac9aea9-45b2-4939-a598-74c3c403cade', 'German');
INSERT INTO public.languages VALUES ('4972c9a1-5dbd-4e07-80f8-890a0c326ce3', 'French');
INSERT INTO public.languages VALUES ('6dde2128-8fa8-4f00-b2a6-b6a5cc47d2b7', 'Spanish');


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES ('a3c4904f-009d-4597-bfd9-89b1dcdb5c27', '2025-01-12 10:02:43.236927', 3, 'The Four Seasons'' is a timeless masterpiece, beautifully capturing the essence of each season through music.', '2b26b681-c279-4326-89bd-f1edf490f45d', '8e14391f-23e8-45c6-95f4-4bb937fcbde3', 'approved');
INSERT INTO public.reviews VALUES ('dd974be4-4b68-47b8-9e87-3a32cd6e81a5', '2025-01-12 10:03:00.447427', 4, 'Daft Punk''s ''Random Access Memories'' is a lush, nostalgic journey through sound. ''Get Lucky'' is a timeless hit.', '2b26b681-c279-4326-89bd-f1edf490f45d', '111a0417-664b-4f6b-b3b1-e83e404a4f2b', 'approved');
INSERT INTO public.reviews VALUES ('012115c5-bc47-4fff-8519-0e3400c4a15e', '2025-01-12 09:59:50.897268', 2, 'A beautifully produced album, though some tracks feel a bit too retro. Overall, it''s a fantastic listen.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '111a0417-664b-4f6b-b3b1-e83e404a4f2b', 'approved');
INSERT INTO public.reviews VALUES ('43e69b4c-bc00-4db2-bddb-b50d609ade6a', '2025-01-12 10:00:09.157558', 2, 'An important album with deep lyrics, though its experimental nature might not appeal to all hip-hop fans.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '3ce123b9-347d-42f4-b6d3-4d2fa7c138ad', 'approved');
INSERT INTO public.reviews VALUES ('1b6939ca-51b2-4d0f-ba3b-a6010b1515bf', '2025-01-12 10:03:15.808293', 4, 'Nirvana''s ''Nevermind'' is a raw, emotional ride that changed the face of rock music forever. Cobain''s voice is haunting and unforgettable.', '2b26b681-c279-4326-89bd-f1edf490f45d', '147e545e-ef85-48d0-9884-ea8c01acc842', 'approved');
INSERT INTO public.reviews VALUES ('8889853b-98b4-41d5-981a-9eb21fb0bb47', '2025-01-12 10:00:28.618869', 3, 'A groundbreaking album, though some tracks blend together. The standout hits make it a must-listen.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '147e545e-ef85-48d0-9884-ea8c01acc842', 'approved');
INSERT INTO public.reviews VALUES ('a4495629-78ab-4582-8e38-8dcaad7a0639', '2025-01-12 10:01:01.730789', 3, 'While undeniably influential, the album can feel formulaic at times. Still, its impact on rock music is undeniable.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '669a32ad-cc30-4ec2-912c-d227e2f1a662', 'approved');
INSERT INTO public.reviews VALUES ('180b4a42-a286-4075-8bcd-2a0746e3c7cb', '2025-01-12 10:02:06.657223', 3, 'While the album has some standout tracks, a few songs feel repetitive. However, Dua''s vocal performance is consistently strong.', '2b26b681-c279-4326-89bd-f1edf490f45d', 'c9711fd3-435b-4a1a-ae99-d844dc54bf8e', 'approved');
INSERT INTO public.reviews VALUES ('c5e90b93-eae4-430d-8f55-053eb699c8d4', '2025-01-12 09:57:18.965758', 5, 'Dua Lipa''s ''Future Nostalgia'' is a perfect blend of past and present, delivering a fresh take on disco-pop. Every track is a hit.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', 'c9711fd3-435b-4a1a-ae99-d844dc54bf8e', 'approved');
INSERT INTO public.reviews VALUES ('a5bd991b-7f7f-427b-89ad-bde406d81253', '2025-01-12 10:02:23.567602', 4, 'A great album overall, but some tracks lack the depth found in her earlier work. Still, it''s a fun and enjoyable listen.', '2b26b681-c279-4326-89bd-f1edf490f45d', '52736c59-7c23-434b-9b90-c6f811eedfc6', 'approved');
INSERT INTO public.reviews VALUES ('e07269f8-fe03-4e09-bb9c-bf66a438b3fe', '2025-01-12 09:59:11.113463', 5, 'Taylor Swift''s ''1989'' is a pop masterpiece with infectious hooks and relatable lyrics. Each song tells a compelling story.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '52736c59-7c23-434b-9b90-c6f811eedfc6', 'approved');
INSERT INTO public.reviews VALUES ('d98cde09-f2c3-46f6-9426-9566c98051ef', '2025-01-12 09:59:30.771051', 2, 'A stunning work of classical music, though some movements are more captivating than others. Overall, it''s a brilliant piece.', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '8e14391f-23e8-45c6-95f4-4bb937fcbde3', 'approved');
INSERT INTO public.reviews VALUES ('49b62712-46ed-46f4-b5f0-1af6fdd8d957', '2025-01-12 10:07:02.986745', 5, 'This album is gorgeous!', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '669a32ad-cc30-4ec2-912c-d227e2f1a662', 'pending');
INSERT INTO public.reviews VALUES ('0308ff14-6505-467a-84ea-507558adab40', '2025-01-12 10:06:46.189156', 1, 'I hate this album!', '64fa51b0-2e78-43eb-87f7-f2acca28d6d5', '52736c59-7c23-434b-9b90-c6f811eedfc6', 'rejected');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('2b26b681-c279-4326-89bd-f1edf490f45d', 'marry@example.com', '$2b$08$zRO56gAKh/U5LkmO04YQXelgJ5VIc.AhxmUSVm4Fob9tP.I9SFTJK', 'Marry', 'Smith', '../src/assets/avatars/default-avatar.png', 'user');
INSERT INTO public.users VALUES ('64fa51b0-2e78-43eb-87f7-f2acca28d6d5', 'sajdak.mateusz.219@gmail.com', '$2b$08$xk6Vkr1Ejt9liEyaSUE6ZO3i6aMgIfsByDua2Y6sqc8Vdi2OoZ47W', 'Mateusz', 'Sajdak', '../src/assets/avatars/bart-simpson-1736676500228.jpeg', 'admin');


--
-- Name: reviews PK_231ae565c273ee700b283f15c1d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: albums PK_838ebae24d2e12082670ffc95d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY (id);


--
-- Name: favorites PK_890818d27523748dd36a4d1bdc8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: languages PK_b517f827ca496b29f4d549c631d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY (id);


--
-- Name: authors PK_d2ed02fabd9b52847ccb85e6b88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY (id);


--
-- Name: authors UQ_6c64b3df09e6774438aeca7e0b0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT "UQ_6c64b3df09e6774438aeca7e0b0" UNIQUE (name);


--
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: languages UQ_9c0e155475f0aa782e4a6178969; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT "UQ_9c0e155475f0aa782e4a6178969" UNIQUE (name);


--
-- Name: albums UQ_eabf86f5ea1466b2a357f7354e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "UQ_eabf86f5ea1466b2a357f7354e5" UNIQUE (album_title);


--
-- Name: favorites FK_2e46772aaeeaa9770bdb59d4668; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT "FK_2e46772aaeeaa9770bdb59d4668" FOREIGN KEY (album_id) REFERENCES public.albums(id) ON DELETE CASCADE;


--
-- Name: favorites FK_35a6b05ee3b624d0de01ee50593; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews FK_730212b061cf96c78ef79c8dacc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_730212b061cf96c78ef79c8dacc" FOREIGN KEY (album_id) REFERENCES public.albums(id) ON DELETE CASCADE;


--
-- Name: reviews FK_7efc8ac1a6389e4e9317435ad2b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_7efc8ac1a6389e4e9317435ad2b" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: albums FK_a5e83a471cb85ffcf0114e22f7f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "FK_a5e83a471cb85ffcf0114e22f7f" FOREIGN KEY (added_by_id) REFERENCES public.users(id);


--
-- Name: albums FK_acee1602bd8b199e83e91b41a61; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "FK_acee1602bd8b199e83e91b41a61" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: albums FK_b040dd654d5383cb2db6d463bf3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "FK_b040dd654d5383cb2db6d463bf3" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: albums FK_b716a45aa684d5f97905e89a7b4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT "FK_b716a45aa684d5f97905e89a7b4" FOREIGN KEY (author_id) REFERENCES public.authors(id);


--
-- PostgreSQL database dump complete
--

