import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { medianFromSorted } from "../../core/stats.js";

export type ClockOffsetSkew = "major-skew" | "minor-skew" | "synced";

export type ClockSamplePair = {
  readonly deviceTimeMs: number;
  readonly referenceTimeMs: number;
};

export type ClockOffsetInput = {
  readonly samples: readonly ClockSamplePair[];
};

export type ClockOffsetOutput = {
  readonly issues: readonly string[];
  readonly offsetMs: number | null;
  readonly sampleCount: number;
  readonly spreadMs: number | null;
  readonly skew: ClockOffsetSkew;
};

export const clockOffsetInputSchema = {
  additionalProperties: false,
  properties: {
    samples: {
      description:
        "Paired device and reference timestamps captured together.",
      items: {
        additionalProperties: false,
        properties: {
          deviceTimeMs: {
            description: "Surface-reported epoch milliseconds.",
            minimum: 0,
            type: "integer",
          },
          referenceTimeMs: {
            description: "Trusted-source epoch milliseconds.",
            minimum: 0,
            type: "integer",
          },
        },
        required: ["deviceTimeMs", "referenceTimeMs"],
        type: "object",
      },
      minItems: 1,
      type: "array",
    },
  },
  required: ["samples"],
  type: "object",
} as const;

export const clockOffsetOutputSchema = {
  additionalProperties: false,
  properties: {
    issues: {
      description: "Stable machine-facing warning codes.",
      items: { type: "string" },
      type: "array",
    },
    offsetMs: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Median device-minus-reference offset in milliseconds.",
    },
    sampleCount: {
      description: "Number of paired samples analyzed.",
      minimum: 0,
      type: "integer",
    },
    spreadMs: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "number" }],
      description: "Range of offsets, or null below two samples.",
    },
    skew: {
      description: "Overall synchronization classification.",
      enum: ["major-skew", "minor-skew", "synced"],
      type: "string",
    },
  },
  required: ["skew", "offsetMs", "spreadMs", "sampleCount", "issues"],
  type: "object",
} as const;

export const clockOffsetExample = {
  input: {
    samples: [
      { deviceTimeMs: 1000, referenceTimeMs: 1000 },
      { deviceTimeMs: 1950, referenceTimeMs: 2000 },
      { deviceTimeMs: 3050, referenceTimeMs: 3000 },
      { deviceTimeMs: 3975, referenceTimeMs: 4000 },
    ],
  },
  output: {
    issues: [],
    offsetMs: -12.5,
    sampleCount: 4,
    skew: "synced",
    spreadMs: 100,
  },
} satisfies ToolExample<ClockOffsetInput, ClockOffsetOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Offsets at or under this many milliseconds count as synced. */
const SYNCED_MS = 1000;
/** Offsets above this many milliseconds count as major skew. */
const MAJOR_SKEW_MS = 60_000;

export const isClockOffsetOutput = (
  value: unknown,
): value is ClockOffsetOutput =>
  isRecord(value) &&
  typeof value.skew === "string" &&
  Number.isSafeInteger(value.sampleCount);

export const calculateClockOffset = (
  input: unknown,
): ToolResult<ClockOffsetOutput> => {
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
    if (field !== "samples")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawSamples = input.samples;
  let samples: readonly ClockSamplePair[] = [];
  if (rawSamples === undefined)
    return invalidInput([
      ...issues,
      {
        code: "samples_required",
        field: "samples",
        message: "samples is required.",
      },
    ]);
  if (!Array.isArray(rawSamples))
    return invalidInput([
      ...issues,
      {
        code: "samples_invalid",
        field: "samples",
        message: "samples must be an array of paired timestamps.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "samples",
    rawSamples.length,
    "samples",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  rawSamples.forEach((entry, index) => {
    if (!isRecord(entry)) {
      issues.push({
        code: "sample_required",
        field: `samples.${index}`,
        message: `samples.${index} must be an object.`,
      });
      return;
    }
    for (const key of Object.keys(entry))
      if (key !== "deviceTimeMs" && key !== "referenceTimeMs")
        issues.push({
          code: "unknown_field",
          field: `samples.${index}.${key}`,
          message: `${key} is not a supported sample field.`,
        });
    for (const key of ["deviceTimeMs", "referenceTimeMs"] as const) {
      const value = entry[key];
      if (
        !Number.isSafeInteger(value) ||
        (value as number) < 0
      )
        issues.push({
          code: `${key}_invalid`,
          field: `samples.${index}.${key}`,
          message: `${key} must be a nonnegative safe integer.`,
        });
    }
  });
  if (issues.length > 0) return invalidInput(issues);
  samples = rawSamples as readonly ClockSamplePair[];

  const offsets = samples
    .map((pair) => pair.deviceTimeMs - pair.referenceTimeMs)
    .sort((left, right) => left - right);
  const offsetMs =
    offsets.length === 0 ? null : medianFromSorted(offsets);
  const spreadMs =
    offsets.length < 2
      ? null
      : offsets[offsets.length - 1] - offsets[0];
  const magnitude =
    offsetMs === null ? null : Math.abs(offsetMs);
  const outputIssues: string[] = [];
  let skew: ClockOffsetSkew;
  if (magnitude === null || magnitude <= SYNCED_MS) skew = "synced";
  else if (magnitude <= MAJOR_SKEW_MS) {
    skew = "minor-skew";
    outputIssues.push("clock-drift");
  } else {
    skew = "major-skew";
    outputIssues.push("clock-skewed");
  }

  return toolSuccess({
    issues: outputIssues,
    offsetMs,
    sampleCount: samples.length,
    spreadMs,
    skew,
  });
};

export const clockOffsetTool = defineTool<ClockOffsetInput, ClockOffsetOutput>({
  contractVersion: 1,
  description:
    "Estimate device clock offset and drift from paired device and reference timestamps.",
  discovery: {
    aliases: ["clock-drift-check", "time-sync-check"],
    keywords: ["clock", "drift", "ntp", "sync", "time"],
  },
  execute: calculateClockOffset,
  execution: { kind: "pure" },
  id: "check/clock-offset",
  inputSchema: clockOffsetInputSchema,
  outputSchema: clockOffsetOutputSchema,
  ports: {
    inputs: [
      {
        description: "Paired timestamp probe from the surface.",
        id: "probe",
        label: "Clock probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/clock", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall synchronization classification.",
        id: "skew",
        label: "Skew",
        valueType: { format: "clock-skew", type: "string" },
      },
      {
        description: "Median device-minus-reference offset.",
        id: "offsetMs",
        label: "Offset",
        valueType: { format: "duration", type: "number", unit: "ms" },
      },
      {
        description: "Range of observed offsets.",
        id: "spreadMs",
        label: "Spread",
        valueType: { format: "duration", type: "number", unit: "ms" },
      },
      {
        description: "Number of paired samples analyzed.",
        id: "sampleCount",
        label: "Samples",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Stable machine-facing warning codes.",
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
  title: "Clock Offset Checker",
});

export const runClockOffsetCheck = clockOffsetTool.execute;
export default clockOffsetTool;
