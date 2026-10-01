/* =========================================================
   VIDEOS - local copy for when Supabase is unavailable
   =========================================================
   The videos are managed in the admin (Gestão → Vídeos) and stored in the `videos` table; this list is only
   used when the database does not answer (or before supabase/schema.sql created the table). Same fields:
   - title, description, duration ("3:20")
   - src          a YouTube / Vimeo link, an https link to a video file, or assets/videos/… (public/)
   - poster       optional cover image; YouTube links use their own thumbnail
   - featured     the presentation video of the home (one at most)
   Rendered by src/lib/video-player.js. */
export const VIDEOS = [];
