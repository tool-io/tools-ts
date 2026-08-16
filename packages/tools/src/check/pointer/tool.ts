import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import {
  matchCandidate,
  medianFromSorted,
} from "../../core/stats.js";

export type PointerCheckVerdict =
  | "degraded"
  | "irregular"
  | "no-data"
  | "working";

export type PointerCheckInput = {
  /** Reported pressed-button bitmask, when known. */
  readonly buttons?: number;
  readonly maxTouchPoints?: number;
  /** Pointer-move event timestamps in milliseconds, strictly increasing. */
  readonly moveTimestampsMs: readonly number[];
};

export type PointerCheckOutput = {
  readonly buttonCount: number | null;
  readonly issues: readonly string[];
  readonly maxTouchPoints: number | null;
  readonly pollingClass: string | null;
  readonly pollingHertz: number | null;
  readonly sampleCount: number;
  readonly verdict: PointerCheckVerdict;
};

const POLLING_CANDIDATES = [125, 250, 500, 1000, 2000, 4000, 8000] as const;

export const pointerCheckInputSchema = {
  additionalProperties: false,
  properties: {
    buttons: {
      description: "Pressed-button bitmask reported by the surface.",
      maximum: 65535,
      minimum: 0,
      type: "integer",
    },
    maxTouchPoints: {
      description: "Maximum simultaneous touch points supported.",
      minimum: 0,
      type: "integer",
    },
    moveTimestampsMs: {
      description: "Strictly increasing move-event timestamps in ms.",
      items: { minimum: 0, type: "number" },
      type: "array",
    },
  },
  required: ["moveTimestampsMs"],
  type: "object",
} as const;

export const pointerCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    buttonCount: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "integer" }],
      description: "Number of set bits in the buttons bitmask.",
    },
    issues: {
      description: "Stable machine-facing degradation codes.",
      items: { type: "string" },
      type: "array",
    },
    maxTouchPoints: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "integer" }],
      description: "Reported maximum touch points.",
    },
    pollingClass: {
      anyOf: [
        { type: "null" },
        {
          enum: [
            "125", "250", "500", "1000", "2000", "4000", "8000", "irregular",
          ],
          type: "string",
        },
      ],
      description: "Nearest common polling-rate label.",
    },
    pollingHertz: {
      anyOf: [{ type: "null" }, { type: "number" }],
      description: "Measured event rate in hertz, or null below two samples.",
    },
    sampleCount: {
      description: "Number of analyzed move events.",
      minimum: 0,
      type: "integer",
    },
    verdict: {
      description: "Overall pointer diagnosis.",
      enum: ["degraded", "irregular", "no-data", "working"],
      type: "string",
    },
  },
  required: [
    "verdict",
    "sampleCount",
    "pollingHertz",
    "pollingClass",
    "buttonCount",
    "maxTouchPoints",
    "issues",
  ],
  type: "object",
} as const;

export const pointerCheckExample = {
  input: {
    buttons: 7,
    maxTouchPoints: 5,
    moveTimestampsMs: [0, 8, 16, 24, 32],
  },
  output: {
    buttonCount: 3,
    issues: [],
    maxTouchPoints: 5,
    pollingClass: "125",
    pollingHertz: 125,
    sampleCount: 5,
    verdict: "working",
  },
} satisfies ToolExample<PointerCheckInput, PointerCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const popcount = (value: number): number => {
  let count = 0;
  let bits = value;
  while (bits !== 0) {
    bits &= bits - 1;
    count += 1;
  }
  return count;
};

export const isPointerCheckOutput = (
  value: unknown,
): value is PointerCheckOutput =>
  isRecord(value) &&
  typeof value.verdict === "string" &&
  Number.isSafeInteger(value.sampleCount) &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculatePointerCheck = (
  input: unknown,
): ToolResult<PointerCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "buttons",
    "maxTouchPoints",
    "moveTimestampsMs",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawTimestamps = input.moveTimestampsMs;
  let timestamps: readonly number[] = [];
  if (rawTimestamps === undefined)
    issues.push({
      code: "move_timestamps_required",
      field: "moveTimestampsMs",
      message: "moveTimestampsMs is required.",
    });
  else if (!Array.isArray(rawTimestamps))
    issues.push({
      code: "move_timestamps_invalid",
      field: "moveTimestampsMs",
      message: "moveTimestampsMs must be an array of numbers.",
    });
  else {
    const limitIssue = resourceLimitIssue(
      "samples",
      rawTimestamps.length,
      "moveTimestampsMs",
    );
    if (limitIssue) issues.push(limitIssue);
    else
      rawTimestamps.forEach((entry, index) => {
        if (typeof entry !== "number" || !Number.isFinite(entry) || entry < 0)
          issues.push({
            code: "timestamp_invalid",
            field: `moveTimestampsMs.${index}`,
            message: "Move timestamps must be nonnegative finite numbers.",
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
            field: `moveTimestampsMs.${index}`,
            message: "Move timestamps must strictly increase.",
          });
    timestamps = (Array.isArray(rawTimestamps) ? rawTimestamps : []) as readonly number[];
  }

  const buttons = input.buttons;
  if (
    buttons !== undefined &&
    (!Number.isSafeInteger(buttons) ||
      (buttons as number) < 0 ||
      (buttons as number) > 65535)
  )
    issues.push({
      code: "buttons_invalid",
      field: "buttons",
      message: "buttons must be a nonnegative integer up to 65535.",
    });

  const maxTouchPoints = input.maxTouchPoints;
  if (
    maxTouchPoints !== undefined &&
    (!Number.isSafeInteger(maxTouchPoints) || (maxTouchPoints as number) < 0)
  )
    issues.push({
      code: "max_touch_points_invalid",
      field: "maxTouchPoints",
      message: "maxTouchPoints must be a nonnegative integer.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const sortedDeltas = timestamps
    .slice(1)
    .map((value, index) => value - timestamps[index])
    .sort((left, right) => left - right);
  const pollingHertz =
    sortedDeltas.length === 0
      ? null
      : Math.round((1000 / medianFromSorted(sortedDeltas)) * 100) / 100;
  const matched =
    pollingHertz === null
      ? null
      : matchCandidate(pollingHertz, POLLING_CANDIDATES, 0.05);
  const pollingClass =
    pollingHertz === null
      ? null
      : matched !== null
        ? String(matched)
        : "irregular";

  const outputIssues: string[] = [];
  let verdict: PointerCheckVerdict;
  if (timestamps.length === 0) {
    verdict = "no-data";
    outputIssues.push("no-samples-captured");
  } else if (pollingHertz !== null && matched === null) {
    verdict = "irregular";
    if (pollingHertz < 100) outputIssues.push("low-polling");
  } else {
    verdict = "working";
    if (pollingHertz !== null && pollingHertz < 100)
      outputIssues.push("low-polling");
  }

  return toolSuccess({
    buttonCount:
      buttons === undefined ? null : popcount(buttons as number),
    issues: outputIssues,
    maxTouchPoints:
      maxTouchPoints === undefined ? null : (maxTouchPoints as number),
    pollingClass,
    pollingHertz,
    sampleCount: timestamps.length,
    verdict,
  });
};

export const pointerCheckTool = defineTool<PointerCheckInput, PointerCheckOutput>({
  contractVersion: 1,
  description:
    "Diagnose a pointer from move-event timestamps, reporting polling rate and capabilities.",
  discovery: {
    aliases: ["mouse-check", "pointer-test"],
    keywords: ["mouse", "pointer", "polling", "touch"],
  },
  execute: calculatePointerCheck,
  execution: { kind: "pure" },
  id: "check/pointer",
  inputSchema: pointerCheckInputSchema,
  outputSchema: pointerCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Pointer probe supplied by the surface.",
        id: "probe",
        label: "Pointer probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/pointer", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall pointer diagnosis.",
        id: "verdict",
        label: "Verdict",
        valueType: { format: "pointer-verdict", type: "string" },
      },
      {
        description: "Measured event rate in hertz.",
        id: "pollingHertz",
        label: "Polling rate",
        valueType: { format: "frequency", type: "number", unit: "Hz" },
      },
      {
        description: "Nearest common polling-rate label.",
        id: "pollingClass",
        label: "Polling class",
        valueType: { format: "polling-class", type: "string" },
      },
      {
        description: "Set bits in the reported button mask.",
        id: "buttonCount",
        label: "Buttons",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Reported maximum touch points.",
        id: "maxTouchPoints",
        label: "Touch points",
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
  title: "Pointer Checker",
});

export const runPointerCheck = pointerCheckTool.execute;
export default pointerCheckTool;
