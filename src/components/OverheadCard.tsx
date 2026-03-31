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

// ── Formatters ──────────────────────────────────────────────────────────────

function formatAltitude(meters: number | null): string {
  if (meters === null) return "—";
  const fl = Math.round(meters / 30.48) * 100;
  return `FL${fl}`;
}

function formatSpeed(ms: number | null): string {
  if (ms === null) return "—";
  return `${Math.round(ms * 3.6)} km/h`;
}

function getStatusText(distanceKm: number): string {
  if (distanceKm <= 5)  return "recht boven je locatie";
  if (distanceKm <= 15) return "bijna boven je locatie";
  if (distanceKm <= 30) return "vlakbij je locatie";
  return `op ${distanceKm} km van je locatie`;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function OverheadCard({ aircraft: a, detail }: OverheadCardProps) {
  const airlineName  = detail.airline || a.operator || null;
  const aircraftType = a.aircraftType;
  const category     = getAircraftCategory(aircraftType);
  const statusText   = getStatusText(a.distanceKm);

  const dep     = detail.departureAirport;
  const arr     = detail.arrivalAirport;
  const depName = detail.departureAirportName;
  const arrName = detail.arrivalAirportName;
  const hasRoute = !!(dep || arr);

  return (
    <div className="px-6 py-8 md:px-10 md:py-12 max-w-lg mx-auto w-full">

      {/* ── 1. Header: airline + callsign ──────────────────────────────── */}
      <div className="flex items-center gap-3 mb-1">
        <AirlineLogo callsign={a.callsign} airlineName={airlineName} />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-900 leading-tight truncate">
            {detail.loading ? "Laden…" : (airlineName || "Onbekende airline")}
          </p>
          <p className="text-sm font-mono text-gray-400 leading-tight">
            {a.callsign || a.icao24.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ── 2. Status ──────────────────────────────────────────────────── */}
      <p className="text-sm text-gray-400 mt-3 mb-8">
        {statusText}
      </p>

      {/* ── 3. Route bar (only when known) ─────────────────────────────── */}
      {hasRoute && (
        <div className="mb-8">
          {/* IATA codes + connecting line */}
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="shrink-0 text-left w-[72px] md:w-[88px]">
              <div className="text-3xl md:text-4xl font-mono font-bold text-gray-900 leading-none">
                {dep || "???"}
              </div>
            </div>

            {/* Connecting line with small plane marker */}
            <div className="flex flex-1 items-center gap-1.5">
              <div className="flex-1 h-px bg-gray-200" />
              <svg
                viewBox="0 0 200 300"
                className="w-3.5 h-auto text-gray-300 shrink-0"
                aria-hidden="true"
              >
                <path fill="currentColor" d="M100,14C100,14 112,35 112,60L112,208C112,248 106,281 100,289C94,281 88,248 88,208L88,60C88,35 100,14 100,14Z"/>
                <path fill="currentColor" d="M90,112L6,160L10,178L90,138Z"/>
                <path fill="currentColor" d="M110,112L194,160L190,178L110,138Z"/>
                <path fill="currentColor" d="M90,234L37,257L40,266L90,249Z"/>
                <path fill="currentColor" d="M110,234L163,257L160,266L110,249Z"/>
              </svg>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Arrival */}
            <div className="shrink-0 text-right w-[72px] md:w-[88px]">
              <div className="text-3xl md:text-4xl font-mono font-bold text-gray-900 leading-none">
                {arr || "???"}
              </div>
            </div>
          </div>

          {/* City names */}
          {(depName || arrName) && (
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-gray-400 max-w-[40%] leading-snug">
                {depName || ""}
              </p>
              <p className="text-xs text-gray-400 max-w-[40%] text-right leading-snug">
                {arrName || ""}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 4. Aircraft visual — centred hero ──────────────────────────── */}
      <div className="flex justify-center mb-5">
        <AircraftIcon
          category={category}
          className="w-[120px] md:w-[150px] h-auto"
        />
      </div>

      {/* ── 5. Aircraft type ───────────────────────────────────────────── */}
      <p className="text-center text-sm font-medium text-gray-500 tracking-wide mb-8">
        {aircraftType || "Onbekend type"}
      </p>

      {/* ── 6. Key stats ───────────────────────────────────────────────── */}
      <div className="flex justify-center gap-10 md:gap-16">
        <Stat label="Hoogte"   value={formatAltitude(a.baroAltitude)} />
        <Stat label="Snelheid" value={formatSpeed(a.velocity)} />
        <Stat label="Afstand"  value={`${a.distanceKm} km`} />
      </div>

    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
        {label}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}
