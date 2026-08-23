import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeohashDecodeInput = {
  readonly geohash: string;
};

export type GeohashDecodeOutput = {
  readonly latitude: number;
  readonly longitude: number;
  readonly south: number;
  readonly west: number;
  readonly north: number;
  readonly east: number;
};

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

/**
 * Decode a geohash into the centre of its cell plus the cell bounds.
 */
export const calculateGeohashDecode = (
  input: GeohashDecodeInput,
): GeohashDecodeOutput => {
  const geohash = input.geohash.toLowerCase();
  if (geohash.length === 0)
    simpleError("geohash", "Geohash must not be empty.", "empty_geohash");
  let evenBit = true;
  let south = -90;
  let north = 90;
  let west = -180;
  let east = 180;
  for (const character of geohash) {
    const index = BASE32.indexOf(character);
    if (index < 0)
      simpleError(
        "geohash",
        "Geohash contains a character outside the base32 alphabet.",
        "malformed_geohash",
      );
    for (let bit = 4; bit >= 0; bit -= 1) {
      if ((index >> bit) & 1) {
        if (evenBit) west = (west + east) / 2;
        else south = (south + north) / 2;
      } else if (evenBit) east = (west + east) / 2;
      else north = (south + north) / 2;
      evenBit = !evenBit;
    }
  }
  return {
    latitude: (south + north) / 2,
    longitude: (west + east) / 2,
    south,
    west,
    north,
    east,
  };
};

export const geohashDecodeExample = {
  input: { geohash: "ezs42" },
  output: {
    latitude: 42.60498046875,
    longitude: -5.60302734375,
    south: 42.5830078125,
    west: -5.625,
    north: 42.626953125,
    east: -5.5810546875,
  },
} satisfies ToolExample<GeohashDecodeInput, GeohashDecodeOutput>;

export const geohashDecodeTool = createSimpleTool({
  id: "decode/geohash",
  title: "Geohash Decoder",
  description:
    "Decode a geohash string into its cell centre latitude/longitude plus the bounding box of the cell.",
  inputs: [
    {
      description:
        "Geohash using the base32 alphabet 0123456789bcdefghjkmnpqrstuvwxyz.",
      id: "geohash",
      kind: "string",
      label: "Geohash",
    },
  ],
  outputs: [
    {
      description: "Centre latitude of the geohash cell.",
      id: "latitude",
      kind: "number",
      label: "Latitude",
    },
    {
      description: "Centre longitude of the geohash cell.",
      id: "longitude",
      kind: "number",
      label: "Longitude",
    },
    {
      description: "Southern boundary of the cell.",
      id: "south",
      kind: "number",
      label: "South",
    },
    {
      description: "Western boundary of the cell.",
      id: "west",
      kind: "number",
      label: "West",
    },
    {
      description: "Northern boundary of the cell.",
      id: "north",
      kind: "number",
      label: "North",
    },
    {
      description: "Eastern boundary of the cell.",
      id: "east",
      kind: "number",
      label: "East",
    },
  ],
  calculate: (input) =>
    calculateGeohashDecode({ geohash: input.geohash as string }),
});

export const runGeohashDecode = geohashDecodeTool.execute;
export default geohashDecodeTool;
