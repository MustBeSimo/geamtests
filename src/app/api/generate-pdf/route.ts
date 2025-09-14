import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import jsPDF from 'jspdf';

// Helper function to convert emojis to text descriptions
function emojiToText(emoji: string): string {
  const emojiMap: { [key: string]: string } = {
    '😢': 'Very Sad',
    '😞': 'Sad',
    '😐': 'Neutral',
    '🙂': 'Content',
    '😊': 'Happy',
    '😍': 'Excited',
    '🤗': 'Grateful',
    '😌': 'Peaceful',
    '💪': 'Motivated',
    '🎉': 'Joyful',
    '😴': 'Tired',
    '😰': 'Anxious',
    '😤': 'Frustrated',
    '🥰': 'Loved',
    '😎': 'Confident',
  };

  return emojiMap[emoji] || emoji;
}

// Generate actual PDF using jsPDF
async function generatePDF(type: string, data: any): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (
    text: string,
    fontSize: number = 12,
    isBold: boolean = false
  ) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;

    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Add header
  if (type === 'daily') {
    addText('DAILY MOOD REPORT', 18, true);
    addText(
      `Generated on: ${data.date || new Date().toLocaleDateString()}`,
      10
    );
    yPosition += 10;

    // Mood information with emoji converted to text
    const moodText = data.mood_emoji ? emojiToText(data.mood_emoji) : 'Unknown';
    addText(`Mood: ${moodText} (Rating: ${data.mood_rating}/10)`, 14, true);
    if (data.mood_note) {
      addText(`Note: ${data.mood_note}`, 12);
    }
    yPosition += 10;

    // Mood insight
    addText('MOOD INSIGHT', 14, true);
    addText(data.insight || 'No insight available', 12);
    yPosition += 5;

    // CBT technique
    addText('CBT TECHNIQUE TO TRY', 14, true);
    addText(data.cbtTechnique || 'No technique available', 12);
    yPosition += 5;

    // Affirmation
    addText('AFFIRMATION', 14, true);
    addText(`"${data.affirmation || 'No affirmation available'}"`, 12);
    yPosition += 5;

    // Action step
    addText('NEXT STEP', 14, true);
    addText(data.actionStep || 'No action step available', 12);
    yPosition += 10;

    // Disclaimer
    addText('---', 10);
    addText('Not a therapist • 18+ • Crisis? 988 (US) | 13 11 14 (AU)', 10);
    addText('This is AI-generated guidance for educational purposes only', 10);
  } else if (type === 'period') {
    // Period report
    const periodTitle = data.period ? data.period.toUpperCase() : 'PERIOD';
    addText(`${periodTitle} MOOD REPORT`, 18, true);
    addText(
      `Period: ${data.start_date || 'Unknown'} to ${data.end_date || 'Unknown'}`,
      10
    );
    addText(`Total entries: ${data.total_entries || 0}`, 10);
    yPosition += 10;

    // Statistics
    if (data.statistics) {
      addText('STATISTICS', 14, true);
      addText(
        `Average mood: ${data.statistics.averageMood?.toFixed(1) || 'N/A'}/10`,
        12
      );

      // Convert most common emoji to text
      const mostCommonMood = data.statistics.mostCommonEmoji
        ? emojiToText(data.statistics.mostCommonEmoji)
        : 'N/A';
      addText(`Most common mood: ${mostCommonMood}`, 12);

      if (data.statistics.moodRange) {
        addText(
          `Mood range: ${data.statistics.moodRange.min} - ${data.statistics.moodRange.max}`,
          12
        );
      }
      addText(`Trend: ${data.statistics.trend || 'N/A'}`, 12);
      yPosition += 10;
    }

    // Overview
    if (data.overview) {
      addText('OVERVIEW', 14, true);
      addText(data.overview, 12);
      yPosition += 5;
    }

    // Insights
    if (data.insights && Array.isArray(data.insights)) {
      addText('KEY INSIGHTS', 14, true);
      data.insights.forEach((insight: string) => {
        addText(`• ${insight}`, 12);
      });
      yPosition += 5;
    }

    // CBT technique
    if (data.cbtTechnique) {
      addText('CBT TECHNIQUE', 14, true);
      addText(data.cbtTechnique, 12);
      yPosition += 5;
    }

    // Affirmation
    if (data.affirmation) {
      addText('AFFIRMATION', 14, true);
      addText(`"${data.affirmation}"`, 12);
      yPosition += 5;
    }

    // Recommendations
    if (data.recommendations && Array.isArray(data.recommendations)) {
      addText('RECOMMENDATIONS', 14, true);
      data.recommendations.forEach((rec: string) => {
        addText(`• ${rec}`, 12);
      });
      yPosition += 10;
    }

    // Recent mood entries (if available)
    if (
      data.mood_data &&
      Array.isArray(data.mood_data) &&
      data.mood_data.length > 0
    ) {
      addText('RECENT MOOD ENTRIES', 14, true);
      const recentEntries = data.mood_data.slice(0, 5); // Show last 5 entries
      recentEntries.forEach((entry: any) => {
        const entryDate = new Date(entry.created_at).toLocaleDateString();
        const moodText = emojiToText(entry.mood_emoji);
        addText(`${entryDate}: ${moodText} (${entry.mood_rating}/10)`, 10);
        if (entry.mood_note) {
          addText(
            `  Note: ${entry.mood_note.substring(0, 100)}${entry.mood_note.length > 100 ? '...' : ''}`,
            9
          );
        }
      });
      yPosition += 10;
    }

    // Disclaimer
    addText('---', 10);
    addText('Not a therapist • 18+ • Crisis? 988 (US) | 13 11 14 (AU)', 10);
    addText('This is AI-generated guidance for educational purposes only', 10);
  }

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[PDF API] Starting PDF generation request...');

    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.log('[PDF API] Unauthorized - no session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log(
      '[PDF API] Request body received:',
      JSON.stringify(body, null, 2)
    );

    const { type, data } = body;

    if (!type || !data) {
      console.log(
        '[PDF API] Missing required fields - type:',
        type,
        'data:',
        !!data
      );
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[PDF API] Generating PDF for type:', type);

    console.log(
      '[PDF API] Generating PDF for type:',
      type,
      'with data keys:',
      Object.keys(data)
    );

    // Generate PDF
    console.log('[PDF API] Calling generatePDF function...');
    const pdfBuffer = await generatePDF(type, data);
    console.log('[PDF API] PDF generated, buffer size:', pdfBuffer.length);

    // Generate filename
    let filename = 'mood-report';
    if (type === 'daily') {
      filename = `mood-report-${data.date?.replace(/\//g, '-') || new Date().toLocaleDateString().replace(/\//g, '-')}`;
    } else if (type === 'period') {
      const period = data.period || 'period';
      const startDate = data.start_date?.replace(/\//g, '-') || 'unknown';
      const endDate = data.end_date?.replace(/\//g, '-') || 'unknown';
      filename = `mood-${period}-report-${startDate}-to-${endDate}`;
    }

    console.log('[PDF API] Generated PDF filename:', filename);

    // Return PDF as response
    console.log('[PDF API] Returning PDF response with headers...');
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
