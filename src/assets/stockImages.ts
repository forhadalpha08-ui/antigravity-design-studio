export interface StockImage {
  id: string;
  title: string;
  category: string;
  url: string;
  width: number;
  height: number;
}

export const STOCK_IMAGES: StockImage[] = [
  // Fashion & Luxury
  {
    id: 'fashion-1',
    title: 'Editorial Haute Couture Model',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    width: 1000,
    height: 1500,
  },
  {
    id: 'fashion-2',
    title: 'Minimalist Fashion Portrait',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    width: 1000,
    height: 1400,
  },
  {
    id: 'fashion-3',
    title: 'Streetwear Attitude in Neon',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80',
    width: 1000,
    height: 1250,
  },
  {
    id: 'luxury-watch',
    title: 'Luxury Chronograph Timepiece',
    category: 'Luxury Brand',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 900,
  },
  {
    id: 'luxury-perfume',
    title: 'Black Glass Artisan Perfume',
    category: 'Luxury Brand',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
    width: 1000,
    height: 1400,
  },

  // Tech & Cyberpunk
  {
    id: 'tech-ai',
    title: 'Neural Network AI Visualization',
    category: 'Technology',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'tech-phone',
    title: 'Futuristic Smartphone Device',
    category: 'Technology',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    width: 1000,
    height: 1200,
  },
  {
    id: 'tech-cyberpunk',
    title: 'Tokyo Neon Cyberpunk Alley',
    category: 'Technology',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },

  // Sports & Fitness
  {
    id: 'sports-fitness',
    title: 'Dynamic Athlete Training',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'sports-football',
    title: 'Night Stadium Lights Match',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'sports-basketball',
    title: 'Basketball Court Slam Dunk',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },

  // Music & Entertainment
  {
    id: 'music-festival',
    title: 'Concert Stage Light Flares',
    category: 'Music',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'music-dj',
    title: 'Electronic DJ Mixer Console',
    category: 'Music',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },

  // Food & Restaurant
  {
    id: 'food-gourmet',
    title: 'Michelin Star Gourmet Plating',
    category: 'Restaurant',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'food-coffee',
    title: 'Artisan Latte Art Coffee',
    category: 'Restaurant',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },

  // Travel & Hotels
  {
    id: 'travel-resort',
    title: 'Maldives Overwater Luxury Villa',
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'travel-alps',
    title: 'Alpine Mountain Majestic Peaks',
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },

  // Business & Architecture
  {
    id: 'biz-architecture',
    title: 'Modern Obsidian Glass Skyscraper',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
  {
    id: 'biz-pitch',
    title: 'Executive Conference Presentation',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
  },
];
