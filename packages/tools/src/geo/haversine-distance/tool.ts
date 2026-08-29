import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type GeoCoordinate = {
  readonly latitudeDeg: number;
  readonly longitudeDeg: number;
};

export type HaversineDistanceInput = {
  readonly from: GeoCoordinate;
  readonly to: GeoCoordinate;
};

export type HaversineDistanceOutput = {
  readonly kilometers: number;
  readonly miles: number;
};

export const haversineDistanceInputSchema = {
  additionalProperties: false,
  properties: {
    from: {
      additionalProperties: false,
      description: "Origin coordinate in decimal degrees.",
      properties: {
        latitudeDeg: {
          description: "Latitude in decimal degrees, -90 to 90.",
          maximum: 90,
          minimum: -90,
          type: "number",
        },
        longitudeDeg: {
          description: "Longitude in decimal degrees, -180 to 180.",
          maximum: 180,
          minimum: -180,
          type: "number",
        },
      },
      required: ["latitudeDeg", "longitudeDeg"],
      type: "object",
    },
    to: {
      additionalProperties: false,
      description: "Destination coordinate in decimal degrees.",
      properties: {
        latitudeDeg: {
          description: "Latitude in decimal degrees, -90 to 90.",
          maximum: 90,
          minimum: -90,
          type: "number",
        },
        longitudeDeg: {
          description: "Longitude in decimal degrees, -180 to 180.",
          maximum: 180,
          minimum: -180,
          type: "number",
        },
      },
      required: ["latitudeDeg", "longitudeDeg"],
      type: "object",
    },
  },
  required: ["from", "to"],
  type: "object",
} as const;

export const haversineDistanceOutputSchema = {
  additionalProperties: false,
  properties: {
    kilometers: {
      description: "Great-circle distance rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    miles: {
      description: "Great-circle distance rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["kilometers", "miles"],
  type: "object",
} as const;

export const haversineDistanceExample = {
  input: {
    from: { latitudeDeg: 48.8566, longitudeDeg: 2.3522 },
    to: { latitudeDeg: 40.7128, longitudeDeg: -74.006 },
  },
  output: { kilometers: 5837.25, miles: 3627.1 },
} satisfies ToolExample<HaversineDistanceInput, HaversineDistanceOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Mean Earth radius in kilometers (IUGG). */
const EARTH_RADIUS_KM = 6371.0088;
const KM_PER_MILE = 1.609344;

const round2 = (value: number): number => Math.round(value * 100) / 100;

const coordinateIssues = (
  field: string,
  value: unknown,
): readonly ToolIssue[] => {
  if (!isRecord(value))
    return [
      {
        code: `${field}_invalid`,
        field,
        message: `${field} must be an object with latitudeDeg and longitudeDeg.`,
      },
    ];
  const issues: ToolIssue[] = [];
  for (const key of Object.keys(value))
    if (key !== "latitudeDeg" && key !== "longitudeDeg")
      issues.push({
        code: "unknown_field",
        field: `${field}.${key}`,
        message: `${key} is not a supported coordinate field.`,
      });
  for (const [key, limit] of [
    ["latitudeDeg", 90],
    ["longitudeDeg", 180],
  ] as const) {
    const entry = value[key];
    if (
      typeof entry !== "number" ||
      !Number.isFinite(entry) ||
      Math.abs(entry) > limit
    )
      issues.push({
        code: `${key}_invalid`,
        field: `${field}.${key}`,
        message: `${key} must be a finite number within \u00B1${limit}.`,
      });
  }
  return issues;
};

export const isHaversineDistanceOutput = (
  value: unknown,
): value is HaversineDistanceOutput =>
  isRecord(value) &&
  typeof value.kilometers === "number" &&
  Number.isFinite(value.kilometers);

export const calculateHaversineDistance = (
  input: unknown,
): ToolResult<HaversineDistanceOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "from" && field !== "to")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const field of ["from", "to"] as const) {
    if (input[field] === undefined)
      issues.push({
        code: `${field}_required`,
        field,
        message: `${field} is required.`,
      });
    else issues.push(...coordinateIssues(field, input[field]));
  }
  if (issues.length > 0) return invalidInput(issues);

  const from = input.from as GeoCoordinate;
  const to = input.to as GeoCoordinate;
  const rad = (degrees: number): number => (degrees * Math.PI) / 180;
  const deltaLat = rad(to.latitudeDeg - from.latitudeDeg);
  const deltaLon = rad(to.longitudeDeg - from.longitudeDeg);
  const halfChord =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(rad(from.latitudeDeg)) *
      Math.cos(rad(to.latitudeDeg)) *
      Math.sin(deltaLon / 2) ** 2;
  const centralAngle = 2 * Math.asin(Math.min(1, Math.sqrt(halfChord)));
  const kilometers = round2(EARTH_RADIUS_KM * centralAngle);
  return toolSuccess({
    kilometers,
    miles: round2(kilometers / KM_PER_MILE),
  });
};

export const haversineDistanceTool = defineTool<
  HaversineDistanceInput,
  HaversineDistanceOutput
>({
  contractVersion: 1,
  description:
    "Compute the great-circle distance between two coordinates with the haversine formula.",
  discovery: {
    aliases: ["distance-between-coordinates", "great-circle-distance"],
    keywords: ["coordinates", "distance", "earth", "geo", "haversine"],
  },
  execute: calculateHaversineDistance,
  execution: { kind: "pure" },
  id: "geo/haversine-distance",
  inputSchema: haversineDistanceInputSchema,
  outputSchema: haversineDistanceOutputSchema,
  ports: {
    inputs: [
      {
        description: "Origin coordinate in decimal degrees.",
        id: "from",
        label: "From",
        required: true,
        valueType: { format: "geo/coordinate", type: "object" },
      },
      {
        description: "Destination coordinate in decimal degrees.",
        id: "to",
        label: "To",
        required: true,
        valueType: { format: "geo/coordinate", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Great-circle distance rounded to two decimals.",
        id: "kilometers",
        label: "Kilometers",
        valueType: { format: "length", type: "number", unit: "km" },
      },
      {
        description: "Great-circle distance rounded to two decimals.",
        id: "miles",
        label: "Miles",
        valueType: { format: "length", type: "number", unit: "mi" },
      },
    ],
  },
  title: "Haversine Distance",
});

export const runHaversineDistance = haversineDistanceTool.execute;
export default haversineDistanceTool;
