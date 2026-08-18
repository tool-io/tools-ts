import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DestinationPointInput = {
  readonly bearingDegrees: number;
  readonly distanceKm: number;
  readonly startLatitudeDeg: number;
  readonly startLongitudeDeg: number;
};

export type DestinationPointOutput = {
  readonly latitudeDeg: number;
  readonly longitudeDeg: number;
};

/** Mean Earth radius in kilometers (IUGG). */
const EARTH_RADIUS_KM = 6371.0088;

const round2 = (value: number): number => Math.round(value * 100) / 100;
const rad = (degrees: number): number => (degrees * Math.PI) / 180;
const deg = (radians: number): number => (radians * 180) / Math.PI;

export const destinationPointInputSchema = {
  additionalProperties: false,
  properties: {
    bearingDegrees: {
      description: "Compass bearing clockwise from true north.",
      maximum: 360,
      minimum: 0,
      type: "number",
    },
    distanceKm: {
      description: "Great-circle distance to travel in kilometers.",
      exclusiveMinimum: 0,
      maximum: 40075.017,
      type: "number",
    },
    startLatitudeDeg: {
      description: "Starting latitude in decimal degrees, -90 to 90.",
      maximum: 90,
      minimum: -90,
      type: "number",
    },
    startLongitudeDeg: {
      description: "Starting longitude in decimal degrees, -180 to 180.",
      maximum: 180,
      minimum: -180,
      type: "number",
    },
  },
  required: [
    "startLatitudeDeg",
    "startLongitudeDeg",
    "bearingDegrees",
    "distanceKm",
  ],
  type: "object",
} as const;

export const destinationPointOutputSchema = {
  additionalProperties: false,
  properties: {
    latitudeDeg: {
      description: "Destination latitude rounded to two decimals.",
      maximum: 90,
      minimum: -90,
      type: "number",
    },
    longitudeDeg: {
      description:
        "Destination longitude rounded to two decimals, wrapped to -180..180.",
      maximum: 180,
      minimum: -180,
      type: "number",
    },
  },
  required: ["latitudeDeg", "longitudeDeg"],
  type: "object",
} as const;

export const destinationPointExample = {
  input: {
    bearingDegrees: 90,
    distanceKm: 1000,
    startLatitudeDeg: 0,
    startLongitudeDeg: 0,
  },
  output: { latitudeDeg: 0, longitudeDeg: 8.99 },
} satisfies ToolExample<DestinationPointInput, DestinationPointOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isDestinationPointOutput = (
  value: unknown,
): value is DestinationPointOutput =>
  isRecord(value) &&
  typeof value.latitudeDeg === "number" &&
  Number.isFinite(value.latitudeDeg);

export const calculateDestinationPoint = (
  input: unknown,
): ToolResult<DestinationPointOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "bearingDegrees",
    "distanceKm",
    "startLatitudeDeg",
    "startLongitudeDeg",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, value] of [
    ["startLatitudeDeg", input.startLatitudeDeg],
    ["startLongitudeDeg", input.startLongitudeDeg],
    ["bearingDegrees", input.bearingDegrees],
    ["distanceKm", input.distanceKm],
  ] as const) {
    if (value === undefined) {
      issues.push({
        code: `${field}_required`,
        field,
        message: `${field} is required.`,
      });
      continue;
    }
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (value as number) < 0
    )
      issues.push({
        code: `${field}_invalid`,
        field,
        message: `${field} must be a nonnegative finite number.`,
      });
    else if (
      (field === "bearingDegrees" && (value as number) > 360) ||
      (field === "distanceKm" &&
        (value as number) > 40075.017)
    )
      issues.push({
        code: `${field}_out_of_range`,
        field,
        message:
          field === "bearingDegrees"
            ? "bearingDegrees must not exceed 360."
            : "distanceKm must not exceed one Earth circumference.",
      });
  }

  if (
    typeof input.startLatitudeDeg === "number" &&
    (Math.abs(input.startLatitudeDeg) > 90 ||
      Math.abs(input.startLongitudeDeg as number) > 180)
  )
    return invalidInput([
      ...issues,
      {
        code: "start_coordinates_invalid",
        field: "startLatitudeDeg",
        message: "Start coordinates must be within their valid ranges.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const phi1 = rad(input.startLatitudeDeg as number);
  const lambda1 = rad(input.startLongitudeDeg as number);
  const theta = rad(input.bearingDegrees as number);
  const delta =
    (input.distanceKm as number) / EARTH_RADIUS_KM;

  const phi2 = Math.asin(
    Math.sin(phi1) * Math.cos(delta) +
      Math.cos(phi1) * Math.sin(delta) * Math.cos(theta),
  );
  const lambda2 =
    lambda1 +
    Math.atan2(
      Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
      Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2),
    );

  const latitude = round2(deg(phi2));
  const longitude = round2(((deg(lambda2) + 540) % 360) - 180);
  return toolSuccess({ latitudeDeg: latitude, longitudeDeg: longitude });
};

export const destinationPointTool = defineTool<
  DestinationPointInput,
  DestinationPointOutput
>({
  contractVersion: 1,
  description:
    "Project a starting coordinate along a bearing and great-circle distance to its destination point.",
  discovery: {
    aliases: ["coordinate-offset", "travel-projection"],
    keywords: ["destination", "geo", "great-circle", "navigation"],
  },
  execute: calculateDestinationPoint,
  execution: { kind: "pure" },
  id: "geo/destination-point",
  inputSchema: destinationPointInputSchema,
  outputSchema: destinationPointOutputSchema,
  ports: {
    inputs: [
      {
        description: "Starting latitude in decimal degrees.",
        id: "startLatitudeDeg",
        label: "Start latitude",
        required: true,
        valueType: { format: "geo/latitude", type: "number", unit: "\u00B0" },
      },
      {
        description: "Starting longitude in decimal degrees.",
        id: "startLongitudeDeg",
        label: "Start longitude",
        required: true,
        valueType: { format: "geo/longitude", type: "number", unit: "\u00B0" },
      },
      {
        description: "Compass bearing clockwise from true north.",
        id: "bearingDegrees",
        label: "Bearing",
        required: true,
        valueType: { format: "angle", type: "number", unit: "\u00B0" },
      },
      {
        description: "Great-circle distance in kilometers.",
        id: "distanceKm",
        label: "Distance",
        required: true,
        valueType: { format: "length", type: "number", unit: "km" },
      },
    ],
    outputs: [
      {
        description: "Destination latitude.",
        id: "latitudeDeg",
        label: "Latitude",
        valueType: { format: "geo/latitude", type: "number", unit: "\u00B0" },
      },
      {
        description: "Destination longitude.",
        id: "longitudeDeg",
        label: "Longitude",
        valueType: { format: "geo/longitude", type: "number", unit: "\u00B0" },
      },
    ],
  },
  title: "Destination Point",
});

export const runDestinationPoint = destinationPointTool.execute;
export default destinationPointTool;
