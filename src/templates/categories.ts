export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: CategoryMeta[] = [
  { id: 'all', name: 'All Templates', icon: 'LayoutGrid', description: 'Browse the entire collection of 50 exclusive studio designs' },
  { id: 'social-media', name: 'Social Media', icon: 'Share2', description: 'Engaging content tailored for all major networks' },
  { id: 'instagram-post', name: 'Instagram Post', icon: 'Instagram', description: 'Square 1080x1080 feed showstoppers' },
  { id: 'instagram-story', name: 'Instagram Story', icon: 'Smartphone', description: 'Full-bleed vertical story templates' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', icon: 'Youtube', description: 'High-CTR click-worthy thumbnail designs' },
  { id: 'youtube-banner', name: 'YouTube Banner', icon: 'Tv', description: 'Ultra-wide 2560x1440 channel headers' },
  { id: 'facebook-post', name: 'Facebook Post', icon: 'Facebook', description: 'Optimized landscape marketing graphics' },
  { id: 'advertisement', name: 'Advertisement', icon: 'Megaphone', description: 'High-converting display and campaign ads' },
  { id: 'fashion', name: 'Fashion', icon: 'Sparkles', description: 'Haute couture, streetwear and apparel campaigns' },
  { id: 'luxury-brand', name: 'Luxury Brand', icon: 'Crown', description: 'Editorial black, gold and velvet aesthetics' },
  { id: 'business', name: 'Business', icon: 'Briefcase', description: 'Corporate announcements and executive collateral' },
  { id: 'technology', name: 'Technology', icon: 'Cpu', description: 'AI startups, SaaS launches and hardware banners' },
  { id: 'event', name: 'Event', icon: 'Calendar', description: 'Conferences, summits and gala announcements' },
  { id: 'sports', name: 'Sports', icon: 'Activity', description: 'High-octane athletics, matches and fitness posters' },
  { id: 'music', name: 'Music', icon: 'Music', description: 'Festival posters, DJ gigs and tour schedules' },
  { id: 'restaurant', name: 'Restaurant', icon: 'Utensils', description: 'Fine dining menus, promotions and café specials' },
  { id: 'travel', name: 'Travel', icon: 'Compass', description: 'Exotic voyages, boutique resorts and summer wanderlust' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Masterclasses, webinars and academy courses' },
  { id: 'portfolio', name: 'Portfolio', icon: 'UserCheck', description: 'Personal brand covers and creative showcases' },
  { id: 'presentation', name: 'Presentation', icon: 'Presentation', description: '16:9 widescreen startup pitch decks' },
  { id: 'poster', name: 'Poster', icon: 'Image', description: 'Print-ready cinematic and gallery posters' },
  { id: 'flyer', name: 'Flyer', icon: 'FileText', description: 'Versatile marketing and event flyers' },
  { id: 'product-advertisement', name: 'Product Advertisement', icon: 'ShoppingBag', description: 'E-commerce highlights and flagship debuts' },
  { id: 'certificate', name: 'Certificate', icon: 'Award', description: 'Official completion awards and diplomas' },
  { id: 'invitation', name: 'Invitation', icon: 'Mail', description: 'Weddings, VIP receptions and milestone birthdays' },
  { id: 'quote', name: 'Quote', icon: 'Quote', description: 'Inspirational typographic poster moments' },
  { id: 'magazine', name: 'Magazine', icon: 'BookOpen', description: 'Vogue-style publication covers' },
  { id: 'album-cover', name: 'Album Cover', icon: 'Disc', description: 'Square vinyl and streaming artwork' },
  { id: 'website-hero', name: 'Website Hero', icon: 'Globe', description: 'Full-bleed desktop landing page headers' },
  { id: 'mobile-ui', name: 'Mobile UI', icon: 'Tablet', description: 'Sleek app mockups and product stories' },
  { id: 'wallpaper', name: 'Wallpaper', icon: 'Monitor', description: 'Curated 4K desktop and mobile backgrounds' },
];
