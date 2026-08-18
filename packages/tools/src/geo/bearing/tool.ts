import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type GeoBearingInput = {
  readonly from: { latitudeDeg: number; longitudeDeg: number };
  readonly to: { latitudeDeg: number; longitudeDeg: number };
};

export type GeoBearingOutput = {
  readonly bearingDegrees: number;
};

const coordinateSchema = (
  description: string,
): Record<string, unknown> => ({
  additionalProperties: false,
  description,
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
});

export const geoBearingInputSchema = {
  additionalProperties: false,
  properties: {
    from: coordinateSchema("Origin coordinate in decimal degrees."),
    to: coordinateSchema("Destination coordinate in decimal degrees."),
  },
  required: ["from", "to"],
  type: "object",
} as const;

export const geoBearingOutputSchema = {
  additionalProperties: false,
  properties: {
    bearingDegrees: {
      description:
        "Initial compass bearing in degrees clockwise from true north, 0 to 360.",
      maximum: 360,
      minimum: 0,
      type: "number",
    },
  },
  required: ["bearingDegrees"],
  type: "object",
} as const;

export const geoBearingExample = {
  input: {
    from: { latitudeDeg: 48.8566, longitudeDeg: 2.3522 },
    to: { latitudeDeg: 40.7128, longitudeDeg: -74.006 },
  },
  output: { bearingDegrees: 291.79 },
} satisfies ToolExample<GeoBearingInput, GeoBearingOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const round2 = (value: number): number => Math.round(value * 100) / 100;

const rad = (degrees: number): number => (degrees * Math.PI) / 180;

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
  const found: ToolIssue[] = [];
  for (const key of Object.keys(value))
    if (key !== "latitudeDeg" && key !== "longitudeDeg")
      found.push({
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
      found.push({
        code: `${key}_invalid`,
        field: `${field}.${key}`,
        message: `${key} must be a finite number within \u00B1${limit}.`,
      });
  }
  return found;
};

export const isGeoBearingOutput = (
  value: unknown,
): value is GeoBearingOutput =>
  isRecord(value) &&
  typeof value.bearingDegrees === "number" &&
  Number.isFinite(value.bearingDegrees);

export const calculateGeoBearing = (
  input: unknown,
): ToolResult<GeoBearingOutput> => {
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
      return invalidInput([
        ...issues,
        {
          code: `${field}_required`,
          field,
          message: `${field} is required.`,
        },
      ]);
    issues.push(...coordinateIssues(field, input[field]));
  }
  if (issues.length > 0) return invalidInput(issues);

  const from = input.from as { latitudeDeg: number; longitudeDeg: number };
  const to = input.to as { latitudeDeg: number; longitudeDeg: number };
  const phi1 = rad(from.latitudeDeg);
  const phi2 = rad(to.latitudeDeg);
  const deltaLon = rad(to.longitudeDeg - from.longitudeDeg);
  const y = Math.sin(deltaLon) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return toolSuccess({ bearingDegrees: round2((bearing + 360) % 360) });
};

export const geoBearingTool = defineTool<GeoBearingInput, GeoBearingOutput>({
  contractVersion: 1,
  description:
    "Compute the initial compass bearing between two coordinates clockwise from true north.",
  discovery: {
    aliases: ["compass-bearing", "initial-heading"],
    keywords: ["bearing", "compass", "geo", "heading", "navigation"],
  },
  execute: calculateGeoBearing,
  execution: { kind: "pure" },
  id: "geo/bearing",
  inputSchema: geoBearingInputSchema,
  outputSchema: geoBearingOutputSchema,
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
        description: "Initial heading clockwise from true north.",
        id: "bearingDegrees",
        label: "Bearing",
        valueType: { format: "angle", type: "number", unit: "\u00B0" },
      },
    ],
  },
  title: "Compass Bearing",
});

export const runGeoBearing = geoBearingTool.execute;
export default geoBearingTool;
