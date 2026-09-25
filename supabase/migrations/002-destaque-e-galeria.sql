-- Artigo em destaque + galeria de imagens em projetos e artigos. Idempotente: pode ser executado de novo.
alter table public.articles add column if not exists featured boolean not null default false;
alter table public.articles add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.projects add column if not exists gallery jsonb not null default '[]'::jsonb;
notify pgrst, 'reload schema';
