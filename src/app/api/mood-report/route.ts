import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { authenticateApiRoute } from '@/utils/supabase-server';
import { MoodLog, PeriodMoodReport } from '@/types/database';

interface PeriodReportRequest {
  period: string;
  mood_data: MoodLog[];
  start_date: string;
  end_date: string;
}

interface MoodAnalysis {
  averageMood: number;
  moodRange: {
    min: number;
    max: number;
  };
  mostCommonEmoji: string;
  trend: string;
  moodSummary: string;
  totalEntries: number;
}

// Vercel-specific configurations
export const runtime = 'nodejs';
export const maxDuration = 10; // Reduced for Vercel

// Import CBT prompts and guidance
import {
  getMoodGuidance,
  getRandomTechnique,
  CRISIS_RESOURCES,
  MOOD_SPECIFIC_GUIDANCE,
} from '../../../lib/cbtPrompts';

// Helper function to create fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 5000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond');
    }
    throw error;
  }
}

// Add OPTIONS handler for Vercel CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  // Add Vercel-specific headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log('[Vercel] Starting mood report generation...');

    // Create Supabase client with proper cookie handling for Vercel
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get session - in Vercel, this should work with the cookie-based auth
    let session = null;
    try {
      const {
        data: { session: sessionData },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn(
          '[Vercel] Session error (continuing anonymously):',
          sessionError
        );
      }
      session = sessionData;
    } catch (error) {
      console.warn(
        '[Vercel] Failed to get session (continuing anonymously):',
        error
      );
    }

    // Always allow mood report generation, even for anonymous users
    const isAuthenticated = !!session?.user;
    console.log(
      '[Vercel] Authentication status:',
      isAuthenticated ? 'authenticated' : 'anonymous'
    );

    if (!isAuthenticated) {
      console.log('[Vercel] Processing anonymous mood report request');
    }

    const body = await request.json();
    console.log('[Vercel] Request body received:', body);

    // Handle period reports
    if (body.type === 'period') {
      console.log('[Vercel] Generating period report...');
      const periodReport = await generatePeriodReport(body);
      console.log('[Vercel] Period report completed:', periodReport);
      return NextResponse.json(periodReport, {
        status: 200,
        headers,
      });
    }

    // Handle daily reports
    const { mood_emoji, mood_rating, mood_note } = body;

    if (mood_emoji === undefined || mood_rating === undefined) {
      console.log('[Vercel] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      );
    }

    console.log('[Vercel] Generating daily mood report...');
    // Generate mood report
    const report = await generateDailyMoodReport(
      mood_emoji,
      mood_rating,
      mood_note
    );

    console.log('[Vercel] Report generated successfully:', report);

    // Return successful response with Vercel-optimized headers
    return NextResponse.json(report, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Vercel] Error in mood-report API:', error);

    // Always return a valid fallback response for Vercel
    const fallbackResponse = {
      insight:
        'Thank you for checking in with your mood today. Self-awareness is a key component of emotional wellness.',
      cbtTechnique:
        'Try the 5-4-3-2-1 grounding technique: notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
      affirmation:
        'I am taking positive steps toward understanding and caring for my emotional well-being.',
      actionStep:
        'Take a moment to acknowledge your feelings and practice self-compassion.',
    };

    console.log('[Vercel] Returning fallback response');

    return NextResponse.json(fallbackResponse, {
      status: 200,
      headers,
    });
  }
}

async function generateDailyMoodReport(
  mood_emoji: string,
  mood_rating: number,
  mood_note: string
) {
  // Get fallback content first
  const moodGuidance = getMoodGuidance(mood_rating);
  const fallbackReport = {
    insight: moodGuidance.focus,
    cbtTechnique: getRandomTechnique('grounding'),
    affirmation:
      moodGuidance.affirmations[
        Math.floor(Math.random() * moodGuidance.affirmations.length)
      ],
    actionStep:
      'Take a moment to acknowledge your feelings and practice self-compassion. Consider what small positive action you can take today.',
  };

  // Try to get AI-generated content with longer timeout for Vercel
  try {
    console.log('[Vercel] Attempting AI generation with Together AI...');

    const systemPrompt = `You are Gigi, an empathetic AI Thought-Coach specializing in mood support and CBT techniques.

Generate a brief, personalized mood report as valid JSON with exactly these 4 fields:
- insight: 1-2 sentences about their emotional state
- cbtTechnique: One specific, actionable CBT technique 
- affirmation: One positive, personal affirmation
- actionStep: One concrete action they can take today

Mood: ${mood_emoji} (${mood_rating}/10)
Context: ${mood_note || 'No additional context'}

Be warm, supportive, and practical. Focus on CBT concepts like mindfulness, thought challenging, or behavioral activation.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no extra text. Ensure all strings are properly escaped.

Example format:
{
  "insight": "Your response here",
  "cbtTechnique": "Your technique here", 
  "affirmation": "Your affirmation here",
  "actionStep": "Your action here"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for Vercel

    const response = await fetch(
      'https://api.together.xyz/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo', // Faster model
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Mood: ${mood_emoji} ${mood_rating}/10. ${mood_note ? `Note: ${mood_note}` : 'No note.'}`,
            },
          ],
          max_tokens: 200, // Reduced for faster response
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Vercel] Together AI API error: ${response.status}`);
      throw new Error(`Together AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Together AI');
    }

    console.log('[Vercel] Raw AI content:', content);

    // Clean and validate JSON response
    let cleanedContent = content.trim();

    // Fix common JSON issues
    cleanedContent = cleanedContent
      .replace(/```json\s*/g, '') // Remove markdown code blocks
      .replace(/```\s*/g, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\n\s*\n/g, '\n') // Remove double newlines
      .trim();

    // Try to extract JSON if it's embedded in text
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    }

    console.log('[Vercel] Cleaned AI content:', cleanedContent);

    let parsedReport;
    try {
      parsedReport = JSON.parse(cleanedContent);
      console.log('[Vercel] AI report parsed successfully:', parsedReport);
    } catch (parseError) {
      console.error(
        '[Vercel] JSON parse failed, attempting manual extraction:',
        parseError
      );
      console.error('[Vercel] Problematic content:', cleanedContent);

      // Manual extraction as last resort using more robust regex
      const extractField = (field: string, content: string) => {
        // Try multiple patterns to extract field values
        const patterns = [
          new RegExp(`"${field}"\\s*:\\s*"([^"\\\\]*(\\\\.[^"\\\\]*)*)"`, 'i'),
          new RegExp(`"${field}"\\s*:\\s*'([^'\\\\]*(\\\\.[^'\\\\]*)*)'`, 'i'),
          new RegExp(`${field}\\s*:\\s*"([^"\\\\]*(\\\\.[^"\\\\]*)*)"`, 'i'),
        ];

        for (const pattern of patterns) {
          const match = content.match(pattern);
          if (match && match[1]) {
            return match[1].replace(/\\"/g, '"').replace(/\\'/g, "'");
          }
        }
        return null;
      };

      parsedReport = {
        insight:
          extractField('insight', cleanedContent) || fallbackReport.insight,
        cbtTechnique:
          extractField('cbtTechnique', cleanedContent) ||
          extractField('cbt_technique', cleanedContent) ||
          fallbackReport.cbtTechnique,
        affirmation:
          extractField('affirmation', cleanedContent) ||
          fallbackReport.affirmation,
        actionStep:
          extractField('actionStep', cleanedContent) ||
          extractField('action_step', cleanedContent) ||
          fallbackReport.actionStep,
      };

      console.log('[Vercel] Manual extraction result:', parsedReport);
    }

    // Validate and merge with fallbacks
    return {
      insight: parsedReport.insight || fallbackReport.insight,
      cbtTechnique: parsedReport.cbtTechnique || fallbackReport.cbtTechnique,
      affirmation: parsedReport.affirmation || fallbackReport.affirmation,
      actionStep: parsedReport.actionStep || fallbackReport.actionStep,
    };
  } catch (error) {
    console.error('[Vercel] Error with Together AI, using fallback:', error);
    console.log('Returning fallback mood report for reliability');
    return fallbackReport;
  }
}

async function generatePeriodReport(body: PeriodReportRequest) {
  const { period, mood_data, start_date, end_date } = body;

  if (!mood_data || mood_data.length === 0) {
    throw new Error('No mood data provided');
  }

  console.log(
    `[Vercel] Generating ${period} period report for ${mood_data.length} entries`
  );

  // Analyze mood data
  const analysis = analyzeMoodData(mood_data);

  // Create comprehensive period report
  const periodReport: PeriodMoodReport = {
    overview: `Over the past ${period}, you've been tracking your emotional wellness with ${mood_data.length} entries. Your average mood was ${analysis.averageMood.toFixed(1)}/10, showing ${analysis.trend} patterns.`,
    insights: [
      `Your most common mood was ${analysis.mostCommonEmoji}`,
      `Your mood ranged from ${analysis.moodRange.min} to ${analysis.moodRange.max}`,
      `You showed ${analysis.trend} emotional patterns`,
    ],
    cbtTechnique: getRandomTechnique('grounding'),
    affirmation:
      "You're building valuable self-awareness through consistent mood tracking.",
    recommendations: [
      'Continue your daily mood tracking practice',
      'Notice patterns and triggers in your emotional responses',
      'Practice self-compassion during challenging periods',
    ],
    statistics: analysis,
    period,
    dateRange: `${start_date} to ${end_date}`,
    totalEntries: mood_data.length,
  };

  console.log('[Vercel] Period report generated successfully');
  return periodReport; // Return the data directly, not wrapped in NextResponse
}

function analyzeMoodData(moodData: MoodLog[]): MoodAnalysis {
  // Filter out entries with null values for analysis
  const validEntries = moodData.filter(
    (entry) => entry.mood_rating !== null && entry.mood_emoji !== null
  );

  if (validEntries.length === 0) {
    throw new Error('No valid mood data found');
  }

  const ratings = validEntries.map((entry) => entry.mood_rating!);
  const emojis = validEntries.map((entry) => entry.mood_emoji!);

  // Calculate statistics
  const averageMood =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  const moodRange = {
    min: Math.min(...ratings),
    max: Math.max(...ratings),
  };

  // Find most common emoji
  const emojiCounts = emojis.reduce(
    (acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedEmojis = Object.entries(emojiCounts).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );
  const mostCommonEmoji = sortedEmojis.length > 0 ? sortedEmojis[0]![0] : '😊';

  // Determine trend (simple linear regression on last 7 days if available)
  let trend = 'stable';
  if (ratings.length >= 3) {
    const recentRatings = ratings.slice(-Math.min(7, ratings.length));
    const firstHalf = recentRatings.slice(
      0,
      Math.ceil(recentRatings.length / 2)
    );
    const secondHalf = recentRatings.slice(Math.ceil(recentRatings.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 0.5) trend = 'improving';
    else if (secondAvg < firstAvg - 0.5) trend = 'declining';
  }

  // Create mood summary
  const moodSummary = validEntries
    .slice(0, 5)
    .map(
      (entry) =>
        `${entry.mood_emoji} (${entry.mood_rating}/10)${entry.mood_note ? `: ${entry.mood_note.substring(0, 50)}...` : ''}`
    )
    .join('\n');

  return {
    averageMood,
    moodRange,
    mostCommonEmoji,
    trend,
    moodSummary,
    totalEntries: validEntries.length,
  };
}
