"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Aircraft, FlightDetail } from "@/types/aircraft";

const EMPTY_DETAIL: FlightDetail = {
  airline: null,
  aircraftType: null,
  registration: null,
  departureAirport: null,
  arrivalAirport: null,
  loading: false,
  error: null,
};

// Cache voor airline lookups (per icao24)
const cache = new Map<string, string | null>();

export function useFlightDetail(
  selectedIcao: string | null,
  aircraft: Aircraft[]
): FlightDetail {
  const [detail, setDetail] = useState<FlightDetail>(EMPTY_DETAIL);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAirline = useCallback(
    async (icao24: string, callsign: string | null) => {
      // Check cache
      if (cache.has(icao24)) {
        const airline = cache.get(icao24) ?? null;
        setDetail((prev) => ({ ...prev, airline, loading: false, error: null }));
        return;
      }

      if (!callsign) {
        cache.set(icao24, null);
        setDetail((prev) => ({ ...prev, airline: null, loading: false }));
        return;
      }

      setDetail((prev) => ({ ...prev, loading: true, error: null }));

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({ callsign });
        const res = await fetch(`/api/aircraft/${icao24}?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        const airline: string | null = res.ok ? (data.airline ?? null) : null;
        cache.set(icao24, airline);
        setDetail((prev) => ({ ...prev, airline, loading: false, error: null }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setDetail((prev) => ({ ...prev, loading: false, error: null }));
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedIcao) {
      setDetail(EMPTY_DETAIL);
      return;
    }

    const selected = aircraft.find((a) => a.icao24 === selectedIcao);

    // Registration en aircraftType komen direct uit het Aircraft-object (adsb.lol)
    setDetail({
      airline: null,
      aircraftType: selected?.aircraftType ?? null,
      registration: selected?.registration ?? null,
      departureAirport: null,
      arrivalAirport: null,
      loading: true,
      error: null,
    });

    fetchAirline(selectedIcao, selected?.callsign ?? null);

    return () => {
      abortRef.current?.abort();
    };
  }, [selectedIcao, aircraft, fetchAirline]);

  return detail;
}
