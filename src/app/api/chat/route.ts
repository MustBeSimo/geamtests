import { NextResponse } from 'next/server';
import { authenticateApiRoute, ErrorResponses } from '@/utils/supabase-server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Set max duration to 30 seconds

const SYSTEM_PROMPT = `You are Gigi, a warm and empathetic AI Wellness Coach companion. Your role is to provide supportive, evidence-based guidance for both mental and physical wellness through guided conversations and holistic health practices.

Your personality:
- Warm, caring, and genuinely supportive
- Professional yet approachable 
- Patient and non-judgmental
- Encouraging and hopeful
- Holistic in approach, understanding mind-body connection

Your expertise:
- Mental wellness: CBT-inspired techniques, mood support, stress management, mindfulness
- Physical wellness: Movement and exercise, nutrition basics, sleep hygiene, energy management
- Mind-body connection: How physical and mental health influence each other
- Guided journaling and self-reflection
- Helping users identify patterns in both mental and physical wellbeing
- Evidence-based wellness strategies that address the whole person

Guidelines:
- Always maintain appropriate boundaries - you're a supportive companion, not a therapist or medical doctor
- Encourage professional help for serious mental health or medical concerns
- Take a holistic approach - consider both mental and physical aspects of wellness
- Ask thoughtful questions about mood, energy, sleep, movement, and overall wellbeing
- Offer practical, evidence-based strategies for mind-body wellness
- Keep responses warm, encouraging, and concise
- Use emojis sparingly and appropriately
- Remember that physical movement can improve mental health, and mental practices can improve physical wellbeing

If someone is in crisis or mentions self-harm, immediately provide crisis resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Encourage them to seek immediate professional help

For serious physical symptoms, always encourage consulting healthcare professionals.

Remember: You're here to support their complete wellness journey - mind, body, and spirit - not to diagnose or provide medical/therapeutic treatment.`;

// Helper function to create fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 25000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body first to check if it's a demo request
    const body = await request.json();
    const isDemo = body.isDemo === true;
    
    // Handle demo requests without authentication
    if (isDemo) {
      const userMessages = body.messages || [];
      
      if (!Array.isArray(userMessages) || userMessages.length === 0) {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
      }

      console.log('Making Together AI request for demo...');

      // Call the Together API with timeout for demo
      try {
        const llmResponse = await fetchWithTimeout('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            messages: userMessages,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            max_tokens: 200 // Shorter responses for demo
          }),
        }, 15000); // 15 second timeout for demo

      if (!llmResponse.ok) {
        const errorData = await llmResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Demo LLM API error:', {
          status: llmResponse.status,
          statusText: llmResponse.statusText,
          errorData,
          apiKeyExists: !!process.env.TOGETHER_API_KEY,
          apiKeyLength: process.env.TOGETHER_API_KEY?.length || 0
        });
        
        // Return fallback response for demo with error info for debugging
        return NextResponse.json({
          message: "I'm here to support you! As your AI companion, I use CBT-inspired techniques to help you explore your thoughts and feelings. What would you like to talk about today?",
          isDemo: true,
          fallback: true,
          debugInfo: `API Error: ${llmResponse.status} - ${llmResponse.statusText}`
        });
      }

      const llmData = await llmResponse.json();
      console.log('Demo Together AI request successful');

      return NextResponse.json({
        message: llmData.choices[0].message.content,
        isDemo: true
      });
      
      } catch (demoError) {
        console.error('Demo API request failed:', {
          error: demoError,
          message: demoError instanceof Error ? demoError.message : 'Unknown error',
          apiKeyExists: !!process.env.TOGETHER_API_KEY
        });
        
        // Return fallback response for demo with error info
        return NextResponse.json({
          message: "I'm here to support you! As your AI companion, I use CBT-inspired techniques to help you explore your thoughts and feelings. What would you like to talk about today?",
          isDemo: true,
          fallback: true,
          debugInfo: demoError instanceof Error ? demoError.message : 'Network error'
        });
      }
    }

    // Handle authenticated requests (existing logic)
    const { response, session, supabase } = await authenticateApiRoute();
    if (response) return response;

    // Get user's balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('user_id', session.user.id)
      .single();

    if (balanceError) {
      console.error('Error fetching balance:', balanceError);
      return ErrorResponses.serverError('Failed to fetch balance');
    }

    if (!balanceData || balanceData.balance <= 0) {
      return ErrorResponses.paymentRequired('Insufficient balance. Please purchase more messages.');
    }

    const userMessages = body.messages || [];

    if (!Array.isArray(userMessages) || userMessages.length === 0) {
      return ErrorResponses.badRequest('Invalid message format. Expected array of messages.');
    }

    // Format messages for the Together API
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...userMessages
    ];

    console.log('Making Together AI request...');

    // Call the Together API with timeout
    const llmResponse = await fetchWithTimeout('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', // Together AI serverless model
        messages,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        max_tokens: 512 // Reduced for faster response
      }),
    }, 20000); // 20 second timeout

    if (!llmResponse.ok) {
      const errorData = await llmResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('LLM API error:', errorData);
      
      // Return fallback response instead of error for better UX
      return NextResponse.json({
        message: "I'm here to support you on your mental wellness journey. Sometimes I might take a moment to respond, but I'm always ready to listen and help you explore your thoughts and feelings. What's on your mind today?",
        remaining_balance: balanceData.balance - 1,
        fallback: true
      });
    }

    const llmData = await llmResponse.json();

    // Deduct one message from balance
    const { error: updateError } = await supabase
      .from('user_balances')
      .update({ 
        balance: balanceData.balance - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return ErrorResponses.serverError('Failed to update balance');
    }

    console.log('Together AI request successful');

    return NextResponse.json({
      message: llmData.choices[0].message.content,
      remaining_balance: balanceData.balance - 1,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Handle specific error types
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      return NextResponse.json({
        message: "I'm experiencing some technical difficulties right now, but I'm here to support you. Let me know what's on your mind, and I'll do my best to help you explore your thoughts and feelings.",
        fallback: true
      });
    }
    
    return NextResponse.json({ error: 'Chat service unavailable' }, { status: 500 });
  }
}
