import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type RolloverEvent = {
  readonly code: string;
  readonly type: "press" | "release";
};

export type RolloverClass =
  | "1-key"
  | "2-key"
  | "3-key"
  | "4-key"
  | "5-key"
  | "6-key"
  | "n-key"
  | "unknown";

export type KeyboardRolloverInput = {
  readonly events: readonly RolloverEvent[];
};

export type KeyboardRolloverOutput = {
  readonly eventCount: number;
  readonly maxConcurrentKeys: number;
  readonly rolloverClass: RolloverClass;
};

export const keyboardRolloverInputSchema = {
  additionalProperties: false,
  properties: {
    events: {
      description: "Key events in chronological order.",
      items: {
        additionalProperties: false,
        properties: {
          code: {
            description: "Stable key code, such as KeyA or Space.",
            maxLength: 64,
            minLength: 1,
            type: "string",
          },
          type: { enum: ["press", "release"], type: "string" },
        },
        required: ["type", "code"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["events"],
  type: "object",
} as const;

export const keyboardRolloverOutputSchema = {
  additionalProperties: false,
  properties: {
    eventCount: {
      description: "Number of processed key events.",
      minimum: 0,
      type: "integer",
    },
    maxConcurrentKeys: {
      description: "Largest number of keys held simultaneously.",
      minimum: 0,
      type: "integer",
    },
    rolloverClass: {
      description: "Rollover classification of the probe.",
      enum: [
        "1-key", "2-key", "3-key", "4-key", "5-key", "6-key",
        "n-key", "unknown",
      ],
      type: "string",
    },
  },
  required: ["eventCount", "maxConcurrentKeys", "rolloverClass"],
  type: "object",
} as const;

const pressEvents = (pairs: [string, ...string[]]): RolloverEvent[] =>
  pairs.flatMap((code) => [{ code, type: "press" as const }]);

export const keyboardRolloverExample = {
  input: {
    events: [
      ...pressEvents(["KeyA", "KeyS", "KeyD", "KeyF", "Space"]),
      { code: "KeyA", type: "release" },
      { code: "KeyS", type: "release" },
      { code: "KeyD", type: "release" },
      { code: "KeyF", type: "release" },
      { code: "Space", type: "release" },
    ],
  },
  output: { eventCount: 10, maxConcurrentKeys: 5, rolloverClass: "5-key" },
} satisfies ToolExample<KeyboardRolloverInput, KeyboardRolloverOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const rolloverClassFor = (
  eventCount: number,
  maxConcurrentKeys: number,
): RolloverClass => {
  if (eventCount === 0) return "unknown";
  if (maxConcurrentKeys <= 6)
    return `${maxConcurrentKeys}-key` as RolloverClass;
  return "n-key";
};

export const isKeyboardRolloverOutput = (
  value: unknown,
): value is KeyboardRolloverOutput =>
  isRecord(value) &&
  Number.isSafeInteger(value.maxConcurrentKeys) &&
  typeof value.rolloverClass === "string";

export const calculateKeyboardRollover = (
  input: unknown,
): ToolResult<KeyboardRolloverOutput> => {
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
    if (field !== "events")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawEvents = input.events;
  let events: readonly RolloverEvent[] = [];
  if (rawEvents === undefined)
    issues.push({
      code: "events_required",
      field: "events",
      message: "events is required.",
    });
  else if (!Array.isArray(rawEvents))
    issues.push({
      code: "events_invalid",
      field: "events",
      message: "events must be an array of key events.",
    });
  else {
    const limitIssue = resourceLimitIssue(
      "generatedValues",
      rawEvents.length,
      "events",
    );
    if (limitIssue) return invalidInput([limitIssue]);
    rawEvents.forEach((entry, index) => {
      if (!isRecord(entry)) {
        issues.push({
          code: "event_invalid",
          field: `events.${index}`,
          message: `events.${index} must be an object.`,
        });
        return;
      }
      for (const key of Object.keys(entry))
        if (key !== "type" && key !== "code")
          issues.push({
            code: "unknown_field",
            field: `events.${index}.${key}`,
            message: `${key} is not a supported event field.`,
          });
      const { code, type } = entry;
      if (type !== "press" && type !== "release")
        issues.push({
          code: "event_type_invalid",
          field: `events.${index}.type`,
          message: `events.${index}.type must be press or release.`,
        });
      if (typeof code !== "string" || code.length < 1 || code.length > 64)
        issues.push({
          code: "event_code_invalid",
          field: `events.${index}.code`,
          message: `events.${index}.code must be a string of 1 to 64 characters.`,
        });
    });
    events = (Array.isArray(rawEvents) ? rawEvents : []) as readonly RolloverEvent[];
  }
  if (issues.length > 0) return invalidInput(issues);

  const active = new Set<string>();
  let maxConcurrentKeys = 0;
  for (const event of events) {
    if (event.type === "press") active.add(event.code);
    else active.delete(event.code);
    if (active.size > maxConcurrentKeys) maxConcurrentKeys = active.size;
  }

  return toolSuccess({
    eventCount: events.length,
    maxConcurrentKeys,
    rolloverClass: rolloverClassFor(events.length, maxConcurrentKeys),
  });
};

export const keyboardRolloverTool = defineTool<
  KeyboardRolloverInput,
  KeyboardRolloverOutput
>({
  contractVersion: 1,
  description:
    "Measure maximum simultaneous held keys from a key-event log to classify rollover support.",
  discovery: {
    aliases: ["nkro-test", "key-rollover"],
    keywords: ["keyboard", "keys", "nkro", "rollover"],
  },
  execute: calculateKeyboardRollover,
  execution: { kind: "pure" },
  id: "check/keyboard-rollover",
  inputSchema: keyboardRolloverInputSchema,
  outputSchema: keyboardRolloverOutputSchema,
  ports: {
    inputs: [
      {
        description: "Chronological key-event log from the surface.",
        id: "probe",
        label: "Key event log",
        path: [],
        required: true,
        valueType: { format: "device-probe/key-events", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Largest number of simultaneously held keys.",
        id: "maxConcurrentKeys",
        label: "Max concurrent keys",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Rollover classification of the probe.",
        id: "rolloverClass",
        label: "Rollover class",
        valueType: { format: "rollover-class", type: "string" },
      },
      {
        description: "Number of processed key events.",
        id: "eventCount",
        label: "Event count",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Keyboard Rollover Checker",
});

export const runKeyboardRollover = keyboardRolloverTool.execute;
export default keyboardRolloverTool;
