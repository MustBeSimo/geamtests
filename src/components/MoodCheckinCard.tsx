'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useBalance } from '@/hooks/useBalance';
import { MoodTrackingErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense, lazy } from 'react';

const moodEmojis = [
  { emoji: '😢', label: 'Very Sad' },
  { emoji: '😞', label: 'Sad' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🙂', label: 'Happy' },
  { emoji: '😊', label: 'Very Happy' },
  { emoji: '😍', label: 'Excited' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '🎉', label: 'Celebrating' }
];

interface MoodReport {
  insight: string;
  cbtTechnique: string;
  affirmation: string;
  actionStep: string;
  date?: string;
  mood_emoji?: string;
  mood_rating?: number;
  mood_note?: string;
}

export default function MoodCheckinCard() {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moodReport, setMoodReport] = useState<MoodReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatingPeriodReport, setGeneratingPeriodReport] = useState(false);
  const [periodReportType, setPeriodReportType] = useState<string | null>(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<Date | null>(null);
  const [moodCheckins, setMoodCheckins] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [demoUsed, setDemoUsed] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const [showDemoReport, setShowDemoReport] = useState(false); // New state for demo report
  const { user, loading, signInWithGoogle } = useAuth();

  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
    
    // Check demo usage from localStorage (only on client)
    if (typeof window !== 'undefined') {
      const demoData = localStorage.getItem('mindgleam_demo_mood');
      if (demoData) {
        const parsed = JSON.parse(demoData);
        setDemoCount(parsed.count || 0);
        setDemoUsed(parsed.count >= 1); // Only allow 1 demo use
      }
    }
  }, []);

  // Simplified balance fetching - single, robust mechanism
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || !isClient || moodCheckins !== null) return;

      try {
        const response = await fetch('/api/balance', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setMoodCheckins(data.moodCheckins || 0);
        } else {
          setMoodCheckins(10); // Default fallback
        }
      } catch (error) {
        console.error('Error fetching mood check-ins balance:', error);
        setMoodCheckins(10); // Default fallback
      }
    };

    // Fetch balance when user is available and client is ready
    if (user && isClient && !loading && moodCheckins === null) {
      fetchBalance();
    }
  }, [user, isClient, loading, moodCheckins]);

  // Handle user state changes
  useEffect(() => {
    if (user?.id && isClient) {
      // Reset balance to trigger fetch for new user
      setMoodCheckins(null);
    } else if (!user && isClient) {
      // Reset state when user signs out
      setMoodCheckins(null);
      setSubmitted(false);
      setMoodReport(null);
    }
  }, [user?.id, isClient]);

  // Load existing mood report on mount
  useEffect(() => {
    const loadExistingReport = async () => {
      if (!user) return;

      try {
        // Get the latest mood report from the last 5 hours
        const fiveHoursAgo = new Date();
        fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);

        const { data: latestReport, error } = await supabase
          .from('mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', fiveHoursAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error loading mood report:', error);
          return;
        }

        if (latestReport) {
          const submissionTime = new Date(latestReport.created_at);
          const timeLeft = Math.max(0, 18000 - (Date.now() - submissionTime.getTime()) / 1000);

          if (timeLeft > 0) {
            setMoodReport({
              insight: latestReport.insight,
              cbtTechnique: latestReport.cbt_technique,
              affirmation: latestReport.affirmation,
              actionStep: latestReport.action_step,
              date: new Date(latestReport.created_at).toLocaleDateString(),
              mood_emoji: latestReport.mood_emoji,
              mood_rating: latestReport.mood_rating,
              mood_note: latestReport.mood_note
            });
            setSubmitted(true);
            setCountdown(Math.floor(timeLeft));
            setLastSubmissionTime(submissionTime);
          }
        }
      } catch (error) {
        console.error('Error in loadExistingReport:', error);
      }
    };

    if (user && !loading) {
      loadExistingReport();
    }
  }, [user, loading]);

  // Countdown timer
  useEffect(() => {
    if (!submitted || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [submitted, countdown]);

  // Reset state when countdown expires
  useEffect(() => {
    if (submitted && countdown === 0) {
      setSubmitted(false);
      setMoodReport(null);
      setSelectedEmoji('');
      setMoodRating(5);
      setMoodNote('');
      setLastSubmissionTime(null);
    }
  }, [submitted, countdown]);

  const generateMoodReport = async (mood: string, rating: number, note: string) => {
    console.log('[Vercel Frontend] Setting generatingReport to TRUE');
    setGeneratingReport(true);
    console.log('[Vercel Frontend] Starting mood report generation...', { mood, rating, note });
    
    try {
      console.log('[Vercel Frontend] Making API request to /api/mood-report...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('[Vercel Frontend] Request timeout - aborting');
        controller.abort();
      }, 20000); // 20 second timeout
      
      const fetchPromise = fetch('/api/mood-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mood_emoji: mood,
          mood_rating: rating,
          mood_note: note
        }),
        signal: controller.signal
      });

      console.log('[Vercel Frontend] Waiting for response...');
      const response = await fetchPromise;
      
      clearTimeout(timeoutId);
      console.log('[Vercel Frontend] API response received:', response.status, response.statusText);
      console.log('[Vercel Frontend] Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('[Vercel Frontend] Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Vercel Frontend] API error response:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      console.log('[Vercel Frontend] Content-Type:', contentType);
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[Vercel Frontend] Response is not JSON:', contentType);
        const responseText = await response.text();
        console.error('[Vercel Frontend] Response text:', responseText);
        throw new Error('API did not return JSON');
      }

      console.log('[Vercel Frontend] About to read response text...');
      const responseText = await response.text();
      console.log('[Vercel Frontend] Raw response text received, length:', responseText.length);
      console.log('[Vercel Frontend] Raw response text:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.error('[Vercel Frontend] Empty response received');
        throw new Error('Empty response from API');
      }
      
      let report;
      console.log('[Vercel Frontend] Attempting to parse JSON...');
      try {
        report = JSON.parse(responseText);
        console.log('[Vercel Frontend] JSON parsed successfully!');
        console.log('[Vercel Frontend] Parsed report data:', report);
      } catch (parseError) {
        console.error('[Vercel Frontend] JSON parse error:', parseError);
        console.error('[Vercel Frontend] Failed to parse:', responseText);
        throw new Error('Invalid JSON response from API');
      }
      
      // Ensure we have valid report data
      if (!report || typeof report !== 'object') {
        console.error('[Vercel Frontend] Invalid report data received:', report);
        throw new Error('Invalid report data received from API');
      }
      
      console.log('[Vercel Frontend] Validating report fields...');
      console.log('[Vercel Frontend] Report insight:', report.insight);
      console.log('[Vercel Frontend] Report cbtTechnique:', report.cbtTechnique);
      console.log('[Vercel Frontend] Report affirmation:', report.affirmation);
      console.log('[Vercel Frontend] Report actionStep:', report.actionStep);
      
      const finalReport = {
        insight: report.insight || "Thank you for checking in with your mood today.",
        cbtTechnique: report.cbtTechnique || "Practice deep breathing exercises.",
        affirmation: report.affirmation || "You are taking positive steps for your wellbeing.",
        actionStep: report.actionStep || "Take a moment to practice self-compassion.",
        date: new Date().toLocaleDateString(),
        mood_emoji: mood,
        mood_rating: rating,
        mood_note: note
      };

      console.log('[Vercel Frontend] Final report prepared:', finalReport);
      console.log('[Vercel Frontend] About to set mood report state...');
      
      // Force React to update by using functional state update
      setMoodReport(prevReport => {
        console.log('[Vercel Frontend] Previous report:', prevReport);
        console.log('[Vercel Frontend] Setting new report:', finalReport);
        return finalReport;
      });
      
      console.log('[Vercel Frontend] Mood report state set - checking if it worked...');
      
      // Double-check the state was set
      setTimeout(() => {
        console.log('[Vercel Frontend] Checking state after timeout...');
        console.log('[Vercel Frontend] generatingReport should be false, moodReport should exist');
      }, 100);
      
             // Ensure generating state is cleared IMMEDIATELY
       console.log('[Vercel Frontend] Clearing generating state NOW...');
       setGeneratingReport(false);
       
       // UI should auto-update when moodReport state changes
       console.log('[Vercel Frontend] Mood report generated successfully');
      
    } catch (error) {
      console.error('[Vercel Frontend] Error in generateMoodReport:', error);
      
      // Always provide a fallback report
      const fallbackReport = {
        insight: "Thank you for checking in with your mood today. Self-awareness is a key component of emotional wellness.",
        cbtTechnique: "Try the 5-4-3-2-1 grounding technique: notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
        affirmation: "I am taking positive steps toward understanding and caring for my emotional well-being.",
        actionStep: "Take a few minutes to practice deep breathing and reflect on one positive moment from today.",
        date: new Date().toLocaleDateString(),
        mood_emoji: mood,
        mood_rating: rating,
        mood_note: note
      };

      console.log('[Vercel Frontend] Using fallback report:', fallbackReport);
      setMoodReport(fallbackReport);
      setGeneratingReport(false);
    } finally {
      console.log('[Vercel Frontend] FINALLY block - Ensuring generatingReport is FALSE');
      
      // Force multiple state updates to ensure it takes effect
      setGeneratingReport(false);
      
      // Use setTimeout to ensure the state update happens after any other React batching
      setTimeout(() => {
        console.log('[Vercel Frontend] Timeout - Double-checking generatingReport state');
        setGeneratingReport(false);
      }, 100);
      
      console.log('[Vercel Frontend] Final cleanup complete');
    }
  };

  const downloadReportAsPDF = async (reportData: MoodReport) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily',
          data: reportData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mood-report-${reportData.date?.replace(/\//g, '-') || 'today'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const generatePeriodReport = async (type: string) => {
    if (!user) {
      console.log('[Frontend] No user found for period report generation');
      return;
    }
    
    console.log(`[Frontend] Starting ${type} period report generation for user:`, user.id);
    setGeneratingPeriodReport(true);
    setPeriodReportType(type);
    
    try {
      let startDate: Date;
      let endDate = new Date();
      
      // Calculate date range based on type
      switch (type) {
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          throw new Error('Invalid period type');
      }

      // Fetch mood data from Supabase
      console.log('[Frontend] Fetching mood data from Supabase...');
      console.log('[Frontend] Query params:', {
        user_id: user.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });
      
      const { data: moodData, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      console.log('[Frontend] Supabase query result:', { data: moodData, error });

      if (error) {
        console.error('[Frontend] Supabase error:', error);
        throw error;
      }

      if (!moodData || moodData.length === 0) {
        console.log(`[Frontend] No mood data found for ${type} period`);
        console.log('[Frontend] This might be because:');
        console.log('1. No mood check-ins completed in this period');
        console.log('2. Date range issue');
        console.log('3. User ID mismatch');
        alert(`No mood data found for the selected ${type} period. Try completing some daily mood check-ins first!`);
        return; // This will trigger the finally block to clean up state
      }

      console.log(`[Frontend] Found ${moodData.length} mood entries for ${type} period`);

      // Generate period report
      console.log(`[Frontend] Generating ${type} period report with ${moodData.length} entries`);
      console.log('[Frontend] Date range:', startDate.toISOString(), 'to', endDate.toISOString());
      
      const response = await fetch('/api/mood-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'period',
          period: type,
          mood_data: moodData,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }),
      });

      console.log('[Frontend] Period report API response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Frontend] Period report API error:', errorText);
        throw new Error(`Failed to generate period report: ${response.status}`);
      }

      const report = await response.json();
      console.log('[Frontend] Period report received:', report);
      
      // Download the period report as PDF
      console.log('[Frontend] Starting PDF generation...');
      const pdfPayload = {
        type: 'period',
        period: type,
        data: {
          ...report,
          mood_data: moodData,
          start_date: startDate.toLocaleDateString(),
          end_date: endDate.toLocaleDateString(),
          total_entries: moodData.length
        }
      };
      console.log('[Frontend] PDF payload:', pdfPayload);
      
      // Add timeout to PDF generation
      const pdfController = new AbortController();
      const pdfTimeoutId = setTimeout(() => {
        console.error('[Frontend] PDF generation timeout');
        pdfController.abort();
      }, 15000); // 15 second timeout
      
      const pdfResponse = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfPayload),
        signal: pdfController.signal
      });
      
      clearTimeout(pdfTimeoutId);

      console.log('[Frontend] PDF API response:', pdfResponse.status, pdfResponse.statusText);
      console.log('[Frontend] PDF response headers:', Object.fromEntries(pdfResponse.headers.entries()));

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        console.error('[Frontend] PDF generation error:', errorText);
        alert(`PDF generation failed: ${pdfResponse.status} - ${errorText}`);
        throw new Error(`Failed to generate period PDF: ${pdfResponse.status} - ${errorText}`);
      }

      console.log('[Frontend] PDF generated successfully, creating download...');
      
      try {
        const blob = await pdfResponse.blob();
        console.log('[Frontend] PDF blob received, size:', blob.size, 'type:', blob.type);
        
        if (blob.size === 0) {
          throw new Error('PDF blob is empty - generation may have failed');
        }
        
        // Create filename
        const filename = `mood-${type}-report-${startDate.toLocaleDateString().replace(/\//g, '-')}-to-${endDate.toLocaleDateString().replace(/\//g, '-')}.pdf`;
        console.log('[Frontend] Creating download with filename:', filename);
        
        // Method 1: Try standard download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        console.log('[Frontend] Attempting download click...');
        
        // Force click with multiple methods
        a.click();
        
                 // Alternative method if click fails
         setTimeout(() => {
           if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
             // IE/Edge
             (window.navigator as any).msSaveOrOpenBlob(blob, filename);
           } else {
            // Try opening in new tab as fallback
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
              console.warn('[Frontend] Popup blocked, trying direct download');
              // Force download by creating temporary link
              const tempLink = document.createElement('a');
              tempLink.href = url;
              tempLink.download = filename;
              tempLink.click();
            }
          }
        }, 100);
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
        }, 2000);
        
        console.log('[Frontend] Period report download initiated successfully!');
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} mood report download started! Check your downloads folder.`);
        
      } catch (blobError) {
        console.error('[Frontend] Error processing PDF blob:', blobError);
        alert('Error processing PDF. Please try again.');
        throw blobError;
      }

    } catch (error) {
      console.error('[Frontend] Error generating period report:', error);
      console.error('[Frontend] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      alert(`Failed to generate period report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('[Frontend] Cleaning up period report state...');
      setGeneratingPeriodReport(false);
      setPeriodReportType(null);
      setShowReportOptions(false);
      console.log('[Frontend] Period report cleanup completed');
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedEmoji) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, deduct a mood check-in
      const balanceResponse = await fetch('/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deduct_mood_checkin'
        }),
      });

      if (!balanceResponse.ok) {
        const errorData = await balanceResponse.json();
        if (balanceResponse.status === 402) {
          throw new Error('You have no mood check-ins remaining. Please purchase more credits.');
        }
        throw new Error(errorData.error || 'Failed to process mood check-in');
      }

      const balanceData = await balanceResponse.json();
      setMoodCheckins(balanceData.moodCheckins);

      console.log('Submitting mood log:', { 
        user_id: user.id, 
        mood_emoji: selectedEmoji, 
        mood_rating: moodRating,
        mood_note: moodNote
      });

      setSubmitted(true);
      setCountdown(18000); // Set to 5 hours
      setLastSubmissionTime(new Date());
      
      // Generate mood report (this will also insert the mood log)
      await generateMoodReport(selectedEmoji, moodRating, moodNote);
      
    } catch (error: any) {
      console.error('Error saving mood log:', error);
      setError(error.message || 'Failed to save mood log');
      // Reset submitted state on error
      setSubmitted(false);
      setCountdown(0);
      setLastSubmissionTime(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format countdown time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded mb-4"></div>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-blue-200 dark:bg-blue-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-8 bg-blue-200 dark:bg-blue-700 rounded mb-4"></div>
          <div className="h-10 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
        <div className="text-center mt-4">
          <div className="text-sm text-blue-600 dark:text-blue-400">
            {user ? 'Setting up your account...' : 'Loading authentication...'}
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while balance is being fetched for authenticated users
  if (user && moodCheckins === null && !submitted) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded w-3/4 mx-auto mb-4"></div>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-blue-200 dark:bg-blue-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-8 bg-blue-200 dark:bg-blue-700 rounded mb-4"></div>
          <div className="h-10 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
        <div className="text-center mt-4">
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Loading your mood check-ins...
          </div>
        </div>
      </div>
    );
  }

  // Demo mode for non-authenticated users
  if (!user) {
    const handleDemoSubmit = () => {
      if (demoCount >= 1 || !isClient) return; // Only allow 1 demo use
      
      console.log('Demo submit clicked:', { selectedEmoji, moodRating, demoCount, isClient });
      
      // Generate personalized demo result based on mood
      const getDemoReport = (emoji: string, rating: number) => {
        if (rating >= 8) {
          return {
            insight: "You're feeling positive today! This is wonderful - recognizing and savoring good moments helps build emotional resilience.",
            cbtTechnique: "Practice gratitude amplification: Write down 3 specific things you're grateful for and why they matter to you.",
            affirmation: "I appreciate the good moments in my life and use them to build strength for challenging times.",
            actionStep: "Share your positive energy with someone you care about or do something kind for yourself."
          };
        } else if (rating >= 6) {
          return {
            insight: "You're in a balanced emotional space. This awareness of your emotional state is a key strength in mental wellness.",
            cbtTechnique: "Try mindful breathing: Take 4 slow breaths, focusing on the sensation of air entering and leaving your body.",
            affirmation: "I am capable of navigating life's ups and downs with grace and self-compassion.",
            actionStep: "Take a moment to appreciate something small and beautiful around you right now."
          };
        } else if (rating >= 4) {
          return {
            insight: "You're experiencing some challenging emotions today. Acknowledging this takes courage and is the first step toward feeling better.",
            cbtTechnique: "Use the STOP technique: Stop what you're doing, Take a breath, Observe your thoughts/feelings, Proceed with intention.",
            affirmation: "My current feelings are temporary. I have overcome difficult times before and I can do it again.",
            actionStep: "Practice one small act of self-care today, like drinking a warm beverage or taking a short walk."
          };
        } else {
          return {
            insight: "You're going through a difficult time. Remember that reaching out and tracking your mood shows strength and self-awareness.",
            cbtTechnique: "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            affirmation: "I am not alone in this feeling. This difficult moment will pass, and I am stronger than I know.",
            actionStep: "Be extra gentle with yourself today. Consider reaching out to a trusted friend or professional if you need support."
          };
        }
      };

      // Generate and set the report immediately
      const report = getDemoReport(selectedEmoji, moodRating);
      console.log('Setting demo report:', report);
      setMoodReport(report);
      setShowDemoReport(true); // Show the demo report
      
      // After showing the report, mark demo as used after a longer delay
      setTimeout(() => {
        console.log('Demo timeout reached, hiding report');
        setShowDemoReport(false); // Hide the demo report
        const newCount = demoCount + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('mindgleam_demo_mood', JSON.stringify({
            count: newCount,
            lastUsed: new Date().toISOString()
          }));
        }
        setDemoCount(newCount);
        setDemoUsed(newCount >= 1);
      }, 7000); // Show report for 7 seconds before showing sign-in prompt
    };

    // Show the demo report if the demo report state is true
    if (showDemoReport && moodReport) {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your Personalized Mood Insight (Demo)
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Based on your mood: {selectedEmoji} (Rating: {moodRating}/10)
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Insight</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">{moodReport.insight}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🧠 CBT Technique</h4>
              <p className="text-green-800 dark:text-green-200 text-sm">{moodReport.cbtTechnique}</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💜 Affirmation</h4>
              <p className="text-purple-800 dark:text-purple-200 text-sm italic">"{moodReport.affirmation}"</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🎯 Action Step</h4>
              <p className="text-orange-800 dark:text-orange-200 text-sm">{moodReport.actionStep}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <p className="text-emerald-800 dark:text-emerald-200 text-sm text-center mb-3">
              🎉 Love your personalized insights? Get unlimited mood tracking with your free account!
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Sign In for 10 Free Mood Check-ins
            </button>
          </div>
        </div>
      );
    }

    if (demoUsed) {
      return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl border-2 border-emerald-200 dark:border-emerald-600 shadow-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              You've tried the demo mood check-in!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Ready to unlock your full mental wellness journey with personalized insights and unlimited tracking?
            </p>
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">With your free account:</h4>
                <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                  <li>• 10 mood check-ins and reports</li>
                  <li>• 20 chat messages</li>
                  <li>• Holistic wellness guidance</li>
                  <li>• 3 AI companions (Gigi, Vee, Lumo)</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
              <button
                onClick={signInWithGoogle}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-600 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Try Mood Check-in (Demo)
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Experience personalized mood insights • {demoCount === 0 ? '1 demo remaining' : 'Demo used'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">How are you feeling today?</h4>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => setSelectedEmoji(mood.emoji)}
                  className={`aspect-square p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                    selectedEmoji === mood.emoji
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                  }`}
                  title={mood.label}
                >
                  <div className="text-2xl">{mood.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Rate your mood (1-10)</h4>
            <div className="flex justify-center">
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>1</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{moodRating}</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Any thoughts? (optional)</h4>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Share what's on your mind..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <button
            onClick={handleDemoSubmit}
            disabled={!selectedEmoji}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            Try Demo Check-in
          </button>
        </div>
      </div>
    );
  }

  // Show upgrade prompt if no mood check-ins remaining
  if (moodCheckins === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-orange-500 shadow-lg transition-colors duration-300">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Mood Check-ins Used Up
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            You've used all your free mood check-ins. Upgrade to continue tracking your wellness!
          </p>
          <div className="space-y-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Premium Package:</h4>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>• 60 additional mood check-ins</li>
                <li>• 200 additional chat messages</li>
                <li>• Advanced period reports</li>
                <li>• Priority support</li>
              </ul>
            </div>
            <Link
              href="/subscribe"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-block text-center"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4 transition-colors duration-300 hover:border-emerald-400">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mood Check-In Complete!
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Thanks for sharing how you're feeling today
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Auto-close in</div>
            <div className="text-2xl font-bold text-emerald-600">{formatTime(countdown)}</div>
          </div>
        </div>

        {/* Mood Report Section */}
        {generatingReport && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                Generating your personalized mood insights...
              </div>
              {/* Debug button - remove in production */}
              <button
                onClick={() => {
                  console.log('[Debug] Manual reset of generatingReport');
                  setGeneratingReport(false);
                }}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                title="Debug: Force reset generating state"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Always show download options once submitted */}
        {!generatingReport && (
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => moodReport ? downloadReportAsPDF(moodReport) : alert('Report is still being generated. Please wait a moment.')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              📄 Download Today's Report
            </button>
            <button
              onClick={() => setShowReportOptions(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              📊 Period Reports
            </button>
          </div>
        )}

        {moodReport && (
          <div className="mt-4 space-y-4">

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-emerald-500">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🧠</span> Your Mood Insight
              </h4>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {moodReport.insight}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🛠️</span> CBT Technique to Try
              </h4>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {moodReport.cbtTechnique}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>💫</span> Affirmation
              </h4>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic">
                "{moodReport.affirmation}"
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🎯</span> Next Step
              </h4>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {moodReport.actionStep}
              </p>
            </div>

            {/* Demo Sign-in Prompt */}
            {!user && (
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-600">
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Want more personalized insights?
                  </h4>
                  <p className="text-emerald-800 dark:text-emerald-200 text-sm mb-3">
                    Sign in to get unlimited mood check-ins, advanced reports, and track your progress over time.
                  </p>
                  <button
                    onClick={signInWithGoogle}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign In for Full Access
                  </button>
                </div>
              </div>
            )}

            {/* Mental Health Disclaimer */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <p className="text-xs text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                🩺 Not a therapist • 18+ • Crisis? 988 (US) | 13 11 14 (AU)
                <br />
                <span className="text-gray-600 dark:text-gray-400">
                  This is AI-generated guidance for educational purposes only
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Period Report Options Modal */}
        {showReportOptions && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportOptions(false)}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border-2 border-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download Period Reports</h3>
              <div className="space-y-3">
                {/* Debug: Test PDF download directly */}
                <button 
                  onClick={async () => {
                    console.log('[DEBUG] Testing direct PDF download...');
                    try {
                      const response = await fetch('/api/generate-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'daily',
                          data: {
                            date: new Date().toLocaleDateString(),
                            mood_emoji: '🙂',
                            mood_rating: 6,
                            mood_note: 'Test note',
                            insight: 'Test insight',
                            cbtTechnique: 'Test technique',
                            affirmation: 'Test affirmation',
                            actionStep: 'Test action'
                          }
                        })
                      });
                      console.log('[DEBUG] PDF response:', response.status);
                      if (response.ok) {
                        const blob = await response.blob();
                        console.log('[DEBUG] Blob size:', blob.size);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'test-report.pdf';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        alert('Test PDF download triggered!');
                      } else {
                        const error = await response.text();
                        console.error('[DEBUG] PDF error:', error);
                        alert('PDF test failed: ' + error);
                      }
                    } catch (error) {
                      console.error('[DEBUG] Test error:', error);
                      alert('Test error: ' + error);
                    }
                  }}
                  className="w-full p-2 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors border border-red-200 text-xs"
                >
                                     🧪 TEST PDF DOWNLOAD (Debug)
                 </button>
                 
                 {/* Debug: Check mood data */}
                 <button 
                   onClick={async () => {
                     console.log('[DEBUG] Checking user mood data...');
                     try {
                       const { data: allMoodData, error } = await supabase
                         .from('mood_logs')
                         .select('*')
                         .eq('user_id', user?.id)
                         .order('created_at', { ascending: false });
                       
                       console.log('[DEBUG] All mood data:', allMoodData);
                       console.log('[DEBUG] Error:', error);
                       
                       if (error) {
                         alert('Error checking mood data: ' + error.message);
                       } else {
                         alert(`Found ${allMoodData?.length || 0} total mood entries for this user`);
                       }
                     } catch (error) {
                       console.error('[DEBUG] Error:', error);
                       alert('Error: ' + error);
                     }
                   }}
                   className="w-full p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors border border-yellow-200 text-xs"
                 >
                   📊 CHECK MOOD DATA (Debug)
                 </button>
                 
                 <button 
                  onClick={() => generatePeriodReport('week')}
                  disabled={generatingPeriodReport}
                  className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left transition-colors disabled:opacity-50 border border-blue-200 dark:border-blue-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
                    📅 This Week
                    {generatingPeriodReport && periodReportType === 'week' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last 7 days of mood data</div>
                </button>
                <button 
                  onClick={() => generatePeriodReport('month')}
                  disabled={generatingPeriodReport}
                  className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left transition-colors disabled:opacity-50 border border-blue-200 dark:border-blue-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
                    📆 This Month
                    {generatingPeriodReport && periodReportType === 'month' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last 30 days of mood data</div>
                </button>
                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left opacity-50 cursor-not-allowed border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-gray-900 dark:text-white">🗓️ Custom Range</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Coming soon...</div>
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setGeneratingPeriodReport(false);
                    setPeriodReportType(null);
                    setShowReportOptions(false);
                    console.log('[DEBUG] Force cleared all period report states');
                  }}
                  className="flex-1 py-2 bg-red-200 dark:bg-red-600 hover:bg-red-300 dark:hover:bg-red-500 rounded-lg text-red-800 dark:text-red-200 transition-colors text-sm"
                >
                  🔄 Force Reset
                </button>
                <button
                  onClick={() => setShowReportOptions(false)}
                  disabled={generatingPeriodReport}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <MoodTrackingErrorBoundary>
      <div className="relative">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              How are you feeling today?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your daily wellness check-in helps track your mental and physical wellbeing
            </p>
            
            {/* Tips for better AI interaction */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <div className="font-medium mb-1">💡 Tips for better wellness insights:</div>
                <div className="text-left space-y-1">
                  • Share what influenced your mood (work, relationships, events, physical activities)
                  <br />
                  • Mention specific emotions AND physical sensations (anxious, excited, tired, energized)
                  <br />
                  • Include context about sleep, exercise, nutrition, or health
                  <br />
                  • Be honest about both mental and physical challenges or wins
                </div>
              </div>
            </div>
            
            {moodCheckins !== null && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-700">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  📊 {moodCheckins} mood check-ins remaining
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose your mood:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => setSelectedEmoji(mood.emoji)}
                  className={`p-3 rounded-lg text-2xl transition-all duration-200 flex items-center justify-center ${
                    selectedEmoji === mood.emoji
                      ? 'bg-blue-500 text-white scale-105 border-2 border-blue-600'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent hover:border-blue-300'
                  }`}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rate your mood (1-10):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">10</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium">
                {moodRating}
              </span>
            </div>
          </div>

          {/* Mood Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What's on your mind? (optional)
            </label>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Share what influenced your mood today... Examples:
• 'Had a great meeting at work and feeling accomplished'
• 'Feeling anxious about upcoming presentation tomorrow'
• 'Grateful for time spent with family this weekend'
• 'Stressed about finances but trying to stay positive'"
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💭 The more context you share, the more personalized your AI insights will be
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedEmoji || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              !selectedEmoji || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 border-2 border-transparent hover:border-blue-500'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving your mood...
              </div>
            ) : (
              'Submit Mood Check-In'
            )}
          </button>
        </div>
      </div>
    </MoodTrackingErrorBoundary>
  );
} 