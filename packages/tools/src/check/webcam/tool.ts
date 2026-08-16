import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type WebcamCheckVerdict =
  | "blocked-by-permission"
  | "degraded"
  | "not-found"
  | "unsupported-on-surface"
  | "working";

export type WebcamResolutionClass =
  | "full-hd"
  | "hd"
  | "low"
  | "quad-hd"
  | "sd"
  | "ultra-hd";

/** One captured camera frame reported by the acquiring surface. */
export type WebcamProbeFrame = {
  /** Nondecreasing capture timestamp in milliseconds. */
  readonly capturedAt: number;
  readonly height: number;
  readonly width: number;
};

export type WebcamCheckInput = {
  /** Number of video input devices the surface enumerated. */
  readonly deviceCount?: number;
  /** Captured frames in capture order; may be empty when opening failed. */
  readonly frames: readonly WebcamProbeFrame[];
  readonly permissionState?: "denied" | "granted" | "prompt" | "unknown";
  /** Platform error code from opening the stream, such as NotAllowedError. */
  readonly streamError?: string;
  /** False when the current surface cannot capture camera video at all. */
  readonly surfaceSupported?: boolean;
};

export type WebcamCheckOutput = {
  readonly estimatedFps: number | null;
  readonly frameCount: number;
  readonly height: number | null;
  /** Stable machine-facing degradation codes in fixed priority order. */
  readonly issues: readonly string[];
  readonly resolutionClass: WebcamResolutionClass | null;
  readonly verdict: WebcamCheckVerdict;
  readonly width: number | null;
};

export const webcamCheckInputSchema = {
  additionalProperties: false,
  properties: {
    deviceCount: {
      description: "Number of video input devices found by the surface.",
      minimum: 0,
      type: "integer",
    },
    frames: {
      description: "Captured frames in capture order.",
      items: {
        additionalProperties: false,
        properties: {
          capturedAt: {
            description: "Capture timestamp in milliseconds.",
            minimum: 0,
            type: "integer",
          },
          height: {
            description: "Frame height in pixels.",
            exclusiveMinimum: 0,
            type: "integer",
          },
          width: {
            description: "Frame width in pixels.",
            exclusiveMinimum: 0,
            type: "integer",
          },
        },
        required: ["width", "height", "capturedAt"],
        type: "object",
      },
      type: "array",
    },
    permissionState: {
      description: "Camera permission state reported by the surface.",
      enum: ["denied", "granted", "prompt", "unknown"],
      type: "string",
    },
    streamError: {
      description:
        "Platform error code from opening the stream, when opening failed.",
      type: "string",
    },
    surfaceSupported: {
      description: "Whether the surface can capture camera video at all.",
      type: "boolean",
    },
  },
  required: ["frames"],
  type: "object",
} as const;

export const webcamCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    estimatedFps: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Estimated frames per second, or null below two frames.",
    },
    frameCount: {
      description: "Number of analyzed frames.",
      minimum: 0,
      type: "integer",
    },
    height: {
      anyOf: [{ type: "null" }, { exclusiveMinimum: 0, type: "integer" }],
      description: "Height of the most common frame size.",
    },
    issues: {
      description: "Stable degradation codes in fixed priority order.",
      items: { type: "string" },
      type: "array",
    },
    resolutionClass: {
      anyOf: [
        { type: "null" },
        {
          enum: ["full-hd", "hd", "low", "quad-hd", "sd", "ultra-hd"],
          type: "string",
        },
      ],
      description: "Classification of the most common frame size.",
    },
    verdict: {
      description: "Overall webcam diagnosis.",
      enum: [
        "working",
        "degraded",
        "blocked-by-permission",
        "not-found",
        "unsupported-on-surface",
      ],
      type: "string",
    },
    width: {
      anyOf: [{ type: "null" }, { exclusiveMinimum: 0, type: "integer" }],
      description: "Width of the most common frame size.",
    },
  },
  required: [
    "verdict",
    "estimatedFps",
    "frameCount",
    "width",
    "height",
    "resolutionClass",
    "issues",
  ],
  type: "object",
} as const;

export const webcamCheckExample = {
  input: {
    deviceCount: 1,
    frames: [
      { capturedAt: 0, height: 720, width: 1280 },
      { capturedAt: 40, height: 720, width: 1280 },
      { capturedAt: 80, height: 720, width: 1280 },
      { capturedAt: 120, height: 720, width: 1280 },
    ],
    permissionState: "granted",
  },
  output: {
    estimatedFps: 25,
    frameCount: 4,
    height: 720,
    issues: [],
    resolutionClass: "hd",
    verdict: "working",
    width: 1280,
  },
} satisfies ToolExample<WebcamCheckInput, WebcamCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const PERMISSION_STATES = ["denied", "granted", "prompt", "unknown"] as const;

/** Frame rates below this value are reported as low-frame-rate. */
const LOW_FPS_THRESHOLD = 15;
/** Shorter frame sides below this pixel count are reported as low-resolution. */
const LOW_RESOLUTION_SHORTER_SIDE = 480;

const resolutionClassFor = (
  width: number,
  height: number,
): WebcamResolutionClass => {
  const shorterSide = Math.min(width, height);
  if (shorterSide >= 2160) return "ultra-hd";
  if (shorterSide >= 1440) return "quad-hd";
  if (shorterSide >= 1080) return "full-hd";
  if (shorterSide >= 720) return "hd";
  if (shorterSide >= 480) return "sd";
  return "low";
};

const medianFrameDeltaMs = (
  frames: readonly WebcamProbeFrame[],
): number => {
  const deltas = frames
    .slice(1)
    .map((frame, index) => frame.capturedAt - frames[index].capturedAt)
    .sort((left, right) => left - right);
  const middle = Math.floor(deltas.length / 2);
  return deltas.length % 2 === 1
    ? deltas[middle]
    : (deltas[middle - 1] + deltas[middle]) / 2;
};

/** Most common frame size; ties keep the earliest captured size. */
const dominantResolution = (
  frames: readonly WebcamProbeFrame[],
): WebcamProbeFrame | undefined => {
  const counts = new Map<string, number>();
  const sizes = new Map<string, WebcamProbeFrame>();
  for (const frame of frames) {
    const key = `${frame.width}x${frame.height}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (!sizes.has(key)) sizes.set(key, frame);
  }
  let bestKey: string | undefined;
  let bestCount = 0;
  for (const [key, count] of counts)
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  return bestKey === undefined ? undefined : sizes.get(bestKey);
};

const frameFieldIssues = (
  frames: readonly unknown[],
): { readonly issues: readonly ToolIssue[]; readonly validCount: number } => {
  const issues: ToolIssue[] = [];
  const limitIssue = resourceLimitIssue("samples", frames.length, "frames");
  if (limitIssue) return { issues: [limitIssue], validCount: 0 };

  let validCount = 0;
  const timestamps: number[] = [];
  frames.forEach((entry, index) => {
    const before = issues.length;
    if (!isRecord(entry)) {
      issues.push({
        code: "frame_object_required",
        field: `frames.${index}`,
        message: `frames.${index} must be an object.`,
      });
    } else {
      for (const key of Object.keys(entry))
        if (key !== "width" && key !== "height" && key !== "capturedAt")
          issues.push({
            code: "unknown_field",
            field: `frames.${index}.${key}`,
            message: `${key} is not a supported frame field.`,
          });
      const { capturedAt, height, width } = entry;
      if (
        typeof width !== "number" ||
        !Number.isSafeInteger(width) ||
        width <= 0
      )
        issues.push({
          code: "frame_width_invalid",
          field: `frames.${index}.width`,
          message: `frames.${index}.width must be a positive integer.`,
        });
      if (
        typeof height !== "number" ||
        !Number.isSafeInteger(height) ||
        height <= 0
      )
        issues.push({
          code: "frame_height_invalid",
          field: `frames.${index}.height`,
          message: `frames.${index}.height must be a positive integer.`,
        });
      if (
        typeof capturedAt !== "number" ||
        !Number.isSafeInteger(capturedAt) ||
        capturedAt < 0
      )
        issues.push({
          code: "frame_timestamp_invalid",
          field: `frames.${index}.capturedAt`,
          message: `frames.${index}.capturedAt must be a nonnegative integer.`,
        });
      if (issues.length === before) {
        validCount += 1;
        timestamps.push(capturedAt as number);
      }
    }
  });

  if (validCount === frames.length)
    for (let index = 1; index < timestamps.length; index += 1)
      if (timestamps[index] <= timestamps[index - 1])
        issues.push({
          code: "frame_order_invalid",
          field: `frames.${index}.capturedAt`,
          message: "Frame timestamps must strictly increase.",
        });
  return { issues, validCount };
};

export const isWebcamCheckOutput = (
  value: unknown,
): value is WebcamCheckOutput =>
  isRecord(value) &&
  typeof value.verdict === "string" &&
  (value.estimatedFps === null ||
    (typeof value.estimatedFps === "number" &&
      Number.isFinite(value.estimatedFps))) &&
  typeof value.frameCount === "number" &&
  Number.isSafeInteger(value.frameCount) &&
  (value.width === null ||
    (typeof value.width === "number" &&
      Number.isSafeInteger(value.width) &&
      value.width > 0)) &&
  (value.height === null ||
    (typeof value.height === "number" &&
      Number.isSafeInteger(value.height) &&
      value.height > 0)) &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateWebcamCheck = (
  input: unknown,
): ToolResult<WebcamCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "deviceCount",
    "frames",
    "permissionState",
    "streamError",
    "surfaceSupported",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawFrames = input.frames;
  if (rawFrames === undefined)
    issues.push({
      code: "frames_required",
      field: "frames",
      message: "frames is required.",
    });
  else if (!Array.isArray(rawFrames))
    issues.push({
      code: "frames_invalid",
      field: "frames",
      message: "frames must be an array of frame objects.",
    });
  else
    issues.push(...frameFieldIssues(rawFrames).issues);

  const permissionState = input.permissionState;
  if (
    permissionState !== undefined &&
    !PERMISSION_STATES.includes(permissionState as never)
  )
    issues.push({
      code: "permission_state_invalid",
      field: "permissionState",
      message: "permissionState must be a supported permission state.",
    });

  const deviceCount = input.deviceCount;
  if (
    deviceCount !== undefined &&
    (!Number.isSafeInteger(deviceCount) || (deviceCount as number) < 0)
  )
    issues.push({
      code: "device_count_invalid",
      field: "deviceCount",
      message: "deviceCount must be a nonnegative integer.",
    });

  const streamError = input.streamError;
  if (
    streamError !== undefined &&
    (typeof streamError !== "string" ||
      streamError.length > 1000)
  )
    issues.push({
      code: "stream_error_invalid",
      field: "streamError",
      message: "streamError must be a short string.",
    });

  const surfaceSupported = input.surfaceSupported;
  if (
    surfaceSupported !== undefined &&
    typeof surfaceSupported !== "boolean"
  )
    issues.push({
      code: "surface_supported_invalid",
      field: "surfaceSupported",
      message: "surfaceSupported must be a boolean.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const frames = rawFrames as readonly WebcamProbeFrame[];
  const resolvedPermissionState =
    (permissionState as WebcamCheckInput["permissionState"]) ?? "unknown";
  const resolvedStreamError = streamError as string | undefined;
  const resolvedSurfaceSupported = surfaceSupported ?? true;

  const dominant = dominantResolution(frames);
  const width = dominant?.width ?? null;
  const height = dominant?.height ?? null;
  const resolutionClass =
    dominant === undefined
      ? null
      : resolutionClassFor(dominant.width, dominant.height);
  const estimatedFps =
    frames.length >= 2 ? 1000 / medianFrameDeltaMs(frames) : null;

  const outputIssues: string[] = [];
  let verdict: WebcamCheckVerdict;
  if (!resolvedSurfaceSupported) {
    verdict = "unsupported-on-surface";
  } else if (
    resolvedStreamError === "NotAllowedError" ||
    resolvedPermissionState === "denied"
  ) {
    verdict = "blocked-by-permission";
  } else if (
    resolvedStreamError === "NotFoundError" ||
    input.deviceCount === 0
  ) {
    verdict = "not-found";
  } else {
    if (resolvedStreamError !== undefined) outputIssues.push("stream-error");
    if (frames.length === 0) outputIssues.push("no-frames-captured");
    if (estimatedFps !== null && estimatedFps < LOW_FPS_THRESHOLD)
      outputIssues.push("low-frame-rate");
    if (
      dominant !== undefined &&
      Math.min(dominant.width, dominant.height) < LOW_RESOLUTION_SHORTER_SIDE
    )
      outputIssues.push("low-resolution");
    verdict = outputIssues.length === 0 ? "working" : "degraded";
  }

  return toolSuccess({
    estimatedFps,
    frameCount: frames.length,
    height,
    issues: outputIssues,
    resolutionClass,
    verdict,
    width,
  });
};

export const webcamCheckTool = defineTool<
  WebcamCheckInput,
  WebcamCheckOutput
>({
  contractVersion: 1,
  description:
    "Diagnose a webcam from a captured frame probe, reporting verdict, frame rate, and resolution.",
  discovery: {
    aliases: ["camera-check", "camera-test", "webcam-check"],
    keywords: ["camera", "devices", "fps", "resolution", "video", "webcam"],
  },
  execute: calculateWebcamCheck,
  execution: { kind: "pure" },
  id: "check/webcam",
  inputSchema: webcamCheckInputSchema,
  outputSchema: webcamCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Captured webcam probe supplied by the running surface.",
        id: "probe",
        label: "Webcam probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/webcam", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall webcam diagnosis.",
        id: "verdict",
        label: "Verdict",
        valueType: { format: "webcam-verdict", type: "string" },
      },
      {
        description: "Estimated frames per second from frame timestamps.",
        id: "estimatedFps",
        label: "Estimated FPS",
        valueType: { format: "frequency", type: "number", unit: "fps" },
      },
      {
        description: "Number of analyzed frames.",
        id: "frameCount",
        label: "Frame count",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Width of the most common frame size.",
        id: "width",
        label: "Width",
        valueType: { format: "pixels", type: "integer", unit: "px" },
      },
      {
        description: "Height of the most common frame size.",
        id: "height",
        label: "Height",
        valueType: { format: "pixels", type: "integer", unit: "px" },
      },
      {
        description: "Classification of the most common frame size.",
        id: "resolutionClass",
        label: "Resolution class",
        valueType: { format: "video-resolution-class", type: "string" },
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
  title: "Webcam Tester",
});

export const runWebcamCheck = webcamCheckTool.execute;
export default webcamCheckTool;
