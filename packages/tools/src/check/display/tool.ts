import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DisplayResolutionClass =
  | "full-hd"
  | "hd"
  | "low"
  | "quad-hd"
  | "sd"
  | "ultra-hd";

const REFRESH_CANDIDATES = [
  24, 30, 48, 50, 60, 72, 75, 85, 90, 100, 120, 144, 165, 180, 240, 360, 480,
] as const;

export type DisplayCheckInput = {
  readonly colorDepth?: number;
  /** Animation-frame timestamps in milliseconds from a rAF burst. */
  readonly frameTimestampsMs: readonly number[];
  readonly devicePixelRatio?: number;
  readonly height?: number;
  readonly width?: number;
};

export type DisplayCheckOutput = {
  readonly colorDepth: number | null;
  readonly height: number | null;
  readonly issues: readonly string[];
  readonly physicalHeightEstimate: number | null;
  readonly physicalWidthEstimate: number | null;
  readonly pixelRatio: number | null;
  readonly refreshClass: string | null;
  readonly refreshHertz: number | null;
  readonly resolutionClass: DisplayResolutionClass | null;
  readonly width: number | null;
};

export const displayCheckInputSchema = {
  additionalProperties: false,
  properties: {
    colorDepth: {
      description: "Color depth in bits per pixel.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    devicePixelRatio: {
      description: "Reported device pixel ratio.",
      exclusiveMaximum: 16,
      exclusiveMinimum: 0,
      type: "number",
    },
    frameTimestampsMs: {
      description:
        "Strictly increasing animation-frame timestamps in milliseconds.",
      items: { minimum: 0, type: "number" },
      type: "array",
    },
    height: {
      description: "Viewport height in CSS pixels.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    width: {
      description: "Viewport width in CSS pixels.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["frameTimestampsMs"],
  type: "object",
} as const;

export const displayCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    colorDepth: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Reported color depth in bits per pixel.",
    },
    height: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Viewport height in CSS pixels.",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    physicalHeightEstimate: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Estimated physical pixel height.",
    },
    physicalWidthEstimate: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Estimated physical pixel width.",
    },
    pixelRatio: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Reported device pixel ratio.",
    },
    refreshClass: {
      anyOf: [
        { type: "null" },
        {
          enum: [
            "24", "30", "48", "50", "60", "72", "75", "85", "90", "100",
            "120", "144", "165", "180", "240", "360", "480", "irregular",
          ],
          type: "string",
        },
      ],
      description: "Nearest common refresh rate label.",
    },
    refreshHertz: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description:
        "Measured refresh rate in hertz, or null below two timestamps.",
    },
    resolutionClass: {
      anyOf: [
        { type: "null" },
        {
          enum: ["full-hd", "hd", "low", "quad-hd", "sd", "ultra-hd"],
          type: "string",
        },
      ],
      description: "Classification of the shorter side.",
    },
    width: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Viewport width in CSS pixels.",
    },
  },
  required: [
    "refreshHertz",
    "refreshClass",
    "width",
    "height",
    "resolutionClass",
    "pixelRatio",
    "physicalWidthEstimate",
    "physicalHeightEstimate",
    "colorDepth",
    "issues",
  ],
  type: "object",
} as const;

export const displayCheckExample = {
  input: {
    colorDepth: 24,
    devicePixelRatio: 2,
    frameTimestampsMs: [0, 20, 40, 60, 80],
    height: 1080,
    width: 1920,
  },
  output: {
    colorDepth: 24,
    height: 1080,
    issues: [],
    physicalHeightEstimate: 2160,
    physicalWidthEstimate: 3840,
    pixelRatio: 2,
    refreshClass: "50",
    refreshHertz: 50,
    resolutionClass: "full-hd",
    width: 1920,
  },
} satisfies ToolExample<DisplayCheckInput, DisplayCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Refresh rates below this value are reported as low-refresh. */
const LOW_REFRESH_HZ = 45;
/** Shorter sides below this pixel count are reported as low-resolution. */
const LOW_RESOLUTION_SHORTER_SIDE = 480;

const medianFrameDeltaMs = (timestamps: readonly number[]): number => {
  const deltas = timestamps
    .slice(1)
    .map((value, index) => value - timestamps[index])
    .sort((left, right) => left - right);
  const middle = Math.floor(deltas.length / 2);
  return deltas.length % 2 === 1
    ? deltas[middle]
    : (deltas[middle - 1] + deltas[middle]) / 2;
};

const snapRefreshClass = (hertz: number): string => {
  for (const candidate of REFRESH_CANDIDATES)
    if (Math.abs(hertz - candidate) <= candidate * 0.02)
      return String(candidate);
  return "irregular";
};

const resolutionClassFor = (
  width: number,
  height: number,
): DisplayResolutionClass => {
  const shorterSide = Math.min(width, height);
  if (shorterSide >= 2160) return "ultra-hd";
  if (shorterSide >= 1440) return "quad-hd";
  if (shorterSide >= 1080) return "full-hd";
  if (shorterSide >= 720) return "hd";
  if (shorterSide >= 480) return "sd";
  return "low";
};

export const isDisplayCheckOutput = (
  value: unknown,
): value is DisplayCheckOutput =>
  isRecord(value) &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateDisplayCheck = (
  input: unknown,
): ToolResult<DisplayCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "colorDepth",
    "devicePixelRatio",
    "frameTimestampsMs",
    "height",
    "width",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawTimestamps = input.frameTimestampsMs;
  let timestamps: readonly number[] = [];
  if (rawTimestamps === undefined)
    issues.push({
      code: "frame_timestamps_required",
      field: "frameTimestampsMs",
      message: "frameTimestampsMs is required.",
    });
  else if (!Array.isArray(rawTimestamps))
    issues.push({
      code: "frame_timestamps_invalid",
      field: "frameTimestampsMs",
      message: "frameTimestampsMs must be an array of numbers.",
    });
  else {
    const limitIssue = resourceLimitIssue(
      "samples",
      rawTimestamps.length,
      "frameTimestampsMs",
    );
    if (limitIssue) issues.push(limitIssue);
    else
      rawTimestamps.forEach((entry, index) => {
        if (
          typeof entry !== "number" ||
          !Number.isFinite(entry) ||
          entry < 0
        )
          issues.push({
            code: "timestamp_invalid",
            field: `frameTimestampsMs.${index}`,
            message:
              "Frame timestamps must be nonnegative finite numbers.",
          });
      });
    if (
      Array.isArray(rawTimestamps) &&
      rawTimestamps.every(
        (entry) => typeof entry === "number" && Number.isFinite(entry),
      )
    )
      for (let index = 1; index < rawTimestamps.length; index += 1)
        if ((rawTimestamps[index] as number) <= (rawTimestamps[index - 1] as number))
          issues.push({
            code: "timestamp_order_invalid",
            field: `frameTimestampsMs.${index}`,
            message: "Frame timestamps must strictly increase.",
          });
    timestamps = (Array.isArray(rawTimestamps) ? rawTimestamps : []) as readonly number[];
  }

  const width = input.width;
  const height = input.height;
  if (
    (width === undefined) !== (height === undefined)
  )
    issues.push({
      code: "resolution_partial",
      field: width === undefined ? "width" : "height",
      message: "width and height must be supplied together.",
    });
  for (const [field, value] of [
    ["width", width],
    ["height", height],
  ] as const)
    if (
      value !== undefined &&
      (!Number.isSafeInteger(value) || (value as number) <= 0)
    )
      issues.push({
        code: `${field}_invalid`,
        field,
        message: `${field} must be a positive integer.`,
      });

  const pixelRatio = input.devicePixelRatio;
  if (
    pixelRatio !== undefined &&
    (typeof pixelRatio !== "number" ||
      !Number.isFinite(pixelRatio) ||
      (pixelRatio as number) <= 0 ||
      (pixelRatio as number) >= 16)
  )
    issues.push({
      code: "device_pixel_ratio_invalid",
      field: "devicePixelRatio",
      message: "devicePixelRatio must be a finite number between 0 and 16.",
    });

  const colorDepth = input.colorDepth;
  if (
    colorDepth !== undefined &&
    (!Number.isSafeInteger(colorDepth) || (colorDepth as number) <= 0)
  )
    issues.push({
      code: "color_depth_invalid",
      field: "colorDepth",
      message: "colorDepth must be a positive integer.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const resolvedWidth =
    width === undefined ? null : (width as number);
  const resolvedHeight =
    height === undefined ? null : (height as number);
  const resolutionClass =
    resolvedWidth === null || resolvedHeight === null
      ? null
      : resolutionClassFor(resolvedWidth, resolvedHeight);
  const refreshHertz =
    timestamps.length >= 2 ? 1000 / medianFrameDeltaMs(timestamps) : null;

  const outputIssues: string[] = [];
  if (refreshHertz !== null && refreshHertz < LOW_REFRESH_HZ)
    outputIssues.push("low-refresh");
  if (
    resolvedWidth !== null &&
    resolvedHeight !== null &&
    Math.min(resolvedWidth, resolvedHeight) < LOW_RESOLUTION_SHORTER_SIDE
  )
    outputIssues.push("low-resolution");

  return toolSuccess({
    colorDepth: colorDepth === undefined ? null : (colorDepth as number),
    height: resolvedHeight,
    issues: outputIssues,
    physicalHeightEstimate:
      resolvedHeight === null || pixelRatio === undefined
        ? null
        : Math.round(resolvedHeight * (pixelRatio as number)),
    physicalWidthEstimate:
      resolvedWidth === null || pixelRatio === undefined
        ? null
        : Math.round(resolvedWidth * (pixelRatio as number)),
    pixelRatio: pixelRatio === undefined ? null : (pixelRatio as number),
    refreshClass:
      refreshHertz === null ? null : snapRefreshClass(refreshHertz),
    refreshHertz,
    resolutionClass,
    width: resolvedWidth,
  });
};

export const displayCheckTool = defineTool<
  DisplayCheckInput,
  DisplayCheckOutput
>({
  contractVersion: 1,
  description:
    "Analyze a display probe into refresh rate, resolution class, and pixel density estimates.",
  discovery: {
    aliases: ["display-check", "monitor-check", "screen-check"],
    keywords: ["display", "hidpi", "monitor", "refresh rate", "screen"],
  },
  execute: calculateDisplayCheck,
  execution: { kind: "pure" },
  id: "check/display",
  inputSchema: displayCheckInputSchema,
  outputSchema: displayCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Display probe supplied by the surface.",
        id: "probe",
        label: "Display probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/display", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Measured refresh rate in hertz.",
        id: "refreshHertz",
        label: "Refresh rate",
        valueType: { format: "frequency", type: "number", unit: "Hz" },
      },
      {
        description: "Nearest common refresh-rate label.",
        id: "refreshClass",
        label: "Refresh class",
        valueType: { format: "refresh-class", type: "string" },
      },
      {
        description: "Viewport width in CSS pixels.",
        id: "width",
        label: "Width",
        valueType: { format: "pixels", type: "integer", unit: "px" },
      },
      {
        description: "Viewport height in CSS pixels.",
        id: "height",
        label: "Height",
        valueType: { format: "pixels", type: "integer", unit: "px" },
      },
      {
        description: "Classification of the shorter side.",
        id: "resolutionClass",
        label: "Resolution class",
        valueType: { format: "video-resolution-class", type: "string" },
      },
      {
        description: "Reported device pixel ratio.",
        id: "pixelRatio",
        label: "Pixel ratio",
        valueType: { format: "ratio", type: "number" },
      },
      {
        description: "Stable machine-facing degradation codes.",
        id: "issues",
        label: "Issues",
        valueType: {
          format: "issue-codes",
          items: { type: "string" },
          type: "list",
        },
      },
    ],
  },
  title: "Display Checker",
});

export const runDisplayCheck = displayCheckTool.execute;
export default displayCheckTool;
