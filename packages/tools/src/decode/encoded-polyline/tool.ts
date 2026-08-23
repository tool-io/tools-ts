import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EncodedPolylineDecodeInput = {
  readonly polyline: string;
  readonly precision?: number;
};

export type EncodedPolylineDecodeOutput = {
  readonly coordinates: readonly (readonly number[])[];
};

export const calculateEncodedPolylineDecode = (
  input: EncodedPolylineDecodeInput,
): EncodedPolylineDecodeOutput => {
  const polyline = input.polyline;
  if (polyline.length === 0)
    simpleError("polyline", "Polyline must not be empty.", "empty_polyline");
  const precision = input.precision ?? 5;
  if (!Number.isSafeInteger(precision) || precision < 0 || precision > 11)
    simpleError(
      "precision",
      "Precision must be between 0 and 11.",
      "invalid_precision",
    );
  const factor = 10 ** precision;
  let index = 0;
  let latitude = 0;
  let longitude = 0;
  const coordinates: number[][] = [];
  const readChunk = (): number => {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      if (index >= polyline.length)
        simpleError(
          "polyline",
          "Polyline ends with an incomplete value.",
          "malformed_polyline",
        );
      const code = polyline.charCodeAt(index);
      index += 1;
      if (code < 63 || code > 126)
        simpleError(
          "polyline",
          "Polyline contains an invalid character.",
          "malformed_polyline",
        );
      byte = code - 63;
      result += (byte & 0x1f) * 2 ** shift;
      shift += 5;
      if (shift > 53 || !Number.isSafeInteger(result))
        simpleError(
          "polyline",
          "Polyline contains an oversized value.",
          "malformed_polyline",
        );
    } while (byte >= 0x20);
    return result % 2 === 1 ? -(result + 1) / 2 : result / 2;
  };
  while (index < polyline.length) {
    latitude += readChunk();
    if (index >= polyline.length)
      simpleError(
        "polyline",
        "Polyline has a latitude without a longitude.",
        "malformed_polyline",
      );
    longitude += readChunk();
    if (latitude / factor < -90 || latitude / factor > 90)
      simpleError(
        "polyline",
        "Decoded latitude is outside -90 to 90 degrees.",
        "invalid_latitude",
      );
    if (longitude / factor < -180 || longitude / factor > 180)
      simpleError(
        "polyline",
        "Decoded longitude is outside -180 to 180 degrees.",
        "invalid_longitude",
      );
    coordinates.push([latitude / factor, longitude / factor]);
  }
  return { coordinates };
};

export const encodedPolylineDecodeExample = {
  input: { polyline: "_p~iF~ps|U_ulLnnqC", precision: 5 },
  output: {
    coordinates: [
      [38.5, -120.2],
      [40.7, -120.95],
    ],
  },
} satisfies ToolExample<
  EncodedPolylineDecodeInput,
  EncodedPolylineDecodeOutput
>;

export const encodedPolylineDecodeTool = createSimpleTool({
  id: "decode/encoded-polyline",
  title: "Google Encoded Polyline Decoder",
  description:
    "Decode a Google encoded-polyline string into [latitude, longitude] coordinate pairs at the given decimal precision.",
  inputs: [
    {
      description: "Encoded polyline using the Google polyline algorithm.",
      id: "polyline",
      kind: "string",
      label: "Polyline",
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
      description: "Decoded coordinates as [latitude, longitude] pairs.",
      id: "coordinates",
      kind: "matrix",
      label: "Coordinates",
    },
  ],
  calculate: (input) =>
    calculateEncodedPolylineDecode({
      polyline: input.polyline as string,
      precision: input.precision as number | undefined,
    }),
});

export const runEncodedPolylineDecode = encodedPolylineDecodeTool.execute;
export default encodedPolylineDecodeTool;
