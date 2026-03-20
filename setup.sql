-- ==========================================
-- 歴史クエスト: Supabase セットアップSQL
-- ==========================================

-- プロフィール
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text default '冒険者',
  xp integer default 0,
  level integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- クイズデータ（年表）
create table quiz_data (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  year integer not null,
  event text not null,
  created_at timestamptz default now(),
  unique(user_id, year, event)
);

-- クイズ記録
create table quiz_records (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  mode text not null,
  score integer not null,
  total integer not null,
  xp_earned integer default 0,
  is_perfect boolean default false,
  created_at timestamptz default now()
);

-- RLS有効化
alter table profiles enable row level security;
alter table quiz_data enable row level security;
alter table quiz_records enable row level security;

-- プロフィール ポリシー
create policy "own_profile_select" on profiles for select using (auth.uid() = id);
create policy "own_profile_update" on profiles for update using (auth.uid() = id);
create policy "own_profile_insert" on profiles for insert with check (auth.uid() = id);

-- クイズデータ ポリシー
create policy "own_data_select" on quiz_data for select using (auth.uid() = user_id);
create policy "own_data_insert" on quiz_data for insert with check (auth.uid() = user_id);
create policy "own_data_delete" on quiz_data for delete using (auth.uid() = user_id);

-- クイズ記録 ポリシー
create policy "own_records_select" on quiz_records for select using (auth.uid() = user_id);
create policy "own_records_insert" on quiz_records for insert with check (auth.uid() = user_id);

-- 新規ユーザー登録時に自動でプロフィールを作成するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', '冒険者'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- ステージ進捗テーブル（追記）
-- =====================================================
create table if not exists stage_progress (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  stage integer not null,
  cleared boolean default false,
  best_score integer default 0,
  attempts integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, stage)
);
alter table stage_progress enable row level security;
create policy "own_stage_select" on stage_progress for select using (auth.uid() = user_id);
create policy "own_stage_insert" on stage_progress for insert with check (auth.uid() = user_id);
create policy "own_stage_update" on stage_progress for update using (auth.uid() = user_id);
