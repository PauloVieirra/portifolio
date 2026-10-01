-- Vídeos (Gestão → Vídeos): tabela, permissões e espaço para os arquivos. Idempotente: pode ser executado de novo.
-- Também faz parte de supabase/schema.sql.
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
drop trigger if exists videos_touch on public.videos;
create trigger videos_touch before update on public.videos for each row execute function public.touch_updated_at();

grant select on public.videos to anon, authenticated;
grant insert, update, delete on public.videos to authenticated;
alter table public.videos enable row level security;
drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (published or public.is_admin());
drop policy if exists videos_write on public.videos;
create policy videos_write on public.videos for all to authenticated using (public.is_admin()) with check (public.is_admin());

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

-- the API picks up the new table right away
notify pgrst, 'reload schema';
