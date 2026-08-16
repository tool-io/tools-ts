import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NetworkQualityTier =
  | "excellent"
  | "good"
  | "poor"
  | "unknown"
  | "unstable";

export type NetworkQualityInput = {
  /** Successful round-trip latency samples in milliseconds, in order. */
  readonly attempts?: number;
  readonly downloadBytesPerSecond?: number;
  readonly latencyMs: readonly number[];
  readonly uploadBytesPerSecond?: number;
};

export type NetworkQualityOutput = {
  readonly downloadMbps: number | null;
  readonly issues: readonly string[];
  readonly jitterMs: number | null;
  readonly lossPercent: number | null;
  readonly maxLatencyMs: number | null;
  readonly medianLatencyMs: number | null;
  readonly minLatencyMs: number | null;
  readonly sampleCount: number;
  readonly tier: NetworkQualityTier;
  readonly uploadMbps: number | null;
};

export const networkQualityInputSchema = {
  additionalProperties: false,
  properties: {
    attempts: {
      description:
        "Total probes attempted, including failures, for loss estimation.",
      minimum: 0,
      type: "integer",
    },
    downloadBytesPerSecond: {
      description: "Measured download throughput in bytes per second.",
      exclusiveMinimum: 0,
      type: "number",
    },
    latencyMs: {
      description: "Successful round-trip latency samples in milliseconds.",
      items: { exclusiveMinimum: 0, type: "number" },
      type: "array",
    },
    uploadBytesPerSecond: {
      description: "Measured upload throughput in bytes per second.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["latencyMs"],
  type: "object",
} as const;

export const networkQualityOutputSchema = {
  additionalProperties: false,
  properties: {
    downloadMbps: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Download throughput in megabits per second.",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    jitterMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description:
        "Mean absolute consecutive latency difference, or null below two samples.",
    },
    lossPercent: {
      anyOf: [{ type: "null" }, { maximum: 100, minimum: 0, type: "number" }],
      description: "Estimated packet loss percentage, or null without attempts.",
    },
    maxLatencyMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Slowest observed round trip.",
    },
    medianLatencyMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Median round trip in milliseconds.",
    },
    minLatencyMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Fastest observed round trip.",
    },
    sampleCount: {
      description: "Number of successful latency samples.",
      minimum: 0,
      type: "integer",
    },
    tier: {
      description: "Overall connection quality classification.",
      enum: ["excellent", "good", "poor", "unknown", "unstable"],
      type: "string",
    },
    uploadMbps: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Upload throughput in megabits per second.",
    },
  },
  required: [
    "sampleCount",
    "minLatencyMs",
    "medianLatencyMs",
    "maxLatencyMs",
    "jitterMs",
    "lossPercent",
    "downloadMbps",
    "uploadMbps",
    "tier",
    "issues",
  ],
  type: "object",
} as const;

export const networkQualityExample = {
  input: {
    downloadBytesPerSecond: 12500000,
    latencyMs: [12, 15, 12, 18, 12],
  },
  output: {
    downloadMbps: 100,
    issues: [],
    jitterMs: 4.5,
    lossPercent: null,
    maxLatencyMs: 18,
    medianLatencyMs: 12,
    minLatencyMs: 12,
    sampleCount: 5,
    tier: "excellent",
    uploadMbps: null,
  },
} satisfies ToolExample<NetworkQualityInput, NetworkQualityOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Jitter at or above this many milliseconds marks a connection unstable. */
const UNSTABLE_JITTER_MS = 150;
/** Median latency at or above this many milliseconds marks high latency. */
const HIGH_LATENCY_MS = 400;
/** Loss percent thresholds for instability and packet-loss reporting. */
const UNSTABLE_LOSS_PERCENT = 5;
const REPORTED_LOSS_PERCENT = 1;

const toMbps = (bytesPerSecond: number): number =>
  (bytesPerSecond * 8) / 1_000_000;

const meanOf = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const percentile = (
  sortedValues: readonly number[],
  p: number,
): number => {
  const rank = Math.max(1, Math.ceil((p / 100) * sortedValues.length));
  return sortedValues[rank - 1];
};

export const isNetworkQualityOutput = (
  value: unknown,
): value is NetworkQualityOutput =>
  isRecord(value) &&
  typeof value.tier === "string" &&
  Number.isSafeInteger(value.sampleCount) &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateNetworkQuality = (
  input: unknown,
): ToolResult<NetworkQualityOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "attempts",
    "downloadBytesPerSecond",
    "latencyMs",
    "uploadBytesPerSecond",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawLatencies = input.latencyMs;
  let latencies: readonly number[] = [];
  if (rawLatencies === undefined)
    issues.push({
      code: "latency_ms_required",
      field: "latencyMs",
      message: "latencyMs is required.",
    });
  else if (!Array.isArray(rawLatencies))
    issues.push({
      code: "latency_ms_invalid",
      field: "latencyMs",
      message: "latencyMs must be an array of positive numbers.",
    });
  else {
    const limitIssue = resourceLimitIssue(
      "samples",
      rawLatencies.length,
      "latencyMs",
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
            field: `latencyMs.${index}`,
            message: `latencyMs.${index} must be a positive finite number.`,
          });
      });
    latencies = rawLatencies as readonly number[];
  }

  const attempts = input.attempts;
  if (
    attempts !== undefined &&
    (!Number.isSafeInteger(attempts) || (attempts as number) < 0)
  )
    issues.push({
      code: "attempts_invalid",
      field: "attempts",
      message: "attempts must be a nonnegative integer.",
    });
  else if (
    attempts !== undefined &&
    Array.isArray(rawLatencies) &&
    (attempts as number) < rawLatencies.length
  )
    issues.push({
      code: "attempts_below_samples",
      field: "attempts",
      message: "attempts cannot be fewer than successful samples.",
    });

  const throughputs = [
    ["downloadBytesPerSecond", "download_bytes_invalid"],
    ["uploadBytesPerSecond", "upload_bytes_invalid"],
  ] as const;
  for (const [field, invalidCode] of throughputs) {
    const value = input[field];
    if (
      value !== undefined &&
      (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    )
      issues.push({
        code: invalidCode,
        field,
        message: `${field} must be a positive finite number.`,
      });
  }

  if (issues.length > 0) return invalidInput(issues);

  const resolvedAttempts = attempts as number | undefined;
  const download =
    input.downloadBytesPerSecond === undefined
      ? null
      : toMbps(input.downloadBytesPerSecond as number);
  const upload =
    input.uploadBytesPerSecond === undefined
      ? null
      : toMbps(input.uploadBytesPerSecond as number);

  const sorted = [...latencies].sort((left, right) => left - right);
  const sampleCount = latencies.length;
  const median =
    sampleCount === 0 ? null : percentile(sorted, 50);
  const jitter =
    sampleCount < 2
      ? null
      : meanOf(
          latencies
            .slice(1)
            .map((value, index) => Math.abs(value - latencies[index])),
        );
  const lossPercent =
    resolvedAttempts === undefined
      ? null
      : ((resolvedAttempts - sampleCount) / resolvedAttempts) * 100;

  const outputIssues: string[] = [];
  let tier: NetworkQualityTier = "unknown";
  if (sampleCount === 0) {
    outputIssues.push("no-samples-captured");
  } else {
    const effectiveJitter = jitter ?? 0;
    const effectiveLoss = lossPercent ?? 0;
    if (effectiveLoss >= UNSTABLE_LOSS_PERCENT || effectiveJitter >= UNSTABLE_JITTER_MS)
      tier = "unstable";
    else if (
      (median as number) < 100 &&
      effectiveJitter < 30 &&
      effectiveLoss < REPORTED_LOSS_PERCENT
    )
      tier = "excellent";
    else if ((median as number) < 300 && effectiveJitter < 80) tier = "good";
    else tier = "poor";

    if ((median as number) >= HIGH_LATENCY_MS)
      outputIssues.push("high-latency");
    if (jitter !== null && jitter >= 80) outputIssues.push("high-jitter");
    if (lossPercent !== null && lossPercent >= REPORTED_LOSS_PERCENT)
      outputIssues.push("packet-loss");
    if (download !== null && download < 10) outputIssues.push("slow-download");
    if (upload !== null && upload < 2) outputIssues.push("slow-upload");
  }

  return toolSuccess({
    downloadMbps: download,
    issues: outputIssues,
    jitterMs: jitter,
    lossPercent,
    maxLatencyMs: sampleCount === 0 ? null : sorted[sampleCount - 1],
    medianLatencyMs: median,
    minLatencyMs: sampleCount === 0 ? null : sorted[0],
    sampleCount,
    tier,
    uploadMbps: upload,
  });
};

export const networkQualityTool = defineTool<
  NetworkQualityInput,
  NetworkQualityOutput
>({
  contractVersion: 1,
  description:
    "Grade a connection from latency samples and optional throughput measurements.",
  discovery: {
    aliases: ["internet-speed-check", "ping-check", "connection-check"],
    keywords: ["jitter", "latency", "network", "speed"],
  },
  execute: calculateNetworkQuality,
  execution: { kind: "pure" },
  id: "check/network-quality",
  inputSchema: networkQualityInputSchema,
  outputSchema: networkQualityOutputSchema,
  ports: {
    inputs: [
      {
        description: "Network measurement probe supplied by the surface.",
        id: "probe",
        label: "Network probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/network", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall connection quality classification.",
        id: "tier",
        label: "Quality tier",
        valueType: { format: "network-tier", type: "string" },
      },
      {
        description: "Number of successful latency samples.",
        id: "sampleCount",
        label: "Sample count",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Median round trip in milliseconds.",
        id: "medianLatencyMs",
        label: "Median latency",
        valueType: { format: "duration", type: "number", unit: "ms" },
      },
      {
        description: "Mean absolute consecutive latency difference.",
        id: "jitterMs",
        label: "Jitter",
        valueType: { format: "duration", type: "number", unit: "ms" },
      },
      {
        description: "Estimated packet loss percentage.",
        id: "lossPercent",
        label: "Loss",
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Download throughput in megabits per second.",
        id: "downloadMbps",
        label: "Downstream",
        valueType: {
          format: "transfer-rate",
          type: "number",
          unit: "Mbit/s",
        },
      },
      {
        description: "Upload throughput in megabits per second.",
        id: "uploadMbps",
        label: "Upstream",
        valueType: {
          format: "transfer-rate",
          type: "number",
          unit: "Mbit/s",
        },
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
  title: "Network Quality Checker",
});

export const runNetworkQualityCheck = networkQualityTool.execute;
export default networkQualityTool;
