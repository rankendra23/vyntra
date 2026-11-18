# Vyntra 🌐

**Vyntra** is a modern, premium full-stack social media platform engineered with React, TypeScript, Tailwind CSS, and Supabase. Inspired by the core usability and elegance of Instagram, Vyntra incorporates original branding, teal/cyan visual accents, rich interactive carousels, 24-hour expiring stories, direct real-time messaging, privacy controls, and granular Row Level Security (RLS).

---

## 🚀 Key Features

### 1. Modern Design System & Responsive Layout
- **Desktop**: Fixed left navigation sidebar, central feed, and right sidebar with suggested creators and user profile preview.
- **Tablet**: Icon-only navigation sidebar with responsive content width.
- **Mobile**: Top navigation bar with direct notifications/messages shortcuts, and bottom navigation bar.
- **Themes**: Seamless Light and Dark mode with persistent state (`localStorage` and system preference detection).
- **Feedback & States**: Skeleton loaders, animated like heart overlay, confirmation dialogs, toast notification system, and empty states.

### 2. Authentication & User Accounts
- Real authentication with email, username, and password.
- Username validation (minimum 3 characters, allowed characters: letters, numbers, underscores, and periods).
- Password reset and email recovery workflows.
- Public and private account privacy options.
- Profile photo upload with automatic resizing and fallback avatars.
- Profile editing (display name, bio, website link, and privacy toggle).

### 3. Dynamic Home Feed & Post Interactions
- Feed rendering latest posts from followed creators and public content.
- Multi-photo & video carousels with navigation controls and dot progress indicators.
- Caption highlighting with clickable `#hashtags` leading to filtered Explore results.
- Double-tap on media or heart button to like with optimistic UI updates.
- Saved posts bookmarking (only visible to post owner).
- Share/copy link to clipboard with toast notification.
- Inline comment previews with instant submission and dedicated comment thread modal with authorized deletion.

### 4. Advanced Media Upload System
- Drag-and-drop or file picker upload.
- Supports JPEG, PNG, WebP images (up to 10MB) and MP4, WebM videos (up to 50MB).
- Client and server-side file format and size validation.
- Multi-file carousel support: add, preview, and remove individual media files before publishing.
- Upload progress indicator.
- Media files stored securely in Supabase Storage buckets (`posts`), metadata stored in PostgreSQL.

### 5. 24-Hour Expiring Stories
- Top feed horizontal stories bar with signature glowing gradient ring indicators.
- Image and short-video story creation.
- Full-screen story viewer with automatic progress bars, pause on hold/press, and next/prev tap targets.
- Real-time story view tracking (`story_views`).
- Automatic 24-hour expiration enforced at database query and policy levels.

### 6. Explore & Search
- Responsive 3-column media grid with icons for multi-image carousels and videos.
- Debounced search across usernames, display names, and post captions.
- Trending hashtag pills for one-click discovery.
- Privacy filtering: strict exclusion of private account content from unauthorized search viewers.

### 7. Direct Messaging (Vyntra Direct)
- Two-pane conversation list and chat view on desktop, responsive slide view on mobile.
- Real-time message synchronization.
- Read indicators, timestamps, and message bubble alignments.
- Start conversation modal with any followed creator.

### 8. Activity Notifications
- Real-time notifications for:
  - Likes on your posts
  - Comments on your posts
  - New followers
  - Follow requests (for private accounts)
  - Follow request approvals
- Unread notification badges and "Mark all read" action.

### 9. Privacy, Moderation & Social Graph
- Approval workflow for private accounts (Confirm / Decline follow requests).
- Follow, unfollow, and pending request states.
- Block and unblock users.
- Report inappropriate posts, comments, or accounts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS with custom design system |
| **Icons** | Lucide React |
| **Forms & Validation** | React Hook Form & Zod |
| **Routing** | React Router v7 |
| **Backend / DB** | Supabase (PostgreSQL 15+) |
| **Storage** | Supabase Storage (`avatars`, `posts`, `stories`) |
| **Realtime** | Supabase Realtime Channels |
| **Testing** | Vitest & React Testing Library |

---

## 📂 Project Structure

```text
vyntra/
├── public/
│   └── logo.svg                     # Vyntra vector brand icon
├── src/
│   ├── components/
│   │   ├── layout/                  # Sidebar, MobileNav, MobileTopBar, AppLayout
│   │   └── ui/                      # Button, Avatar, Modal, Input, Skeleton, Toast, etc.
│   ├── features/
│   │   ├── auth/                    # AuthContext, LoginPage, RegisterPage, schemas
│   │   ├── feed/                    # FeedPage, PostCard, PostCommentsModal, RightSidebar
│   │   ├── posts/                   # CreatePostModal, PostDetailPage
│   │   ├── stories/                 # StoriesBar, StoryViewerModal, CreateStoryModal
│   │   ├── profiles/                # ProfilePage, EditProfileModal, FollowRequestsModal
│   │   ├── explore/                 # ExplorePage with debounced search and tags
│   │   ├── messages/                # MessagesPage with real-time chat
│   │   ├── notifications/           # NotificationsPage with activity feed
│   │   └── settings/                # SettingsPage with privacy toggles & theme options
│   ├── hooks/                       # useAuth, useTheme, useToast, useDebounce
│   ├── lib/                         # Supabase client, mockStore fallback, utils
│   ├── services/                    # authService, postService, profileService, storyService, etc.
│   ├── test/                        # Vitest test suite (auth, store, utils, UI)
│   └── types/                       # Shared TypeScript models and interfaces
├── supabase/
│   ├── migrations/                  # Complete SQL schema with 18 tables and RLS policies
│   └── seed.sql                     # Seed creators, posts, stories, and interactions
├── .env.example                     # Environment template for Supabase credentials
├── vercel.json                      # Vercel SPA routing and asset caching configuration
└── vite.config.ts                   # Vite & Vitest configuration
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
git clone <repo-url>
cd vyntra
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and Anon key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
> **Preview Mode**: If Supabase credentials are not provided, Vyntra automatically operates in interactive preview mode with local state persistence, allowing immediate end-to-end testing of posts, stories, likes, comments, and navigation.

### 4. Supabase Database Setup
1. In your Supabase Dashboard, navigate to the **SQL Editor**.
2. Run the migration script in `supabase/migrations/20261031000000_init_socialsphere.sql`.
   This creates:
   - All 18 normalized tables (`profiles`, `posts`, `post_media`, `follows`, `follow_requests`, `likes`, `comments`, `saved_posts`, `stories`, `story_views`, `conversations`, `messages`, `notifications`, `blocks`, `reports`, etc.)
   - Row Level Security (RLS) policies enforcing private access control
   - Automated triggers for user profile generation and activity notifications
   - Storage buckets (`avatars`, `posts`, `stories`) and storage policies
3. Run `supabase/seed.sql` to populate sample creators, multi-photo posts, and active 24-hour stories.

### 5. Running the Application
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Execute the automated test suite powered by Vitest:
```bash
npm test
```
Runs unit and integration tests across:
- **Authentication schemas**: email format, username rules, password match verification
- **Utility functions**: hashtag extraction, media validation limits, number and time formatting
- **Store & Services**: post creation, like/unlike toggling, saved posts, comment authorization, and private follow request workflows
- **UI Components**: Avatar fallbacks, Button variants and loading states, EmptyState rendering

---

## 🚢 Deployment

### Frontend (Render)
1. Push your code to your GitHub repository (`main` branch).
2. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** > **Static Site** (or **Blueprint**).
3. Connect your repository (`rankendra23/vyntra`).
4. Configure the settings:
   - **Name**: `vyntra`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Under **Redirects/Rewrites**:
   - Add a rewrite rule: **Source**: `/*` | **Destination**: `/index.html` | **Action**: `Rewrite` (already pre-configured in `render.yaml`).
6. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Create Static Site**.

### Frontend (Vercel)
1. Push code to your Git repository.
2. Import project in Vercel.
3. Set Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. The included `vercel.json` automatically configures client-side SPA routing (`/* -> /index.html`).

### Backend (Supabase)
1. Deploy migrations using the Supabase CLI:
   ```bash
   supabase db push
   ```
2. Enable email authentication in **Authentication > Providers > Email**.
3. Storage buckets `avatars`, `posts`, and `stories` are created automatically with public read access and authenticated upload policies.
