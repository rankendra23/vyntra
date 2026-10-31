-- ============================================================================
-- SocialSphere Demo Seed Data
-- ============================================================================

-- Insert sample profiles (matching UUIDs)
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, website, is_private, is_verified)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'elena_creative',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    'Architectural photographer & visual designer ✨ Capturing shadows & modern spaces in Tokyo & Berlin.',
    'https://elenarostova.design',
    false,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'marcus_dev',
    'Marcus Chen',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    'Full-stack engineer & coffee aficionado ☕ Building open-source web tooling with React & TypeScript.',
    'https://github.com/marcuschen',
    false,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'sophia_wander',
    'Sophia Laurent',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    'Alpine adventures & Nordic travel journals 🏔️ Finding quiet places in a busy world.',
    'https://nordicwanders.com',
    false,
    false
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'alex_sound',
    'Alex Rivera',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    'Sound engineer & modular synth builder 🎛️ Exploring analog soundscapes.',
    'https://soundcloud.com/alexrivera',
    false,
    false
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'clara_private',
    'Clara Vance',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    'Private diary & close circle memories 🌿 Request to follow.',
    null,
    true,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url;

-- Sample Posts
INSERT INTO public.posts (id, author_id, caption, location, created_at)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Golden hour symmetry in the heart of Shibuya. The light reflects endlessly across the glass facades. #architecture #tokyo #minimalism #urbanphotography',
    'Tokyo, Japan',
    now() - interval '2 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Shipped the new dark mode design system today! Super excited about the contrast ratios and accessibility improvements. #webdev #typescript #designsystem',
    'San Francisco, CA',
    now() - interval '5 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'First snowfall in the Dolomites. The silence here early in the morning is unlike anything else. Swipe to see the frozen lake cabin. #travel #dolomites #winter #mountains',
    'Dolomites, Italy',
    now() - interval '9 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Post Media (supporting multi-image carousels)
INSERT INTO public.post_media (id, post_id, media_url, media_type, aspect_ratio, display_order)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1080&auto=format&fit=crop&q=80',
    'image',
    1.0,
    0
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1080&auto=format&fit=crop&q=80',
    'image',
    1.0,
    1
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80',
    'image',
    1.0,
    0
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=80',
    'image',
    1.0,
    0
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&auto=format&fit=crop&q=80',
    'image',
    1.0,
    1
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Follows
INSERT INTO public.follows (follower_id, following_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Sample Comments
INSERT INTO public.comments (id, post_id, author_id, content, created_at)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Incredible perspective Elena! The reflection in the second shot is perfection.',
    now() - interval '1 hour'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'Adding this spot to my next itinerary! Gorgeous work.',
    now() - interval '30 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- Sample Likes
INSERT INTO public.likes (post_id, user_id)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Sample Active Stories
INSERT INTO public.stories (id, author_id, media_url, media_type, caption, created_at, expires_at)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1080&auto=format&fit=crop&q=80',
    'image',
    'Coffee break in Ginza ☕',
    now() - interval '3 hours',
    now() + interval '21 hours'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80',
    'image',
    'Code & matrix 💻',
    now() - interval '4 hours',
    now() + interval '20 hours'
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
    'image',
    'Trail views today 🌲',
    now() - interval '1 hour',
    now() + interval '23 hours'
  )
ON CONFLICT (id) DO NOTHING;
