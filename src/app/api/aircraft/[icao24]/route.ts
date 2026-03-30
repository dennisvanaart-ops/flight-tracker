import { NextRequest, NextResponse } from "next/server";
import { getAirlineName } from "@/lib/airlines";
import { fetchRoute } from "@/lib/adsb";

/**
 * GET /api/aircraft/[icao24]?callsign=&lat=&lon=
 *
 * Geeft airline-naam (statische lookup) en vertrek/aankomst (adsb.lol route)
 * terug voor het geselecteerde toestel.
 *
 * lat en lon zijn nodig voor de route-plausibiliteitsbepaling van adsb.lol.
 * Als ze ontbreken, wordt alleen de airline naam teruggegeven.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ icao24: string }> }
) {
  const { icao24 } = await params;
  const sp = request.nextUrl.searchParams;
  const callsign = sp.get("callsign");
  const lat = sp.get("lat");
  const lon = sp.get("lon");

  if (!icao24) {
    return NextResponse.json({ error: "icao24 is verplicht" }, { status: 400 });
  }

  const airline = callsign ? getAirlineName(callsign) : null;

  let departureAirport: string | null = null;
  let arrivalAirport: string | null = null;

  if (callsign && lat && lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const route = await fetchRoute(callsign, latitude, longitude);
      departureAirport = route.departureAirport;
      arrivalAirport = route.arrivalAirport;
    }
  }

  return NextResponse.json({
    airline,
    aircraftType: null,
    registration: null,
    departureAirport,
    arrivalAirport,
  });
}
