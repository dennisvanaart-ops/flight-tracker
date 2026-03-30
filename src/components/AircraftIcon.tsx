"use client";

import { AircraftCategory } from "@/lib/aircraftCategory";

interface AircraftIconProps {
  category: AircraftCategory;
  heading?: number; // degrees, 0 = North = nose up. Applied as CSS rotation.
  size?: number;    // px, applied to width and height
}

/**
 * Top-down SVG silhouette of an aircraft.
 * Nose points up in the SVG (y=0 direction).
 * Heading rotates the icon: 0=up, 90=right, 180=down, 270=left.
 *
 * viewBox: 0 0 64 64
 * All shapes use currentColor so colour is controlled by Tailwind text classes.
 */
export default function AircraftIcon({
  category,
  heading,
  size = 72,
}: AircraftIconProps) {
  const rotate = heading != null ? `rotate(${Math.round(heading)}deg)` : undefined;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ transform: rotate, transformOrigin: "center", transition: "transform 0.4s ease" }}
      className="text-gray-300"
    >
      {category === "narrow" && <NarrowBody />}
      {category === "wide" && <WideBody />}
      {category === "heavy" && <HeavyBody />}
      {category === "unknown" && <GenericBody />}
    </svg>
  );
}

/** A320 / B737 family — slim fuselage, moderate wings */
function NarrowBody() {
  return (
    <g fill="currentColor">
      {/* Fuselage */}
      <ellipse cx="32" cy="33" rx="4.5" ry="27" />
      {/* Left wing */}
      <polygon points="32,30 4,49 9,54 27.5,39" />
      {/* Right wing */}
      <polygon points="32,30 60,49 55,54 36.5,39" />
      {/* Left engine pod */}
      <ellipse cx="8.5" cy="48" rx="3" ry="6" />
      {/* Right engine pod */}
      <ellipse cx="55.5" cy="48" rx="3" ry="6" />
      {/* Left horizontal stabiliser */}
      <polygon points="32,52 20,59 21,62 30,56" />
      {/* Right horizontal stabiliser */}
      <polygon points="32,52 44,59 43,62 34,56" />
    </g>
  );
}

/** A330 / B777 / B787 — wider fuselage, long wings, large engines */
function WideBody() {
  return (
    <g fill="currentColor">
      {/* Fuselage — wider */}
      <ellipse cx="32" cy="33" rx="6.5" ry="27" />
      {/* Left wing — longer reach */}
      <polygon points="32,27 2,50 7,56 25.5,39" />
      {/* Right wing */}
      <polygon points="32,27 62,50 57,56 38.5,39" />
      {/* Left engine — larger */}
      <ellipse cx="6" cy="49" rx="4" ry="7" />
      {/* Right engine */}
      <ellipse cx="58" cy="49" rx="4" ry="7" />
      {/* Left stabiliser */}
      <polygon points="32,52 18,60 20,64 29,57" />
      {/* Right stabiliser */}
      <polygon points="32,52 46,60 44,64 35,57" />
    </g>
  );
}

/** B747 / A380 — very wide fuselage, massive wings, 4 engines */
function HeavyBody() {
  return (
    <g fill="currentColor">
      {/* Fuselage — very wide */}
      <ellipse cx="32" cy="32" rx="8.5" ry="28" />
      {/* Left wing — very long */}
      <polygon points="32,25 1,53 6,59 23,40" />
      {/* Right wing */}
      <polygon points="32,25 63,53 58,59 41,40" />
      {/* Left outer engine */}
      <ellipse cx="4.5" cy="52" rx="4" ry="7" />
      {/* Left inner engine */}
      <ellipse cx="15" cy="47" rx="3.5" ry="6" />
      {/* Right inner engine */}
      <ellipse cx="49" cy="47" rx="3.5" ry="6" />
      {/* Right outer engine */}
      <ellipse cx="59.5" cy="52" rx="4" ry="7" />
      {/* Left stabiliser — wider */}
      <polygon points="32,53 15,62 17,66 28,57" />
      {/* Right stabiliser */}
      <polygon points="32,53 49,62 47,66 36,57" />
    </g>
  );
}

/** Generic / unknown type */
function GenericBody() {
  return (
    <g fill="currentColor">
      {/* Fuselage */}
      <ellipse cx="32" cy="33" rx="5" ry="26" />
      {/* Left wing */}
      <polygon points="32,31 5,50 10,55 27,41" />
      {/* Right wing */}
      <polygon points="32,31 59,50 54,55 37,41" />
      {/* Left stabiliser */}
      <polygon points="32,52 19,59 21,62 30,56" />
      {/* Right stabiliser */}
      <polygon points="32,52 45,59 43,62 34,56" />
    </g>
  );
}
