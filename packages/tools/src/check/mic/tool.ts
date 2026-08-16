import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type MicCheckVerdict =
  | "blocked-by-permission"
  | "degraded"
  | "not-found"
  | "unsupported-on-surface"
  | "working";

/** One analyzed window reported by the acquiring surface, linear amplitude. */
export type MicLevelWindow = {
  /** Peak absolute sample amplitude in [0, 1]. */
  readonly peak: number;
  /** Root mean square amplitude in [0, 1]. */
  readonly rms: number;
};

export type MicCheckInput = {
  /** Analyzed windows in capture order; may be empty when opening failed. */
  readonly levels: readonly MicLevelWindow[];
  readonly permissionState?: "denied" | "granted" | "prompt" | "unknown";
  /** Capture sample rate in hertz, when the surface reports one. */
  readonly sampleRate?: number;
  /** Platform error code from opening the stream, when opening failed. */
  readonly streamError?: string;
  /** False when the current surface cannot capture microphone audio at all. */
  readonly surfaceSupported?: boolean;
};

export type MicCheckOutput = {
  readonly clippedWindows: number;
  readonly levelDbfs: number | null;
  readonly noiseFloorDbfs: number | null;
  readonly peakDbfs: number | null;
  readonly sampleRate: number | null;
  readonly windowCount: number;
  readonly issues: readonly string[];
  readonly verdict: MicCheckVerdict;
};

const toDbfs = (linearAmplitude: number): number =>
  20 * Math.log10(linearAmplitude);

export const micCheckInputSchema = {
  additionalProperties: false,
  properties: {
    levels: {
      description: "Analyzed level windows in capture order.",
      items: {
        additionalProperties: false,
        properties: {
          peak: {
            description: "Peak absolute amplitude in [0, 1].",
            maximum: 1,
            minimum: 0,
            type: "number",
          },
          rms: {
            description: "Root mean square amplitude in [0, 1].",
            maximum: 1,
            minimum: 0,
            type: "number",
          },
        },
        required: ["peak", "rms"],
        type: "object",
      },
      type: "array",
    },
    permissionState: {
      description: "Microphone permission state reported by the surface.",
      enum: ["denied", "granted", "prompt", "unknown"],
      type: "string",
    },
    sampleRate: {
      description: "Capture sample rate in hertz.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    streamError: {
      description:
        "Platform error code from opening the stream, when opening failed.",
      type: "string",
    },
    surfaceSupported: {
      description: "Whether the surface can capture microphone audio at all.",
      type: "boolean",
    },
  },
  required: ["levels"],
  type: "object",
} as const;

export const micCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    clippedWindows: {
      description: "Number of windows whose peak reached the clip threshold.",
      minimum: 0,
      type: "integer",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    levelDbfs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Median RMS level in dBFS, or null without samples.",
    },
    noiseFloorDbfs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Tenth-percentile RMS level in dBFS, or null.",
    },
    peakDbfs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Loudest observed peak in dBFS, or null.",
    },
    sampleRate: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Reported capture sample rate in hertz, or null.",
    },
    verdict: {
      description: "Overall microphone diagnosis.",
      enum: [
        "working",
        "degraded",
        "blocked-by-permission",
        "not-found",
        "unsupported-on-surface",
      ],
      type: "string",
    },
    windowCount: {
      description: "Number of analyzed level windows.",
      minimum: 0,
      type: "integer",
    },
  },
  required: [
    "verdict",
    "windowCount",
    "levelDbfs",
    "peakDbfs",
    "noiseFloorDbfs",
    "clippedWindows",
    "sampleRate",
    "issues",
  ],
  type: "object",
} as const;

export const micCheckExample = {
  input: {
    levels: [
      { peak: 0.02, rms: 0.01 },
      { peak: 0.5, rms: 0.25 },
      { peak: 0.5, rms: 0.25 },
      { peak: 0.5, rms: 0.25 },
      { peak: 0.5, rms: 0.25 },
      { peak: 0.5, rms: 0.25 },
    ],
    permissionState: "granted",
    sampleRate: 48000,
  },
  output: {
    clippedWindows: 0,
    issues: [],
    levelDbfs: -12.041199826559248,
    noiseFloorDbfs: -40,
    peakDbfs: -6.020599913279624,
    sampleRate: 48000,
    verdict: "working",
    windowCount: 6,
  },
} satisfies ToolExample<MicCheckInput, MicCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const PERMISSION_STATES = ["denied", "granted", "prompt", "unknown"] as const;

/** Peaks at or above this linear amplitude count as clipped. */
const CLIP_PEAK_THRESHOLD = 0.99;
/** Median levels below this dBFS count as silent. */
const SILENCE_DBFS = -60;
/** Median levels below this dBFS are reported as low-level. */
const LOW_LEVEL_DBFS = -35;
/** Noise floors above this dBFS are reported as high-noise-floor. */
const HIGH_NOISE_FLOOR_DBFS = -38;

const nearestPercentile = (
  sortedValues: readonly number[],
  percentile: number,
): number => {
  const rank = Math.max(
    1,
    Math.ceil((percentile / 100) * sortedValues.length),
  );
  return sortedValues[rank - 1];
};

const medianOf = (sortedValues: readonly number[]): number => {
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 1
    ? sortedValues[middle]
    : (sortedValues[middle - 1] + sortedValues[middle]) / 2;
};

const levelIssues = (
  levels: readonly unknown[],
): readonly ToolIssue[] => {
  const limitIssue = resourceLimitIssue("samples", levels.length, "levels");
  return limitIssue ? [limitIssue] : [];
};

export const isMicCheckOutput = (value: unknown): value is MicCheckOutput =>
  isRecord(value) &&
  typeof value.verdict === "string" &&
  Number.isSafeInteger(value.windowCount) &&
  Number.isSafeInteger(value.clippedWindows) &&
  (value.levelDbfs === null ||
    (typeof value.levelDbfs === "number" &&
      Number.isFinite(value.levelDbfs))) &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateMicCheck = (
  input: unknown,
): ToolResult<MicCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "levels",
    "permissionState",
    "sampleRate",
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

  const rawLevels = input.levels;
  if (rawLevels === undefined)
    issues.push({
      code: "levels_required",
      field: "levels",
      message: "levels is required.",
    });
  else if (!Array.isArray(rawLevels))
    issues.push({
      code: "levels_invalid",
      field: "levels",
      message: "levels must be an array of level windows.",
    });
  else {
    issues.push(...levelIssues(rawLevels));
    if (issues.length === 0)
      rawLevels.forEach((entry, index) => {
        if (!isRecord(entry)) {
          issues.push({
            code: "level_window_required",
            field: `levels.${index}`,
            message: `levels.${index} must be an object.`,
          });
          return;
        }
        for (const key of Object.keys(entry))
          if (key !== "peak" && key !== "rms")
            issues.push({
              code: "unknown_field",
              field: `levels.${index}.${key}`,
              message: `${key} is not a supported level field.`,
            });
        const { peak, rms } = entry;
        const validPeak =
          typeof peak === "number" &&
          Number.isFinite(peak) &&
          peak >= 0 &&
          peak <= 1;
        const validRms =
          typeof rms === "number" &&
          Number.isFinite(rms) &&
          rms >= 0 &&
          rms <= 1;
        if (!validRms)
          issues.push({
            code: "level_rms_invalid",
            field: `levels.${index}.rms`,
            message: `levels.${index}.rms must be a finite number in [0, 1].`,
          });
        if (!validPeak)
          issues.push({
            code: "level_peak_invalid",
            field: `levels.${index}.peak`,
            message: `levels.${index}.peak must be a finite number in [0, 1].`,
          });
        if (validRms && validPeak && (rms as number) > (peak as number))
          issues.push({
            code: "rms_exceeds_peak",
            field: `levels.${index}.rms`,
            message: `levels.${index}.rms cannot exceed its peak.`,
          });
      });
  }

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

  const sampleRate = input.sampleRate;
  if (
    sampleRate !== undefined &&
    (!Number.isSafeInteger(sampleRate) || (sampleRate as number) <= 0)
  )
    issues.push({
      code: "sample_rate_invalid",
      field: "sampleRate",
      message: "sampleRate must be a positive integer.",
    });

  const streamError = input.streamError;
  if (
    streamError !== undefined &&
    (typeof streamError !== "string" || streamError.length > 1000)
  )
    issues.push({
      code: "stream_error_invalid",
      field: "streamError",
      message: "streamError must be a short string.",
    });

  const surfaceSupported = input.surfaceSupported;
  if (surfaceSupported !== undefined && typeof surfaceSupported !== "boolean")
    issues.push({
      code: "surface_supported_invalid",
      field: "surfaceSupported",
      message: "surfaceSupported must be a boolean.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const levels = rawLevels as readonly MicLevelWindow[];
  const resolvedPermissionState =
    (permissionState as MicCheckInput["permissionState"]) ?? "unknown";
  const resolvedStreamError = streamError as string | undefined;
  const resolvedSurfaceSupported = surfaceSupported ?? true;

  const rmsSorted = levels
    .map((window) => window.rms)
    .sort((left, right) => left - right);
  const peaks = levels.map((window) => window.peak);
  const clippedWindows = peaks.filter(
    (peak) => peak >= CLIP_PEAK_THRESHOLD,
  ).length;
  const medianRms =
    rmsSorted.length === 0 ? null : medianOf(rmsSorted);
  const levelDbfs =
    medianRms === null || medianRms === 0 ? null : toDbfs(medianRms);
  const loudestPeak =
    peaks.length === 0
      ? null
      : peaks.reduce((best, peak) => (peak > best ? peak : best), 0);
  const peakDbfs =
    loudestPeak === null || loudestPeak === 0
      ? null
      : toDbfs(loudestPeak);
  const noiseFloorDbfs =
    rmsSorted.length === 0 || rmsSorted[0] === 0
      ? null
      : toDbfs(nearestPercentile(rmsSorted, 10));

  const outputIssues: string[] = [];
  let verdict: MicCheckVerdict;
  if (!resolvedSurfaceSupported) {
    verdict = "unsupported-on-surface";
  } else if (
    resolvedStreamError === "NotAllowedError" ||
    resolvedPermissionState === "denied"
  ) {
    verdict = "blocked-by-permission";
  } else if (resolvedStreamError === "NotFoundError") {
    verdict = "not-found";
  } else {
    if (resolvedStreamError !== undefined) outputIssues.push("stream-error");
    if (levels.length === 0) outputIssues.push("no-samples-captured");
    if (clippedWindows > 0) outputIssues.push("clipping");
    if (
      levels.length > 0 &&
      (levelDbfs === null || levelDbfs <= SILENCE_DBFS)
    )
      outputIssues.push("silent");
    else if (levelDbfs !== null && levelDbfs < LOW_LEVEL_DBFS)
      outputIssues.push("low-level");
    if (
      noiseFloorDbfs !== null &&
      noiseFloorDbfs > HIGH_NOISE_FLOOR_DBFS &&
      levelDbfs !== null
    )
      outputIssues.push("high-noise-floor");
    verdict = outputIssues.length === 0 ? "working" : "degraded";
  }

  return toolSuccess({
    clippedWindows,
    issues: outputIssues,
    levelDbfs,
    noiseFloorDbfs,
    peakDbfs,
    sampleRate:
      sampleRate === undefined ? null : (sampleRate as number),
    verdict,
    windowCount: levels.length,
  });
};

export const micCheckTool = defineTool<MicCheckInput, MicCheckOutput>({
  contractVersion: 1,
  description:
    "Diagnose a microphone from captured level windows, reporting verdict, loudness, and noise floor.",
  discovery: {
    aliases: ["microphone-check", "microphone-test", "mic-test"],
    keywords: ["audio", "input", "microphone", "noise"],
  },
  execute: calculateMicCheck,
  execution: { kind: "pure" },
  id: "check/mic",
  inputSchema: micCheckInputSchema,
  outputSchema: micCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Captured microphone probe supplied by the surface.",
        id: "probe",
        label: "Microphone probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/microphone", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall microphone diagnosis.",
        id: "verdict",
        label: "Verdict",
        valueType: { format: "microphone-verdict", type: "string" },
      },
      {
        description: "Number of analyzed level windows.",
        id: "windowCount",
        label: "Window count",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Median RMS level in decibels relative to full scale.",
        id: "levelDbfs",
        label: "Level",
        valueType: { format: "audio-level", type: "number", unit: "dBFS" },
      },
      {
        description: "Loudest observed peak in dBFS.",
        id: "peakDbfs",
        label: "Peak",
        valueType: { format: "audio-level", type: "number", unit: "dBFS" },
      },
      {
        description: "Background noise estimate in dBFS.",
        id: "noiseFloorDbfs",
        label: "Noise floor",
        valueType: { format: "audio-level", type: "number", unit: "dBFS" },
      },
      {
        description: "Windows that reached the clipping threshold.",
        id: "clippedWindows",
        label: "Clipped windows",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Capture sample rate in hertz.",
        id: "sampleRate",
        label: "Sample rate",
        valueType: { format: "frequency", type: "integer", unit: "Hz" },
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
  title: "Microphone Tester",
});

export const runMicCheck = micCheckTool.execute;
export default micCheckTool;
