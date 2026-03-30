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
  const airlineName = detail.airline || a.operator || null;
  const aircraftType = a.aircraftType;
  const registration = a.registration;
  const hasRoute = detail.departureAirport || detail.arrivalAirport;
  const category = getAircraftCategory(aircraftType);

  return (
    <div className="px-6 py-8 md:py-12">
      {/* Top section: text left, aircraft icon right */}
      <div className="flex items-start gap-6">
        <div className="flex-1 min-w-0">
          {/* Callsign */}
          <div className="mb-1">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 font-mono">
              {a.callsign || a.icao24.toUpperCase()}
            </h2>
          </div>

          {/* Airline badge + name */}
          <div className="flex items-center gap-2 mb-4">
            <AirlineLogo callsign={a.callsign} airlineName={airlineName} />
            <p className="text-lg md:text-xl text-gray-500 truncate">
              {detail.loading ? "Laden..." : airlineName || "—"}
            </p>
          </div>

          {/* Route: vertrek → aankomst */}
          {hasRoute && (
            <div className="flex items-center gap-3 mb-2 text-xl md:text-2xl">
              <span className="font-mono font-semibold text-gray-800">
                {detail.departureAirport || "???"}
              </span>
              <span className="text-gray-300">→</span>
              <span className="font-mono font-semibold text-gray-800">
                {detail.arrivalAirport || "???"}
              </span>
            </div>
          )}
        </div>

        {/* Aircraft silhouette, rotated to heading */}
        <div className="shrink-0 pt-1 opacity-80">
          <AircraftIcon
            category={category}
            heading={a.trueTrack ?? undefined}
            size={80}
          />
        </div>
      </div>

      {/* Data grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
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
