"use client";

import { ScoredAircraft } from "@/lib/geo";
import { FlightDetail } from "@/types/aircraft";
import { getAircraftCategory } from "@/lib/aircraftCategory";
import AircraftIcon from "@/components/AircraftIcon";
import AirlineLogo from "@/components/AirlineLogo";

interface OverheadCardProps {
  aircraft: ScoredAircraft;
  detail: FlightDetail;
}

function formatAltitude(meters: number | null): string {
  if (meters === null) return "—";
  return `${Math.round(meters).toLocaleString("nl-NL")} m`;
}

function formatSpeed(ms: number | null): string {
  if (ms === null) return "—";
  return `${Math.round(ms * 3.6)} km/h`;
}

function formatHeading(degrees: number | null): string {
  if (degrees === null) return "—";
  const dirs = ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return `${dirs[index]} ${Math.round(degrees)}°`;
}

export default function OverheadCard({ aircraft: a, detail }: OverheadCardProps) {
  const airlineName  = detail.airline || a.operator || null;
  const aircraftType = a.aircraftType;
  const registration = a.registration;
  const hasRoute     = detail.departureAirport || detail.arrivalAirport;
  const category     = getAircraftCategory(aircraftType);

  return (
    /*
     * Hero card: two-column grid.
     *   Left  — flight information (flex-1, min-w-0 to allow truncation)
     *   Right — large aircraft silhouette + type label
     *
     * On narrow screens both columns stay side by side but the right
     * column shrinks to w-[130px]; on md+ it grows to w-[200px].
     */
    <div className="grid grid-cols-[1fr_130px] md:grid-cols-[1fr_200px] min-h-[280px] md:min-h-[340px]">

      {/* ── Left column: flight info ─────────────────────────────────── */}
      <div className="px-5 py-7 md:px-8 md:py-10 flex flex-col justify-between min-w-0">

        <div>
          {/* Callsign */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-mono leading-none mb-2">
            {a.callsign || a.icao24.toUpperCase()}
          </h2>

          {/* Airline badge + name */}
          <div className="flex items-center gap-2 mb-5">
            <AirlineLogo callsign={a.callsign} airlineName={airlineName} />
            <p className="text-base md:text-lg text-gray-400 truncate">
              {detail.loading ? "Laden…" : airlineName || "—"}
            </p>
          </div>

          {/* Route */}
          {hasRoute && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold font-mono text-gray-800">
                <span>{detail.departureAirport || "???"}</span>
                <span className="text-gray-200 font-light">→</span>
                <span>{detail.arrivalAirport || "???"}</span>
              </div>
              {(detail.departureAirportName || detail.arrivalAirportName) && (
                <p className="mt-0.5 text-xs text-gray-400 truncate">
                  {detail.departureAirportName || "—"} → {detail.arrivalAirportName || "—"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Data grid — pinned to bottom of left column */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <DataField label="Hoogte"   value={formatAltitude(a.baroAltitude)} />
          <DataField label="Snelheid" value={formatSpeed(a.velocity)} />
          <DataField label="Richting" value={formatHeading(a.trueTrack)} />
          <DataField label="Afstand"  value={`${a.distanceKm} km`} />
          {registration && (
            <DataField label="Registratie" value={registration} />
          )}
        </div>
      </div>

      {/* ── Right column: aircraft hero visual ──────────────────────── */}
      <div
        className="
          flex flex-col items-center justify-center gap-3
          px-3 py-7 md:px-5 md:py-10
          border-l border-slate-100
          bg-gradient-to-b from-slate-50 to-white
        "
      >
        {/* SVG silhouette — the hero element */}
        <AircraftIcon
          category={category}
          className="w-[100px] md:w-[150px] h-auto"
        />

        {/* Aircraft type label */}
        <p
          className="
            text-[10px] md:text-[11px]
            text-slate-400 font-medium
            uppercase tracking-widest
            text-center leading-relaxed
            px-1
          "
        >
          {aircraftType || "Onbekend type"}
        </p>
      </div>

    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}
