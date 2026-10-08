import {
  SearchResultPackage,
  BenchmarkEvidence,
  VideoItem,
  ProductData,
  ProductAttributes,
  AdMetadata,
} from '../types.ts';

// High-quality vertical video preview clips
export const SAMPLE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-hoodie-and-sunglasses-42995-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-sun-in-a-field-42994-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-stylish-woman-in-fashion-clothes-41589-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-fashionable-clothes-41590-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-in-the-morning-42993-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-girl-exercising-in-the-gym-42992-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-opening-a-luxury-box-42038-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-eating-delicious-chocolate-truffles-42289-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-man-tying-his-running-shoes-42991-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-man-wearing-a-watch-41596-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-traveler-with-a-backpack-walking-along-a-trail-42990-large.mp4',
];

// High-res product and lifestyle thumbnails
export const SAMPLE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1608248597359-54a8837119ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
];

export interface PresetItem {
  label: string;
  icon: string;
  category: string;
  query: string;
}

export const PRESET_CATALOG: PresetItem[] = [
  { label: 'Oversized Graphic Tee', icon: '👕', category: 'Streetwear', query: 'oversized graphic tee' },
  { label: 'Protein Dark Chocolate', icon: '🍫', category: 'Nutrition', query: 'protein dark chocolate' },
  { label: 'Retro Running Sneakers', icon: '👟', category: 'Footwear', query: 'sneakers' },
  { label: 'Heavyweight Boxy Hoodie', icon: '🧥', category: 'Apparel', query: 'hoodie' },
  { label: 'Waterproof Commuter Backpack', icon: '🎒', category: 'Gear / EDC', query: 'backpack' },
  { label: 'Ergonomic Mechanical Keyboard', icon: '⌨️', category: 'Tech Desk', query: 'mechanical keyboard' },
  { label: 'Botanical Face Serum', icon: '✨', category: 'Skincare', query: 'face serum' },
  { label: 'Ceramic Pour-Over Dripper', icon: '☕', category: 'Coffee Ware', query: 'pour over dripper' },
];

export const BENCHMARK_EVIDENCE: BenchmarkEvidence[] = [
  {
    productName: 'Oversized Graphic Tee',
    category: 'Streetwear Apparel',
    testQueryOrUrl: 'oversized graphic tee',
    instagramCount: 22,
    metaCount: 24,
    tiktokCount: 12,
    youtubeCount: 8,
    averageScore: 84.5,
    highMatchSample: {
      platform: 'Instagram Reels',
      score: 96,
      reason: 'Exact visual match: video clearly features the oversized streetwear t-shirt with identical washed charcoal tone and gothic angel typography.',
    },
    lowMatchSample: {
      platform: 'Meta Ad Library',
      score: 52,
      reason: 'Low match: generic athletic training shirt; missing distressed wash, dropped shoulders, and gothic font aesthetic.',
    },
    duplicatesFiltered: 6,
    dedupRatio: '11.8%',
  },
  {
    productName: 'Protein Dark Chocolate',
    category: 'Functional Nutrition & CPG',
    testQueryOrUrl: 'protein dark chocolate',
    instagramCount: 20,
    metaCount: 22,
    tiktokCount: 10,
    youtubeCount: 7,
    averageScore: 81.2,
    highMatchSample: {
      platform: 'Meta Ad Library',
      score: 94,
      reason: 'Exact visual match: segmented 12-square 85% cacao bar with visible whey crisps and gold foil packaging in macro slow-motion snap test.',
    },
    lowMatchSample: {
      platform: 'Instagram Reels',
      score: 54,
      reason: 'Low match: chocolate protein shake powder tub rather than solid artisanal dark chocolate confectionery bar.',
    },
    duplicatesFiltered: 8,
    dedupRatio: '16.0%',
  },
  {
    productName: 'Retro Running Sneakers',
    category: 'Footwear & Streetwear',
    testQueryOrUrl: 'sneakers',
    instagramCount: 25,
    metaCount: 22,
    tiktokCount: 14,
    youtubeCount: 9,
    averageScore: 86.8,
    highMatchSample: {
      platform: 'Instagram Reels',
      score: 97,
      reason: 'Exact visual match: low-top retro running silhouette featuring forest green hairy suede panels, gum waffle outsole, and cream nylon mesh.',
    },
    lowMatchSample: {
      platform: 'Meta Ad Library',
      score: 58,
      reason: 'Moderate mismatch: chunky high-top leather basketball shoe with black upper, differing from vintage retro runner suede profile.',
    },
    duplicatesFiltered: 9,
    dedupRatio: '15.5%',
  },
  {
    productName: 'Heavyweight Boxy Hoodie',
    category: 'Casual Streetwear',
    testQueryOrUrl: 'hoodie',
    instagramCount: 21,
    metaCount: 23,
    tiktokCount: 11,
    youtubeCount: 8,
    averageScore: 83.1,
    highMatchSample: {
      platform: 'Meta Ad Library',
      score: 93,
      reason: 'Exact visual match: 450 GSM French Terry boxy hoodie with double-layered seamless hood and ribbed hem in washed charcoal colorway.',
    },
    lowMatchSample: {
      platform: 'Instagram Reels',
      score: 49,
      reason: 'Low match: lightweight zippered polyester windbreaker tracksuit jacket with neon drawstring, lacking heavyweight boxy fleece construction.',
    },
    duplicatesFiltered: 7,
    dedupRatio: '13.7%',
  },
  {
    productName: 'Modular Weatherproof Rolltop Backpack',
    category: 'Travel & Urban EDC',
    testQueryOrUrl: 'backpack',
    instagramCount: 22,
    metaCount: 21,
    tiktokCount: 10,
    youtubeCount: 6,
    averageScore: 85.0,
    highMatchSample: {
      platform: 'Meta Ad Library',
      score: 95,
      reason: 'Exact visual match: 28L TPU-laminated rolltop backpack featuring Fidlock magnetic hardware and waterproof seam construction in city commuter showcase.',
    },
    lowMatchSample: {
      platform: 'Instagram Reels',
      score: 51,
      reason: 'Low match: small canvas floral mini festival daypack with exterior drawstring pockets, inconsistent with waterproof tactical rolltop.',
    },
    duplicatesFiltered: 6,
    dedupRatio: '12.2%',
  },
  {
    productName: 'Ergonomic Mechanical Keyboard',
    category: 'Desk Setup & Tech',
    testQueryOrUrl: 'mechanical keyboard',
    instagramCount: 24,
    metaCount: 20,
    tiktokCount: 15,
    youtubeCount: 11,
    averageScore: 88.2,
    highMatchSample: {
      platform: 'TikTok',
      score: 98,
      reason: 'Exact visual match: gasket-mounted anodized aluminum 75% mechanical keyboard with retro PBT keycaps and sound test.',
    },
    lowMatchSample: {
      platform: 'Meta Ad Library',
      score: 55,
      reason: 'Low match: membrane office keyboard with numeric keypad and low profile scissor switches.',
    },
    duplicatesFiltered: 7,
    dedupRatio: '12.9%',
  },
];

export function generateDiscoveryResults(
  rawQuery: string = 'oversized graphic tee',
  options: {
    includeTikTok?: boolean;
    includeYouTube?: boolean;
    minMatchThreshold?: number;
  } = {}
): SearchResultPackage {
  const query = rawQuery.trim().toLowerCase();

  let title = 'Vintage Acid Wash Heavyweight Oversized Graphic Tee';
  let description = '280 GSM heavyweight washed cotton oversized drop-shoulder t-shirt featuring gothic typography and distressed angel wings graphic on chest and back.';
  let mainImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  let brand = 'Aesthetic Studios';
  let price = '$48.00';
  let category = 'Streetwear Apparel';
  let productType = 'Oversized Streetwear T-Shirt';
  let primaryColors = ['Washed Charcoal', 'Vintage Grey', 'Off-White'];
  let materials = ['280 GSM Combed Cotton', 'Pre-shrunk Vintage Wash'];
  let printsOrGraphics = ['Distressed Gothic/Serif Chest Typography', 'Back Wings Graphic'];
  let logosOrText = ['ATHLETICS 1994', 'LIMITED DROP'];
  let silhouetteShape = 'Boxy drop-shoulder cut, wide ribbed collar';
  let aestheticTags = ['Dark Streetwear', 'Vintage Y2K', 'Oversized Boxy', 'Heavyweight Cotton'];
  let detectedColorHexes = ['#2b2b2b', '#7c7b78', '#f2efe9'];

  if (query.includes('chocolate') || query.includes('cacao') || query.includes('protein')) {
    title = 'Crispy Whey Protein 85% Artisanal Dark Chocolate Bar';
    description = 'Keto-friendly 85% single-origin cacao dark chocolate infused with 15g whey isolate crisps, zero added sugar, and sea salt flakes.';
    mainImage = 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80';
    brand = 'Pulse Nutrition';
    price = '$29.99 (6-Pack)';
    category = 'Functional Nutrition';
    productType = 'Functional Nutrition Protein Chocolate';
    primaryColors = ['Deep Espresso Brown', 'Gold Foil Accent', 'Matte Kraft Paper'];
    materials = ['85% Cacao Mass', 'Whey Isolate Crisps', 'Madagascar Vanilla'];
    printsOrGraphics = ['Geometric Cacao Pod Emblem', 'Gold Embossed Seal'];
    logosOrText = ['15G PROTEIN', 'ZERO SUGAR', 'PULSE BOTANICALS'];
    silhouetteShape = 'Rectangular 12-square breakable confectionery bar';
    aestheticTags = ['Clean Label', 'High Protein Snack', 'Artisanal Cacao', 'Gourmet Wellness'];
    detectedColorHexes = ['#331b14', '#cca462', '#e5dacb'];
  } else if (query.includes('sneaker') || query.includes('shoe') || query.includes('runner')) {
    title = 'Retro Runner Suede Panel Streetwear Sneakers';
    description = 'Low-top retro running silhouette with cream mesh underlay, forest green hairy suede overlays, gum rubber waffle outsole, and reflective 3M heel tab.';
    mainImage = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80';
    brand = 'Apex Footwear';
    price = '$135.00';
    category = 'Footwear';
    productType = 'Retro Streetwear Running Sneakers';
    primaryColors = ['Vintage Sail/Cream', 'Forest Green Suede', 'Gum Amber'];
    materials = ['Hairy Suede Overlays', 'Breathable Nylon Mesh', 'Gum Rubber Outsole'];
    printsOrGraphics = ['Multi-layered Suede Panel Stitching'];
    logosOrText = ['Lateral Quarter Logo', '3M Reflective Heel Tab'];
    silhouetteShape = 'Low-profile tapered runner with flared heel bevel';
    aestheticTags = ['Gorpcore / Retro Runner', 'Vintage Aesthetic', 'Earth Tones', 'Suede Panels'];
    detectedColorHexes = ['#f4eedb', '#2e4939', '#b57934'];
  } else if (query.includes('hoodie') || query.includes('sweatshirt')) {
    title = 'Minimalist Boxy Cut 450 GSM Heavy Fleece Hoodie';
    description = 'Double-layered hood with seamless kangaroo pocket, washed charcoal fleece fabric, dropped shoulders, and ribbed hem cuff construction.';
    mainImage = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
    brand = 'Blank Division';
    price = '$89.00';
    category = 'Streetwear Essentials';
    productType = 'Heavyweight Boxy Fleece Hoodie';
    primaryColors = ['Washed Charcoal', 'Heather Grey', 'Obsidian Black'];
    materials = ['450 GSM French Terry Cotton', 'Brushed Fleece Interior'];
    printsOrGraphics = ['Clean Minimal Solid with Tonal Stitching'];
    logosOrText = ['Micro Embroidered Cuff Tag', 'BLANK DIVISION'];
    silhouetteShape = 'Double-lined hood, seamless kangaroo pouch, relaxed boxy drape';
    aestheticTags = ['Quiet Luxury', 'Heavyweight Streetwear', 'Boxy Fit', 'Minimal Branding'];
    detectedColorHexes = ['#363636', '#8a8a8a', '#1e1e1e'];
  } else if (query.includes('backpack') || query.includes('bag')) {
    title = 'Modular Waterproof Rolltop Commuter Backpack 28L';
    description = 'Matte black TPU laminated weatherproof shell with Fidlock magnetic buckle, ergonomic air-mesh back panel, and padded 16-inch laptop compartment.';
    mainImage = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80';
    brand = 'Aero Cargo Co';
    price = '$120.00';
    category = 'Travel & EDC';
    productType = 'Modular Weatherproof Rolltop Backpack';
    primaryColors = ['Matte Black', 'Gunmetal Hardware', 'Slate Grey'];
    materials = ['840D TPU-Laminated Cordura Nylon', 'YKK Aquaguard Zippers', 'Fidlock Buckles'];
    printsOrGraphics = ['Laser-cut Hypalon Attachment Points'];
    logosOrText = ['AERO CARGO 28L', 'WATERPROOF SEALED'];
    silhouetteShape = 'Tapered rolltop cylinder with dual side compression wings';
    aestheticTags = ['Techwear', 'All-Weather Urban Commuter', 'Minimal EDC', 'Modular Gear'];
    detectedColorHexes = ['#1a1a1a', '#4a4a4a', '#2c333a'];
  } else if (query.includes('keyboard') || query.includes('desk') || query.includes('tech')) {
    title = 'Gasket-Mounted 75% Wireless Mechanical Keyboard';
    description = 'CNC anodized aluminum case with hot-swappable tactile switches, dye-sublimated PBT keycaps, sound-dampening poron foam, and rotary knob.';
    mainImage = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80';
    brand = 'Kinesis Studio';
    price = '$149.00';
    category = 'Tech & Desk Setup';
    productType = 'Custom Mechanical Keyboard';
    primaryColors = ['Chalk White', 'Matcha Green Accent', 'Champagne Brass'];
    materials = ['6063 Aluminum CNC', 'PBT Dye-Sub Keycaps', 'Poron Gasket Foam'];
    printsOrGraphics = ['Minimalist Artisan Esc Keycap'];
    logosOrText = ['KINESIS 75', 'HOT-SWAP PCB'];
    silhouetteShape = 'Compact 75% exploded layout with aluminum chamfered edge';
    aestheticTags = ['Desk Setup Aesthetic', 'Thock Sound Profile', 'Productivity Tech', 'Custom Mech'];
    detectedColorHexes = ['#ebe8df', '#6b8266', '#d4af37'];
  } else if (query.includes('serum') || query.includes('skin') || query.includes('face')) {
    title = 'Botanical Squalane & Ceramide Barrier Face Serum';
    description = 'Concentrated bio-compatible facial oil serum with sugarcane-derived squalane, barrier-restoring ceramide complex, and blue tansy soothing extract.';
    mainImage = 'https://images.unsplash.com/photo-1608248597359-54a8837119ff?auto=format&fit=crop&w=800&q=80';
    brand = 'Lumière Botanica';
    price = '$64.00';
    category = 'Clean Skincare';
    productType = 'Restorative Barrier Face Serum';
    primaryColors = ['Cobalt Blue Dropper Glass', 'Soft Herb Green', 'Matte White'];
    materials = ['Sugarcane Squalane', 'Ceramide NP', 'Blue Tansy Essential Oil'];
    printsOrGraphics = ['Minimalist Botanical Serif Label'];
    logosOrText = ['LUMIÈRE BOTANICA 30ML', 'BARRIER COMPLEX'];
    silhouetteShape = 'Frosted amber/cobalt dropper vial with glass pipette';
    aestheticTags = ['Clean Beauty', 'Glass Skin Routine', 'Dermatologist Tested', 'Aesthetic Vanity'];
    detectedColorHexes = ['#1e3d59', '#7da382', '#f5f5f0'];
  } else if (query.includes('coffee') || query.includes('pour') || query.includes('dripper')) {
    title = 'Matte Ceramic Origami Pour-Over Coffee Dripper';
    description = 'Fluted ceramic coffee dripper with 20 vertical ribs for optimal extraction flow rate, paired with handcrafted walnut collar stand.';
    mainImage = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80';
    brand = 'Kurasu Crafts';
    price = '$42.00';
    category = 'Specialty Coffee';
    productType = 'Conical Ceramic Coffee Brewer';
    primaryColors = ['Sand Dune Matte Ceramic', 'Natural Walnut Wood', 'Pure White'];
    materials = ['Mino-yaki Glazed Ceramic', 'American Walnut Stand'];
    printsOrGraphics = ['20 Fluted Geometric Channels'];
    logosOrText = ['KURASU CRAFTS #02', 'HANDMADE IN JAPAN'];
    silhouetteShape = 'Inverted conical star fluted dripper with wood base';
    aestheticTags = ['Specialty Coffee Ritual', 'Slow Living Aesthetic', 'Japanese Ceramic', 'Barista Tool'];
    detectedColorHexes = ['#d1c7b7', '#5a3d28', '#faf9f6'];
  } else if (query.startsWith('http')) {
    // URL Scraping detection
    title = `Inspected Product: ${query.split('/')[2] || 'Brand Showcase'}`;
    description = 'Multimodal vision scraper automatically analyzed product imagery, DOM architecture, and spec sheet from destination URL.';
    brand = 'Verified DTC Brand';
    price = '$59.00';
    category = 'E-Commerce Product';
  }

  const product: ProductData = {
    title,
    description,
    mainImage,
    brand,
    price,
    category,
    isScraped: rawQuery.startsWith('http'),
    sourceUrl: rawQuery.startsWith('http') ? rawQuery : undefined,
  };

  const attributes: ProductAttributes = {
    productType,
    primaryColors,
    materials,
    printsOrGraphics,
    logosOrText,
    silhouetteShape,
    targetAudience: 'Streetwear, lifestyle, and direct-to-consumer buyers interested in verified authentic products',
    searchKeywords: [
      `${query} review reel`,
      `${query} styling haul`,
      `${query} official video ad`,
      `${brand} viral video`,
    ],
    instagramHashtags: [
      `#${query.replace(/[^a-z0-9]/g, '')}`,
      '#productdiscovery',
      '#unboxing',
      '#aesthetic',
      '#review',
    ],
    metaAdQueries: [
      `${brand} active campaign`,
      `${title.slice(0, 30)} offer ad`,
    ],
    aestheticTags,
    detectedColorHexes,
  };

  const results: VideoItem[] = [];

  // 1. Generate 22 Instagram Reels
  for (let i = 0; i < 22; i++) {
    const score = Math.max(55, Math.min(98, 97 - i * 2));
    const reelId = `ig_reel_${1000000 + i * 8321}`;
    const authors = [
      { name: 'Streetwear Archive', handle: 'streetwearfits' },
      { name: 'Marcus Lookbook', handle: 'marcus_kicks' },
      { name: 'Style Curation Daily', handle: 'stylecuration' },
      { name: 'Elena Minimalist', handle: 'elena_fits' },
      { name: 'Drop Alert HQ', handle: 'dropalerthq' },
      { name: 'Modern Lifestyle', handle: 'modern_lifestyle' },
    ];
    const author = authors[i % authors.length];

    const hooks = [
      {
        hookType: 'Shock & Awe',
        firstThreeSeconds: 'Close-up texture macro shot showing premium fabric density & tag verification.',
        visualHook: 'Dropping shirt onto marble table with audible heavy thud sound.',
        spokenText: 'Wait, this might actually be the best quality blank of the whole year...',
      },
      {
        hookType: 'Comparison / Value',
        firstThreeSeconds: 'Split-screen comparing $250 designer piece vs this $48 version.',
        visualHook: 'Side by side seam comparison under natural daylight.',
        spokenText: 'Stop paying $250 when this brand literally used the exact same Italian mill...',
      },
      {
        hookType: 'ASMR Unboxing',
        firstThreeSeconds: 'Crisp cardboard box slice and heavy paper crinkle sounds.',
        visualHook: 'Finger sliding open the custom frosted ziploc dust bag.',
        spokenText: 'Listen to the weight on this 280 GSM cotton...',
      },
    ];
    const hook = hooks[i % hooks.length];

    results.push({
      id: reelId,
      platform: 'instagram',
      title: `${title} - Lookbook Reel #${i + 1}`,
      caption: `Unboxing the new ${title}! The ${primaryColors[0]} tone in person is crazy 🔥 Quality on the ${materials[0]} is insane. Rate 1-10 👇 #${query.replace(/[^a-z0-9]/g, '')} #reels #unboxing #aesthetic`,
      thumbnailUrl: SAMPLE_THUMBNAILS[i % SAMPLE_THUMBNAILS.length],
      videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
      sourceUrl: `https://www.instagram.com/reel/${reelId}/`,
      author: {
        name: author.name,
        handle: author.handle,
        verified: i % 2 === 0,
      },
      metrics: {
        views: 14200 + i * 3800,
        likes: 1250 + i * 340,
        comments: 48 + i * 9,
        shares: 32 + i * 6,
      },
      matchScore: score,
      matchReason:
        score >= 85
          ? `Exact visual match: video clearly features the ${productType.toLowerCase()} with identical ${primaryColors[0]} tone and ${printsOrGraphics[0]}.`
          : `High visual similarity: matches silhouette and ${materials[0]} in lifestyle reel.`,
      detectedVisualFeatures: [
        `Colorway: ${primaryColors[0]}`,
        `Material: ${materials[0]}`,
        `Silhouette: ${silhouetteShape.split(',')[0]}`,
      ],
      scoreBreakdown: {
        colorway: Math.min(100, score + (i % 5)),
        silhouette: Math.min(100, score - (i % 4)),
        material: Math.min(100, score - (i % 6)),
        graphicLogo: Math.min(100, score + 2),
      },
      hookAnalysis: hook,
      isMatch: score >= 60,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      contentHash: `hash_ig_${reelId}`,
    });
  }

  // 2. Generate 24 Meta Ad Library Videos
  for (let i = 0; i < 24; i++) {
    const score = Math.max(52, Math.min(97, 95 - i * 2));
    const adId = `${3004819280 + i * 9912}`;
    const daysActive = Math.floor(12 + (24 - i) * 3);
    const creativeAngles: AdMetadata['creativeAngle'][] = [
      'UGC Testimonial',
      'Problem-Solution',
      'Aesthetic Showcase',
      'Unboxing / ASMR',
      'Founder Story',
      'Commercial',
    ];
    const creativeAngle = creativeAngles[i % creativeAngles.length];

    results.push({
      id: `meta_ad_${adId}`,
      platform: 'meta',
      title: `${brand} Sponsored Video Campaign`,
      caption: `Back in stock for a limited time. The ${title} engineered with ${materials[0]}. Enjoy 15% off your first order today. Free shipping over $75.`,
      thumbnailUrl: SAMPLE_THUMBNAILS[(i + 3) % SAMPLE_THUMBNAILS.length],
      videoUrl: SAMPLE_VIDEOS[(i + 2) % SAMPLE_VIDEOS.length],
      sourceUrl: `https://www.facebook.com/ads/library/?id=${adId}`,
      author: {
        name: brand,
        handle: brand.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        verified: true,
      },
      adMetadata: {
        adId,
        advertiserName: brand,
        runningStatus: 'Active',
        startedRunningDate: `Active since Oct 2026`,
        platformsIncluded: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
        callToAction: i % 2 === 0 ? 'Shop Now' : 'Learn More',
        daysActive,
        estimatedSpend: daysActive > 30 ? '$5,000 - $10,000+ (High Scaling)' : '$1,000 - $3,000 (Testing)',
        creativeAngle,
      },
      metrics: {
        views: 28000 + i * 5400,
        likes: 1800 + i * 410,
        comments: 65 + i * 14,
        shares: 88 + i * 12,
      },
      matchScore: score,
      matchReason:
        score >= 85
          ? `Exact visual match: official commercial ad showcasing ${title} with ${printsOrGraphics[0]}.`
          : `Close visual match: features ${productType.toLowerCase()} in motion with matching ${primaryColors[0]}.`,
      detectedVisualFeatures: [
        `Brand Campaign: ${brand}`,
        `Angle: ${creativeAngle}`,
        `Graphic: ${printsOrGraphics[0]}`,
      ],
      scoreBreakdown: {
        colorway: Math.min(100, score + 2),
        silhouette: Math.min(100, score),
        material: Math.min(100, score - 3),
        graphicLogo: Math.min(100, score + 4),
      },
      hookAnalysis: {
        hookType: creativeAngle || 'Commercial',
        firstThreeSeconds: `Fast dynamic cut showing ${productType} worn in outdoor cinematic setting.`,
        visualHook: `Split text overlay: "Why everyone is obsessed with ${brand}"`,
        spokenText: `If you have been looking for the perfect ${productType.toLowerCase()}, don't scroll...`,
      },
      isMatch: score >= 60,
      publishedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      contentHash: `hash_meta_${adId}`,
    });
  }

  // 3. Generate 12 TikTok Videos (New Feature!)
  for (let i = 0; i < 12; i++) {
    const score = Math.max(62, Math.min(99, 98 - i * 3));
    const tiktokId = `tiktok_${7000000000000 + i * 44211}`;
    results.push({
      id: tiktokId,
      platform: 'tiktok',
      title: `TikTok Viral Review • ${title}`,
      caption: `I bought the viral ${title} so you don't have to 😭 Honest review! The ${primaryColors[0]} is unreal #tiktokmademebuyit #streetwear #haul #foryou`,
      thumbnailUrl: SAMPLE_THUMBNAILS[(i + 6) % SAMPLE_THUMBNAILS.length],
      videoUrl: SAMPLE_VIDEOS[(i + 4) % SAMPLE_VIDEOS.length],
      sourceUrl: `https://www.tiktok.com/@creator/video/${tiktokId}`,
      author: {
        name: `TikTok Trendsetter @${i + 1}`,
        handle: `creator_fits_${i + 1}`,
        verified: i % 3 === 0,
      },
      metrics: {
        views: 85000 + i * 22000,
        likes: 9400 + i * 1800,
        comments: 320 + i * 45,
        shares: 610 + i * 80,
      },
      matchScore: score,
      matchReason:
        score >= 88
          ? `Exact viral match: creator shows the ${title} with high-clarity collar and texture inspection.`
          : `Strong aesthetic match: demonstrates real-life drape and color rendering.`,
      detectedVisualFeatures: [
        `TikTok Sound: Viral Audio #09`,
        `Lighting: Daylight Natural`,
        `Fit: True to size / Oversized`,
      ],
      scoreBreakdown: {
        colorway: Math.min(100, score + 3),
        silhouette: Math.min(100, score - 1),
        material: Math.min(100, score + 1),
        graphicLogo: Math.min(100, score - 4),
      },
      hookAnalysis: {
        hookType: 'Relatable Problem',
        firstThreeSeconds: 'Creator holding up shirt right out of package with dramatic expression.',
        visualHook: 'Rapid jump-cut to full mirror lookbook.',
        spokenText: 'I thought this was overhyped until I actually put it on...',
      },
      isMatch: score >= 60,
      publishedAt: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
      contentHash: `hash_tiktok_${tiktokId}`,
    });
  }

  // 4. Generate 8 YouTube Shorts (New Feature!)
  for (let i = 0; i < 8; i++) {
    const score = Math.max(65, Math.min(96, 94 - i * 3));
    const ytId = `yt_short_${88000 + i * 143}`;
    results.push({
      id: ytId,
      platform: 'youtube',
      title: `YouTube Short: ${title} Deep Dive`,
      caption: `Is ${title} worth the hype? Full construction breakdown and wear test #shorts #fashion #review`,
      thumbnailUrl: SAMPLE_THUMBNAILS[(i + 8) % SAMPLE_THUMBNAILS.length],
      videoUrl: SAMPLE_VIDEOS[(i + 6) % SAMPLE_VIDEOS.length],
      sourceUrl: `https://www.youtube.com/shorts/${ytId}`,
      author: {
        name: `Menswear Curation Studio`,
        handle: `menswear_studio`,
        verified: true,
      },
      metrics: {
        views: 42000 + i * 11000,
        likes: 3100 + i * 620,
        comments: 98 + i * 15,
        shares: 140 + i * 22,
      },
      matchScore: score,
      matchReason: `High visual confidence: 4K camera close-up of fabric stitch density and silhouette drop.`,
      detectedVisualFeatures: [
        `Format: 60fps 4K Short`,
        `Silhouette: ${silhouetteShape.split(',')[0]}`,
      ],
      scoreBreakdown: {
        colorway: score,
        silhouette: score,
        material: Math.min(100, score + 4),
        graphicLogo: Math.min(100, score - 2),
      },
      hookAnalysis: {
        hookType: 'Educational / Deep-Dive',
        firstThreeSeconds: 'Macro microscope shot of thread count & weave structure.',
        visualHook: 'Weight scale measuring garment in grams.',
        spokenText: 'Let me show you how to spot a real 280 GSM shirt from a fake one...',
      },
      isMatch: score >= 60,
      publishedAt: new Date(Date.now() - (i + 3) * 86400000).toISOString(),
      contentHash: `hash_yt_${ytId}`,
    });
  }

  return {
    id: `search_${Date.now()}`,
    query: rawQuery,
    product,
    attributes,
    totalVideos: results.length,
    instagramCount: 22,
    metaCount: 24,
    tiktokCount: 12,
    youtubeCount: 8,
    filteredDuplicatesCount: 6,
    results,
    createdAt: new Date().toISOString(),
  };
}
