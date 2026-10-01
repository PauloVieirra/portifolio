-- Portfólio - schema da área de gestão. Idempotente: pode ser executado de novo.
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.projects (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position int not null default 0,
  published boolean not null default true,
  featured boolean not null default false,
  title text not null,
  summary text not null,
  cat text, cat_label text, year text, tag text,
  tags text[] not null default '{}',
  url text, img text, c1 text, c2 text,
  challenge text, role text, stack text,
  deliver text[] not null default '{}',
  article jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position int not null default 0,
  published boolean not null default true,
  date date not null,
  read_min int,
  tags text[] not null default '{}',
  img text, c1 text, c2 text, tag text,
  project text references public.projects(id) on update cascade on delete set null,
  title text not null,
  summary text not null,
  intro text,
  sections jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  gallery jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  kind text not null check (kind in ('trabalho', 'formacao')),
  period text not null,
  title text not null,
  org text, description text, title_full text
);

create table if not exists public.site_content (
  key text primary key check (key in ('hero_bubbles', 'services', 'skills', 'contact')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Videos: the /videos grid; the featured one (at most one) is the presentation video on the home
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  published boolean not null default true,
  featured boolean not null default false,
  title text not null,
  description text,
  src text,
  poster text,
  duration text,
  updated_at timestamptz not null default now()
);
create unique index if not exists videos_one_featured on public.videos ((true)) where featured;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists articles_touch on public.articles;
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();
drop trigger if exists videos_touch on public.videos;
create trigger videos_touch before update on public.videos for each row execute function public.touch_updated_at();
drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

grant select on public.projects, public.articles, public.timeline, public.site_content, public.videos to anon, authenticated;
grant insert, update, delete on public.projects, public.articles, public.timeline, public.site_content, public.videos to authenticated;
grant select on public.admins to authenticated;

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.timeline enable row level security;
alter table public.site_content enable row level security;
alter table public.videos enable row level security;

drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins for select to authenticated using (public.is_admin());

drop policy if exists projects_read on public.projects;
create policy projects_read on public.projects for select using (published or public.is_admin());
drop policy if exists projects_write on public.projects;
create policy projects_write on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists articles_read on public.articles;
create policy articles_read on public.articles for select using (published or public.is_admin());
drop policy if exists articles_write on public.articles;
create policy articles_write on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists timeline_read on public.timeline;
create policy timeline_read on public.timeline for select using (true);
drop policy if exists timeline_write on public.timeline;
create policy timeline_write on public.timeline for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content for select using (true);
drop policy if exists site_content_write on public.site_content;
create policy site_content_write on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (published or public.is_admin());
drop policy if exists videos_write on public.videos;
create policy videos_write on public.videos for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Columns added after the first release (no-op on a fresh install)
alter table public.articles add column if not exists featured boolean not null default false;
alter table public.articles add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.projects add column if not exists gallery jsonb not null default '[]'::jsonb;

-- Storage: public bucket for images; only admins write
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists media_insert on storage.objects;
create policy media_insert on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists media_update on storage.objects;
create policy media_update on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists media_delete on storage.objects;
create policy media_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- Storage: public bucket for video files (50 MB each, the free plan's limit); only admins write
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists videos_files_insert on storage.objects;
create policy videos_files_insert on storage.objects for insert to authenticated with check (bucket_id = 'videos' and public.is_admin());
drop policy if exists videos_files_update on storage.objects;
create policy videos_files_update on storage.objects for update to authenticated using (bucket_id = 'videos' and public.is_admin());
drop policy if exists videos_files_delete on storage.objects;
create policy videos_files_delete on storage.objects for delete to authenticated using (bucket_id = 'videos' and public.is_admin());

-- the API picks up new tables and columns right away
notify pgrst, 'reload schema';
