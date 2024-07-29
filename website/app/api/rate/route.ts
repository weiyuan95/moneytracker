import { NextRequest, NextResponse } from 'next/server';
import { CoinGateClient } from '../../../currencies/CoinGateClient';

type Rate = {
  from: string;
  to: string;
  rate: number;
  expireOn: number; // timestamp
};

// key: `from:to`
const cache = new Map<string, Rate>();

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from');
  const to = req.nextUrl.searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const cached = cache.get(`${from}:${to}`);

  if (cached) {
    // Return the cached rate if it's still valid, if not carry on to the code below to override
    // the current cached value
    if (cached.expireOn < Date.now()) {
      return NextResponse.json(cached.rate, { status: 200 });
    }
  }

  const client = new CoinGateClient();

  // TODO: better error handling / logging
  try {
    const conversionRate = await client.getExchangeRate(from, to);
    // Cache for 5 minutes
    const expireOn = Date.now() + 1000 * 60 * 5;
    cache.set(`${from}:${to}`, { from, to, rate: conversionRate, expireOn });
    return NextResponse.json(conversionRate, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
