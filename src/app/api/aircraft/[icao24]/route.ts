import { NextRequest, NextResponse } from "next/server";
import { getAirlineName } from "@/lib/airlines";

/**
 * GET /api/aircraft/[icao24]
 *
 * Geeft airline-naam terug via statische ICAO-mapping.
 * Registration en aircraftType komen direct uit de adsb.lol response
 * (via het Aircraft-object) en hoeven hier niet opnieuw te worden
 * opgehaald.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ icao24: string }> }
) {
  const { icao24 } = await params;
  const callsign = request.nextUrl.searchParams.get("callsign");

  if (!icao24) {
    return NextResponse.json({ error: "icao24 is verplicht" }, { status: 400 });
  }

  const airline = callsign ? getAirlineName(callsign) : null;

  return NextResponse.json({
    airline,
    aircraftType: null,
    registration: null,
    departureAirport: null,
    arrivalAirport: null,
  });
}
