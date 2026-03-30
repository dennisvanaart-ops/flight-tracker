"use client";

import { ScoredAircraft } from "@/lib/geo";
import { FlightDetail } from "@/types/aircraft";

interface OverheadCardProps {
  aircraft: ScoredAircraft;
  detail: FlightDetail;
}

function formatAltitude(meters: number | null): string {
  if (meters === null) return "—";
  return `${Math.round(meters).toLocaleString("nl-NL")}m`;
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
  // Airline: statische lookup → operator uit adsb.lol → leeg
  const airlineName = detail.airline || a.operator || null;
  // Type en registratie komen direct uit adsb.lol
  const aircraftType = a.aircraftType;
  const registration = a.registration;

  return (
    <div className="px-6 py-8 md:py-12">
      {/* Callsign */}
      <div className="mb-1">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 font-mono">
          {a.callsign || a.icao24.toUpperCase()}
        </h2>
      </div>

      {/* Airline / operator */}
      <p className="text-lg md:text-xl text-gray-500 mb-6">
        {detail.loading ? "Laden..." : airlineName || "—"}
      </p>

      {/* Data grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
        <DataField label="Hoogte" value={formatAltitude(a.baroAltitude)} />
        <DataField label="Snelheid" value={formatSpeed(a.velocity)} />
        <DataField label="Richting" value={formatHeading(a.trueTrack)} />
        <DataField label="Afstand" value={`${a.distanceKm} km`} />
        {aircraftType && (
          <DataField label="Type" value={aircraftType} />
        )}
        {registration && (
          <DataField label="Registratie" value={registration} />
        )}
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div className="text-lg md:text-xl font-medium text-gray-900">
        {value}
      </div>
    </div>
  );
}
