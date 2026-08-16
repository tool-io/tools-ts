import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BatteryHealth =
  | "charging"
  | "fair"
  | "good"
  | "low"
  | "unknown";

export type BatteryCheckInput = {
  readonly chargeTimeSeconds?: number;
  readonly charging?: boolean;
  /** Remaining charge as a percentage from 0 to 100. */
  readonly levelPercent?: number;
  readonly dischargeTimeSeconds?: number;
};

export type BatteryCheckOutput = {
  readonly chargeTimeHours: number | null;
  readonly charging: boolean | null;
  readonly dischargeTimeHours: number | null;
  readonly health: BatteryHealth;
  readonly issues: readonly string[];
  readonly levelPercent: number | null;
};

const LOW_BATTERY_PERCENT = 20;
const CRITICAL_BATTERY_PERCENT = 10;
const GOOD_BATTERY_PERCENT = 80;

export const batteryCheckInputSchema = {
  additionalProperties: false,
  properties: {
    chargeTimeSeconds: {
      description:
        "Estimated seconds until fully charged, when charging is known.",
      minimum: 0,
      type: "integer",
    },
    charging: {
      description: "Whether the device is currently plugged in and charging.",
      type: "boolean",
    },
    levelPercent: {
      description: "Remaining charge percentage from 0 to 100.",
      maximum: 100,
      minimum: 0,
      type: "number",
    },
    dischargeTimeSeconds: {
      description:
        "Estimated seconds until empty, when discharging is known.",
      minimum: 0,
      type: "integer",
    },
  },
  type: "object",
} as const;

export const batteryCheckOutputSchema = {
  additionalProperties: false,
  properties: {
    chargeTimeHours: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "number" }],
      description: "Estimated hours until fully charged.",
    },
    charging: {
      anyOf: [{ type: "null" }, { type: "boolean" }],
      description: "Whether the device is currently charging.",
    },
    dischargeTimeHours: {
      anyOf: [{ type: "null" }, { minimum: 0, type: "number" }],
      description: "Estimated hours of runtime remaining.",
    },
    health: {
      description: "Overall charge-state classification.",
      enum: ["charging", "fair", "good", "low", "unknown"],
      type: "string",
    },
    issues: {
      description: "Stable machine-facing warning codes.",
      items: { type: "string" },
      type: "array",
    },
    levelPercent: {
      anyOf: [
        { maximum: 100, minimum: 0, type: "number" },
        { type: "null" },
      ],
      description: "Remaining charge percentage, when reported.",
    },
  },
  required: [
    "levelPercent",
    "charging",
    "health",
    "chargeTimeHours",
    "dischargeTimeHours",
    "issues",
  ],
  type: "object",
} as const;

export const batteryCheckExample = {
  input: {
    charging: false,
    dischargeTimeSeconds: 10800,
    levelPercent: 60,
  },
  output: {
    chargeTimeHours: null,
    charging: false,
    dischargeTimeHours: 3,
    health: "fair",
    issues: [],
    levelPercent: 60,
  },
} satisfies ToolExample<BatteryCheckInput, BatteryCheckOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isBatteryCheckOutput = (
  value: unknown,
): value is BatteryCheckOutput =>
  isRecord(value) &&
  typeof value.health === "string" &&
  Array.isArray(value.issues) &&
  value.issues.every((issue) => typeof issue === "string");

export const calculateBatteryCheck = (
  input: unknown,
): ToolResult<BatteryCheckOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "chargeTimeSeconds",
    "charging",
    "levelPercent",
    "dischargeTimeSeconds",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const level = input.levelPercent;
  if (
    level !== undefined &&
    (typeof level !== "number" ||
      !Number.isFinite(level) ||
      (level as number) < 0 ||
      (level as number) > 100)
  )
    issues.push({
      code: "level_percent_invalid",
      field: "levelPercent",
      message: "levelPercent must be a finite number between 0 and 100.",
    });

  const charging = input.charging;
  if (charging !== undefined && typeof charging !== "boolean")
    issues.push({
      code: "charging_invalid",
      field: "charging",
      message: "charging must be a boolean.",
    });

  const secondsFields = [
    ["chargeTimeSeconds", "charge_time_invalid"],
    ["dischargeTimeSeconds", "discharge_time_invalid"],
  ] as const;
  for (const [field, invalidCode] of secondsFields) {
    const value = input[field];
    if (
      value !== undefined &&
      (!Number.isSafeInteger(value) || (value as number) < 0)
    )
      issues.push({
        code: invalidCode,
        field,
        message: `${field} must be a nonnegative safe integer.`,
      });
  }

  if (issues.length > 0) return invalidInput(issues);

  const resolvedLevel = level === undefined ? null : (level as number);
  const resolvedCharging =
    charging === undefined ? null : (charging as boolean);
  const chargeTimeHours =
    input.chargeTimeSeconds === undefined
      ? null
      : (input.chargeTimeSeconds as number) / 3600;
  const dischargeTimeHours =
    input.dischargeTimeSeconds === undefined
      ? null
      : (input.dischargeTimeSeconds as number) / 3600;

  const outputIssues: string[] = [];
  let health: BatteryHealth;
  if (resolvedCharging === true) {
    health = "charging";
  } else if (resolvedLevel === null) {
    health = "unknown";
    outputIssues.push("level-unreported");
  } else if (resolvedLevel >= GOOD_BATTERY_PERCENT) {
    health = "good";
  } else if (resolvedLevel >= LOW_BATTERY_PERCENT) {
    health = "fair";
  } else {
    health = "low";
    outputIssues.push("low-battery");
    if (resolvedLevel < CRITICAL_BATTERY_PERCENT)
      outputIssues.push("critical-battery");
  }

  return toolSuccess({
    chargeTimeHours,
    charging: resolvedCharging,
    dischargeTimeHours,
    health,
    issues: outputIssues,
    levelPercent: resolvedLevel,
  });
};

export const batteryCheckTool = defineTool<
  BatteryCheckInput,
  BatteryCheckOutput
>({
  contractVersion: 1,
  description:
    "Assess a battery probe, reporting charge state, estimated runtimes, and low-charge warnings.",
  discovery: {
    aliases: ["battery-status", "power-check"],
    keywords: ["battery", "charging", "power"],
  },
  execute: calculateBatteryCheck,
  execution: { kind: "pure" },
  id: "check/battery",
  inputSchema: batteryCheckInputSchema,
  outputSchema: batteryCheckOutputSchema,
  ports: {
    inputs: [
      {
        description: "Battery probe supplied by the surface.",
        id: "probe",
        label: "Battery probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/battery", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall charge-state classification.",
        id: "health",
        label: "Health",
        valueType: { format: "battery-health", type: "string" },
      },
      {
        description: "Remaining charge percentage when reported.",
        id: "levelPercent",
        label: "Charge level",
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Whether the device is currently charging.",
        id: "charging",
        label: "Charging",
        valueType: { type: "boolean" },
      },
      {
        description: "Estimated hours of runtime remaining.",
        id: "dischargeTimeHours",
        label: "Runtime estimate",
        valueType: { format: "duration", type: "number", unit: "h" },
      },
      {
        description: "Estimated hours until fully charged.",
        id: "chargeTimeHours",
        label: "Charge time estimate",
        valueType: { format: "duration", type: "number", unit: "h" },
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
  title: "Battery Checker",
});

export const runBatteryCheck = batteryCheckTool.execute;
export default batteryCheckTool;
