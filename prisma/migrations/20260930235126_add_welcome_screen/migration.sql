-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "username_norm" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "premium_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "avatar_style" TEXT NOT NULL DEFAULT 'circle',
    "background_url" TEXT,
    "background_video_url" TEXT,
    "background_type" TEXT NOT NULL DEFAULT 'gradient',
    "background_color" TEXT NOT NULL DEFAULT '#0a0a0a',
    "background_gradient" TEXT NOT NULL DEFAULT 'linear-gradient(160deg,#0a0a0a,#14141a)',
    "accent_color" TEXT NOT NULL DEFAULT '#a855f7',
    "text_color" TEXT NOT NULL DEFAULT '#ffffff',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "button_style" TEXT NOT NULL DEFAULT 'solid',
    "border_radius" INTEGER NOT NULL DEFAULT 16,
    "blur" INTEGER NOT NULL DEFAULT 12,
    "effect" TEXT NOT NULL DEFAULT 'none',
    "show_view_count" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unlocked_badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hidden_badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audio_url" TEXT,
    "audio_title" TEXT,
    "audio_artist" TEXT,
    "cursor_url" TEXT,
    "location" TEXT,
    "profile_opacity" INTEGER NOT NULL DEFAULT 100,
    "monochrome_icons" BOOLEAN NOT NULL DEFAULT false,
    "animated_title" BOOLEAN NOT NULL DEFAULT false,
    "animated_title_style" TEXT NOT NULL DEFAULT 'none',
    "swap_box_colors" BOOLEAN NOT NULL DEFAULT false,
    "volume_control" BOOLEAN NOT NULL DEFAULT false,
    "mouse_trail" TEXT NOT NULL DEFAULT 'none',
    "welcome_enabled" BOOLEAN NOT NULL DEFAULT false,
    "welcome_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "artist" TEXT,
    "autoplay" BOOLEAN NOT NULL DEFAULT false,
    "volume" INTEGER NOT NULL DEFAULT 60,
    "loop" BOOLEAN NOT NULL DEFAULT true,
    "show_player" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "duration_days" INTEGER NOT NULL DEFAULT 30,
    "created_by_id" TEXT NOT NULL,
    "used_by_id" TEXT,
    "used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premium_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_norm_key" ON "users"("username_norm");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "links_user_id_position_idx" ON "links"("user_id", "position");

-- CreateIndex
CREATE INDEX "socials_user_id_idx" ON "socials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "music_user_id_key" ON "music"("user_id");

-- CreateIndex
CREATE INDEX "analytics_user_id_created_at_idx" ON "analytics"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "premium_codes_code_key" ON "premium_codes"("code");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socials" ADD CONSTRAINT "socials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music" ADD CONSTRAINT "music_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_codes" ADD CONSTRAINT "premium_codes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_codes" ADD CONSTRAINT "premium_codes_used_by_id_fkey" FOREIGN KEY ("used_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
