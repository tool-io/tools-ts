import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GeohashEncodeInput = {
  readonly latitude: number;
  readonly longitude: number;
  readonly precision?: number;
};

export type GeohashEncodeOutput = {
  readonly geohash: string;
};

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

/**
 * Interleave binary searches over longitude/latitude to build the
 * 5-bit-per-character base32 geohash.
 */
export const calculateGeohashEncode = (
  input: GeohashEncodeInput,
): GeohashEncodeOutput => {
  const precision = input.precision ?? 9;
  let south = -90;
  let north = 90;
  let west = -180;
  let east = 180;
  let evenBit = true;
  let bitCount = 0;
  let characterIndex = 0;
  let geohash = "";
  while (geohash.length < precision) {
    if (evenBit) {
      const midLongitude = (west + east) / 2;
      if (input.longitude >= midLongitude) {
        characterIndex = characterIndex * 2 + 1;
        west = midLongitude;
      } else {
        characterIndex *= 2;
        east = midLongitude;
      }
    } else {
      const midLatitude = (south + north) / 2;
      if (input.latitude >= midLatitude) {
        characterIndex = characterIndex * 2 + 1;
        south = midLatitude;
      } else {
        characterIndex *= 2;
        north = midLatitude;
      }
    }
    evenBit = !evenBit;
    bitCount += 1;
    if (bitCount === 5) {
      geohash += BASE32[characterIndex];
      bitCount = 0;
      characterIndex = 0;
    }
  }
  return { geohash };
};

export const geohashEncodeExample = {
  input: { latitude: 57.64911, longitude: 10.40744, precision: 10 },
  output: { geohash: "u4pruydqqv" },
} satisfies ToolExample<GeohashEncodeInput, GeohashEncodeOutput>;

export const geohashEncodeTool = createSimpleTool({
  id: "encode/geohash",
  title: "Geohash Encoder",
  description:
    "Encode a latitude/longitude pair into a geohash string of the requested base32 length.",
  inputs: [
    {
      description: "Latitude in decimal degrees between -90 and 90.",
      id: "latitude",
      kind: "number",
      label: "Latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      description: "Longitude in decimal degrees between -180 and 180.",
      id: "longitude",
      kind: "number",
      label: "Longitude",
      maximum: 180,
      minimum: -180,
    },
    {
      default: 9,
      description: "Number of base32 characters to emit.",
      id: "precision",
      kind: "integer",
      label: "Precision",
      maximum: 12,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Geohash using the base32 alphabet 0123456789bcdefghjkmnpqrstuvwxyz.",
      id: "geohash",
      kind: "string",
      label: "Geohash",
    },
  ],
  calculate: (input) =>
    calculateGeohashEncode({
      latitude: input.latitude as number,
      longitude: input.longitude as number,
      precision: input.precision as number | undefined,
    }),
});

export const runGeohashEncode = geohashEncodeTool.execute;
export default geohashEncodeTool;
