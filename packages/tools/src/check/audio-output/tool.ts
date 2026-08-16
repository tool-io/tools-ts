import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AudioOutputVerdict =
  | "degraded"
  | "unsupported-on-surface"
  | "working";

export type ChannelLayout =
  | "mono"
  | "multichannel"
  | "stereo"
  | "surround-5-1"
  | "surround-7-1";

export type AudioOutputCheckInput = {
  readonly channelCount?: number;
  readonly latencySamplesMs?: readonly number[];
  readonly sampleRate?: number;
  /** Platform error code from opening the output stream. */
  readonly streamError?: string;
  /** False when the current surface cannot play audio at all. */
  readonly surfaceSupported?: boolean;
  readonly underruns?: number;
};

export type AudioOutputCheckOutput = {
  readonly channelCount: number | null;
  readonly channelLayout: ChannelLayout | null;
  readonly issues: readonly string[];
  readonly medianLatencyMs: number | null;
  readonly sampleRate: number | null;
  readonly underruns: number | null;
  readonly verdict: AudioOutputVerdict;
};

const channelLayoutFor = (count: number): ChannelLayout => {
  if (count === 1) return "mono";
  if (count === 2) return "stereo";
  if (count >= 3 && count <= 6) return "surround-5-1";
  if (count >= 7 && count <= 8) return "surround-7-1";
  return "multichannel";
};

/** Sample rates outside this range are reported as unusual. */
const MIN_SAMPLE_RATE = 8000;
const MAX_SAMPLE_RATE = 192000;
/** Median latency above this many milliseconds is reported as high. */
const HIGH_LATENCY_MS = 500;

export const audioOutputCheckInputSchema = {
  additionalProperties: false,
  properties: {
    channelCount: {
      description: "Configured output channel count.",
      minimum: 1,
      type: "integer",
    },
    latencySamplesMs: {
      description: "Observed output latency samples in milliseconds.",
      items: { exclusiveMinimum: 0, type: "number" },
      type: "array",
    },
    sampleRate: {
      description: "Output stream sample rate in hertz.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    streamError: {
      description:
        "Platform error code from opening the stream, when opening failed.",
      type: "string",
    },
    surfaceSupported: {
      description: "Whether the surface can play audio at all.",
      type: "boolean",
    },
    underruns: {
      description: "Number of buffer underrun events observed.",
      minimum: 0,
      type: "integer",
    },
  },
  type: "object",
} as const;

export const audioOutputCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    channelCount: {
      anyOf: [{ type: "null" }, { minimum: 1, type: "integer" }],
      description: "Configured output channel count.",
    },
    channelLayout: {
      anyOf: [
        { type: "null" },
        {
          enum: ["mono", "multichannel", "stereo", "surround-5-1", "surround-7-1"],
          type: "string",
        },
      ],
      description: "Named layout for the channel count.",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    medianLatencyMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Median observed output latency in milliseconds.",
    },
    sampleRate: {
      anyOf: [{ type: "null" }, { type: "integer" }],
      description: "Output stream sample rate in hertz.",
    },
    underruns: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "integer" }],
      description: "Number of observed buffer underrun events.",
    },
    verdict: {
      description: "Overall audio playback diagnosis.",
      enum: ["working", "degraded", "unsupported-on-surface"],
      type: "string",
    },
  },
  required: [
    "verdict",
    "sampleRate",
    "channelCount",
    "channelLayout",
    "medianLatencyMs",
    "underruns",
    "issues",
  ],
  type: "object",
} as const;

export const audioOutputCheckExample = {
  input: {
    channelCount: 2,
    latencySamplesMs: [6, 6.5, 5.5],
    sampleRate: 48000,
    underruns: 0,
  },
  output: {
    channelCount: 2,
    channelLayout: "stereo",
    issues: [],
    medianLatencyMs: 6,
    sampleRate: 48000,
    underruns: 0,
    verdict: "working",
  },
} satisfies ToolExample<AudioOutputCheckInput, AudioOutputCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const medianOf = (sortedValues: readonly number[]): number => {
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 1
    ? sortedValues[middle]
    : (sortedValues[middle - 1] + sortedValues[middle]) / 2;
};

export const isAudioOutputCheckOutput = (
  value: unknown,
): value is AudioOutputCheckOutput =>
  isRecord(value) &&
  typeof value.verdict === "string" &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateAudioOutputCheck = (
  input: unknown,
): ToolResult<AudioOutputCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "channelCount",
    "latencySamplesMs",
    "sampleRate",
    "streamError",
    "surfaceSupported",
    "underruns",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawLatencies = input.latencySamplesMs;
  let latencies: readonly number[] = [];
  if (rawLatencies !== undefined) {
    if (!Array.isArray(rawLatencies))
      issues.push({
        code: "latency_samples_invalid",
        field: "latencySamplesMs",
        message: "latencySamplesMs must be an array of positive numbers.",
      });
    else {
      const limitIssue = resourceLimitIssue(
        "samples",
        rawLatencies.length,
        "latencySamplesMs",
      );
      if (limitIssue) issues.push(limitIssue);
      else
        rawLatencies.forEach((entry, index) => {
          if (
            typeof entry !== "number" ||
            !Number.isFinite(entry) ||
            entry <= 0
          )
            issues.push({
              code: "latency_sample_invalid",
              field: `latencySamplesMs.${index}`,
              message: `latencySamplesMs.${index} must be a positive finite number.`,
            });
        });
      if (Array.isArray(rawLatencies)) latencies = rawLatencies as readonly number[];
    }
  }

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

  const channelCount = input.channelCount;
  if (
    channelCount !== undefined &&
    (!Number.isSafeInteger(channelCount) || (channelCount as number) < 1)
  )
    issues.push({
      code: "channel_count_invalid",
      field: "channelCount",
      message: "channelCount must be a positive integer.",
    });

  const underruns = input.underruns;
  if (
    underruns !== undefined &&
    (!Number.isSafeInteger(underruns) || (underruns as number) < 0)
  )
    issues.push({
      code: "underruns_invalid",
      field: "underruns",
      message: "underruns must be a nonnegative integer.",
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

  const hasProbeData =
    sampleRate !== undefined ||
    channelCount !== undefined ||
    input.latencySamplesMs !== undefined ||
    underruns !== undefined;

  const resolvedSampleRate =
    sampleRate === undefined ? null : (sampleRate as number);
  const resolvedChannelCount =
    channelCount === undefined ? null : (channelCount as number);
  const medianLatency =
    latencies.length === 0
      ? null
      : medianOf([...latencies].sort((left, right) => left - right));

  const outputIssues: string[] = [];
  let verdict: AudioOutputVerdict;
  if (surfaceSupported === false) {
    verdict = "unsupported-on-surface";
  } else {
    if (
      typeof streamError === "string" &&
      streamError.length > 0
    )
      outputIssues.push("stream-error");
    if (!hasProbeData && outputIssues.length === 0)
      outputIssues.push("no-probe-data");
    if ((underruns as number | undefined) !== undefined && (underruns as number) > 0)
      outputIssues.push("audio-underruns");
    if (medianLatency !== null && medianLatency > HIGH_LATENCY_MS)
      outputIssues.push("high-latency");
    if (
      resolvedSampleRate !== null &&
      (resolvedSampleRate < MIN_SAMPLE_RATE ||
        resolvedSampleRate > MAX_SAMPLE_RATE)
    )
      outputIssues.push("unusual-sample-rate");
    verdict = outputIssues.length === 0 ? "working" : "degraded";
  }

  return toolSuccess({
    channelCount: resolvedChannelCount,
    channelLayout:
      resolvedChannelCount === null
        ? null
        : channelLayoutFor(resolvedChannelCount),
    issues: outputIssues,
    medianLatencyMs: medianLatency,
    sampleRate: resolvedSampleRate,
    underruns: underruns === undefined ? null : (underruns as number),
    verdict,
  });
};

export const audioOutputCheckTool = defineTool<
  AudioOutputCheckInput,
  AudioOutputCheckOutput
>({
  contractVersion: 1,
  description:
    "Diagnose audio playback from an output probe covering rate, channels, latency, and underruns.",
  discovery: {
    aliases: ["audio-check", "speaker-check", "sound-check"],
    keywords: ["audio", "output", "playback", "speakers"],
  },
  execute: calculateAudioOutputCheck,
  execution: { kind: "pure" },
  id: "check/audio-output",
  inputSchema: audioOutputCheckInputSchema,
  outputSchema: audioOutputCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Audio output probe supplied by the surface.",
        id: "probe",
        label: "Audio output probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/audio-output", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall audio playback diagnosis.",
        id: "verdict",
        label: "Verdict",
        valueType: { format: "audio-output-verdict", type: "string" },
      },
      {
        description: "Output stream sample rate in hertz.",
        id: "sampleRate",
        label: "Sample rate",
        valueType: { format: "frequency", type: "integer", unit: "Hz" },
      },
      {
        description: "Named layout for the channel count.",
        id: "channelLayout",
        label: "Channel layout",
        valueType: { format: "audio-channel-layout", type: "string" },
      },
      {
        description: "Median observed output latency in milliseconds.",
        id: "medianLatencyMs",
        label: "Latency",
        valueType: { format: "duration", type: "number", unit: "ms" },
      },
      {
        description: "Number of observed buffer underrun events.",
        id: "underruns",
        label: "Underruns",
        valueType: { format: "count", type: "integer" },
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
  title: "Audio Output Tester",
});

export const runAudioOutputCheck = audioOutputCheckTool.execute;
export default audioOutputCheckTool;
