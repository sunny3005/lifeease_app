import { sql } from '../../config/db.js';

// Setup AI suggestions table for storing user preferences
export async function setupAISuggestionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_suggestions (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(50) NOT NULL,
      suggestion_data JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// AI Outfit Suggestion based on user's wardrobe
export const suggestOutfit = async (req, res) => {
  const { category } = req.query;
  const userId = req.user?.id;

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {
    // Get user's outfits for the specified category
    const outfits = await sql`
      SELECT * FROM outfits 
      WHERE category = ${category}
      ORDER BY id DESC
    `;

    if (outfits.length === 0) {
      return res.json({
        success: false,
        message: `No ${category.toLowerCase()} outfits available in your wardrobe`,
        suggestion: null,
        tips: getStyleTips(category)
      });
    }

    // AI logic: Select outfit based on various factors
    const suggestedOutfit = selectBestOutfit(outfits, category);
    
    // Get AI styling tips for the category
    const stylingTips = getStyleTips(category);
    const colorRecommendations = getColorRecommendations(category);

    // Store suggestion in database for learning
    if (userId) {
      await sql`
        INSERT INTO ai_suggestions (user_id, category, suggestion_data)
        VALUES (${userId}, ${category}, ${JSON.stringify({
          outfit_id: suggestedOutfit.id,
          tips: stylingTips,
          colors: colorRecommendations
        })})
      `;
    }

    res.json({
      success: true,
      message: `Perfect ${category.toLowerCase()} outfit suggestion for you!`,
      suggestion: {
        outfit: suggestedOutfit,
        tips: stylingTips,
        colors: colorRecommendations,
        mood: getMoodForCategory(category)
      }
    });

  } catch (err) {
    console.error('[AI_SUGGEST] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate outfit suggestion' });
  }
};

// Smart outfit selection algorithm
function selectBestOutfit(outfits, category) {
  // For now, we'll use a simple random selection
  // In a real AI system, this would consider:
  // - Weather conditions
  // - User's past preferences
  // - Occasion/time of day
  // - Color coordination
  // - Style trends
  
  const randomIndex = Math.floor(Math.random() * outfits.length);
  return outfits[randomIndex];
}

// Get styling tips based on category
function getStyleTips(category) {
  const tips = {
    Casual: [
      "Mix textures for visual interest - try denim with cotton or knits",
      "Layer pieces to create depth and adapt to temperature changes",
      "Choose comfortable shoes that you can walk in all day",
      "Add a pop of color with accessories like scarves or bags",
      "Keep it simple - less is often more for casual looks"
    ],
    Formal: [
      "Ensure proper fit - tailored clothes always look more expensive",
      "Stick to classic colors like navy, black, white, and gray",
      "Invest in quality shoes - they make or break a formal outfit",
      "Pay attention to details like pressed clothes and polished accessories",
      "Choose fabrics that don't wrinkle easily for all-day confidence"
    ],
    Sports: [
      "Prioritize moisture-wicking fabrics to stay dry and comfortable",
      "Choose proper athletic shoes for your specific activity",
      "Layer appropriately for outdoor activities and weather changes",
      "Bright colors can boost energy and motivation during workouts",
      "Ensure clothes allow full range of motion for your activities"
    ],
    Party: [
      "Don't be afraid to experiment with bold colors and patterns",
      "Add statement accessories to elevate your look",
      "Choose fabrics with interesting textures like silk, velvet, or sequins",
      "Consider the venue and dress code when selecting your outfit",
      "Comfort is key - you'll want to enjoy the party, not adjust your clothes"
    ],
    Others: [
      "Express your personal style and don't follow trends blindly",
      "Mix different styles to create unique, personalized looks",
      "Consider the occasion and dress appropriately",
      "Confidence is your best accessory - wear what makes you feel good",
      "Experiment with new combinations from your existing wardrobe"
    ]
  };

  return tips[category] || tips.Others;
}

// Get color recommendations for each category
function getColorRecommendations(category) {
  const colors = {
    Casual: ["Navy Blue", "White", "Light Gray", "Beige", "Soft Pink", "Mint Green"],
    Formal: ["Black", "Navy", "Charcoal Gray", "White", "Burgundy", "Deep Blue"],
    Sports: ["Bright Blue", "Neon Green", "Black", "Red", "Orange", "Electric Purple"],
    Party: ["Gold", "Deep Red", "Emerald Green", "Royal Blue", "Silver", "Hot Pink"],
    Others: ["Coral", "Lavender", "Sage Green", "Mustard Yellow", "Terracotta", "Dusty Rose"]
  };

  return colors[category] || colors.Others;
}

// Get mood description for category
function getMoodForCategory(category) {
  const moods = {
    Casual: "Relaxed and effortlessly stylish",
    Formal: "Confident and professionally polished",
    Sports: "Energetic and performance-ready",
    Party: "Fun, glamorous, and ready to celebrate",
    Others: "Creative and uniquely you"
  };

  return moods[category] || moods.Others;
}

// Get personalized recommendations based on user history
export const getPersonalizedRecommendations = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get user's recent suggestions and preferences
    const recentSuggestions = await sql`
      SELECT category, suggestion_data, created_at
      FROM ai_suggestions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get user's outfit distribution by category
    const outfitStats = await sql`
      SELECT category, COUNT(*) as count
      FROM outfits
      GROUP BY category
      ORDER BY count DESC
    `;

    // Generate personalized insights
    const insights = generatePersonalizedInsights(recentSuggestions, outfitStats);

    res.json({
      success: true,
      insights,
      recentSuggestions: recentSuggestions.slice(0, 5),
      wardrobeStats: outfitStats
    });

  } catch (err) {
    console.error('[PERSONALIZED_RECOMMENDATIONS] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate personalized recommendations' });
  }
};

function generatePersonalizedInsights(suggestions, stats) {
  const insights = [];

  // Analyze wardrobe distribution
  if (stats.length > 0) {
    const totalOutfits = stats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const dominantCategory = stats[0];
    
    if (parseInt(dominantCategory.count) > totalOutfits * 0.5) {
      insights.push({
        type: 'wardrobe_balance',
        message: `You have a lot of ${dominantCategory.category.toLowerCase()} outfits! Consider adding more variety to your wardrobe.`,
        suggestion: 'Try exploring other categories to create more diverse looks.'
      });
    }
  }

  // Analyze recent preferences
  if (suggestions.length > 0) {
    const categoryFrequency = {};
    suggestions.forEach(suggestion => {
      categoryFrequency[suggestion.category] = (categoryFrequency[suggestion.category] || 0) + 1;
    });

    const favoriteCategory = Object.keys(categoryFrequency).reduce((a, b) => 
      categoryFrequency[a] > categoryFrequency[b] ? a : b
    );

    insights.push({
      type: 'style_preference',
      message: `You seem to love ${favoriteCategory.toLowerCase()} styles!`,
      suggestion: `Here are some fresh ideas to elevate your ${favoriteCategory.toLowerCase()} looks.`
    });
  }

  // Add seasonal recommendations
  const currentMonth = new Date().getMonth();
  const seasonalTip = getSeasonalTip(currentMonth);
  insights.push({
    type: 'seasonal',
    message: seasonalTip.message,
    suggestion: seasonalTip.suggestion
  });

  return insights;
}

function getSeasonalTip(month) {
  if (month >= 2 && month <= 4) { // Spring
    return {
      message: "Spring is here! Time to refresh your wardrobe with lighter fabrics and brighter colors.",
      suggestion: "Consider adding pastels, florals, and lightweight layers to your collection."
    };
  } else if (month >= 5 && month <= 7) { // Summer
    return {
      message: "Summer vibes! Focus on breathable fabrics and sun-ready styles.",
      suggestion: "Linen, cotton, and light colors will keep you cool and stylish."
    };
  } else if (month >= 8 && month <= 10) { // Fall
    return {
      message: "Fall fashion is all about cozy layers and rich, warm tones.",
      suggestion: "Think sweaters, boots, and earthy colors like burgundy and mustard."
    };
  } else { // Winter
    return {
      message: "Winter calls for warmth without sacrificing style.",
      suggestion: "Layer smartly with coats, scarves, and boots in classic winter colors."
    };
  }
}