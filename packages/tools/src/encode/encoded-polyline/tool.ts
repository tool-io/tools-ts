import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EncodedPolylineEncodeInput = {
  readonly coordinates: readonly (readonly number[])[];
  readonly precision?: number;
};

export type EncodedPolylineEncodeOutput = {
  readonly polyline: string;
};

export const calculateEncodedPolylineEncode = (
  input: EncodedPolylineEncodeInput,
): EncodedPolylineEncodeOutput => {
  if (input.coordinates.length === 0)
    simpleError(
      "coordinates",
      "At least one coordinate is required.",
      "empty_coordinates",
    );
  const precision = input.precision ?? 5;
  if (!Number.isSafeInteger(precision) || precision < 0 || precision > 11)
    simpleError(
      "precision",
      "Precision must be between 0 and 11.",
      "invalid_precision",
    );
  const factor = 10 ** precision;
  let previousLatitude = 0;
  let previousLongitude = 0;
  let polyline = "";
  const encodeValue = (value: number): string => {
    let bits = value < 0 ? -value * 2 - 1 : value * 2;
    if (!Number.isSafeInteger(bits))
      simpleError(
        "coordinates",
        "Coordinate values are too large for precise encoding.",
        "coordinate_overflow",
      );
    let chunk = "";
    do {
      let byte = bits % 32;
      bits = Math.floor(bits / 32);
      if (bits > 0) byte |= 0x20;
      chunk += String.fromCharCode(byte + 63);
    } while (bits > 0);
    return chunk;
  };
  for (const coordinate of input.coordinates as readonly number[][]) {
    if (coordinate.length !== 2)
      simpleError(
        "coordinates",
        "Each coordinate must be a [latitude, longitude] pair.",
        "invalid_coordinate",
      );
    const rawLatitude = coordinate[0]!;
    const rawLongitude = coordinate[1]!;
    if (!Number.isFinite(rawLatitude) || rawLatitude < -90 || rawLatitude > 90)
      simpleError(
        "coordinates",
        "Latitude must be between -90 and 90 degrees.",
        "invalid_latitude",
      );
    if (
      !Number.isFinite(rawLongitude) ||
      rawLongitude < -180 ||
      rawLongitude > 180
    )
      simpleError(
        "coordinates",
        "Longitude must be between -180 and 180 degrees.",
        "invalid_longitude",
      );
    const latitude = Math.round(rawLatitude * factor);
    const longitude = Math.round(rawLongitude * factor);
    polyline += encodeValue(latitude - previousLatitude);
    polyline += encodeValue(longitude - previousLongitude);
    previousLatitude = latitude;
    previousLongitude = longitude;
  }
  return { polyline };
};

export const encodedPolylineEncodeExample = {
  input: {
    coordinates: [
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ],
    precision: 5,
  },
  output: { polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@" },
} satisfies ToolExample<
  EncodedPolylineEncodeInput,
  EncodedPolylineEncodeOutput
>;

export const encodedPolylineEncodeTool = createSimpleTool({
  id: "encode/encoded-polyline",
  title: "Google Encoded Polyline Encoder",
  description:
    "Encode [latitude, longitude] pairs into a Google encoded-polyline string using the standard delta and varint scheme.",
  inputs: [
    {
      description: "Coordinates as [latitude, longitude] pairs in route order.",
      id: "coordinates",
      kind: "matrix",
      label: "Coordinates",
    },
    {
      default: 5,
      description:
        "Decimal places encoded per coordinate (default Google precision is 5).",
      id: "precision",
      kind: "integer",
      label: "Precision",
      maximum: 11,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Encoded polyline string.",
      id: "polyline",
      kind: "string",
      label: "Polyline",
    },
  ],
  calculate: (input) =>
    calculateEncodedPolylineEncode({
      coordinates: input.coordinates as readonly (readonly number[])[],
      precision: input.precision as number | undefined,
    }),
});

export const runEncodedPolylineEncode = encodedPolylineEncodeTool.execute;
export default encodedPolylineEncodeTool;
