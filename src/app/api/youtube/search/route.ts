import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const VIDEO_ID_PATTERN = /"videoId":"([a-zA-Z0-9_-]{11})"/g;

function uniqueVideoIds(html: string) {
  const ids = [...html.matchAll(VIDEO_ID_PATTERN)].map(match => match[1]);
  return [...new Set(ids)].slice(0, 8);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`;
    const response = await fetch(searchUrl, {
      headers: {
        'accept-language': 'en-US,en;q=0.9',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari',
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'YouTube search failed' },
        { status: 502 },
      );
    }

    const html = await response.text();
    const candidates = uniqueVideoIds(html);

    if (!candidates.length) {
      return NextResponse.json({ videoId: null, candidates: [] });
    }

    return NextResponse.json({
      videoId: candidates[0],
      candidates,
      source: 'youtube-search',
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to resolve YouTube video' },
      { status: 502 },
    );
  }
}
