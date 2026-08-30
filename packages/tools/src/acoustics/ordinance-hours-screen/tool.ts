import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activityDurationMinutes: number;
  readonly activityStartMinute: number;
  readonly allowedEndMinute: number;
  readonly allowedStartMinute: number;
  readonly varianceGranted: boolean;
}>;
export type Output = Readonly<{
  readonly activityEndMinute: number;
  readonly compliantWithSuppliedHours: boolean;
  readonly usedVariance: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of [
    ["activityDurationMinutes", input.activityDurationMinutes],
    ["activityStartMinute", input.activityStartMinute],
    ["allowedEndMinute", input.allowedEndMinute],
    ["allowedStartMinute", input.allowedStartMinute],
  ] as const)
    if (!Number.isSafeInteger(value))
      simpleError(
        field,
        "Times and duration must be safe integers.",
        "invalid_time",
      );
  if (
    input.activityDurationMinutes < 0 ||
    input.activityDurationMinutes > 1440 ||
    input.activityStartMinute < 0 ||
    input.activityStartMinute >= 1440 ||
    input.allowedStartMinute < 0 ||
    input.allowedStartMinute >= 1440 ||
    input.allowedEndMinute < 0 ||
    input.allowedEndMinute > 1440 ||
    input.allowedStartMinute > input.allowedEndMinute
  )
    simpleError(
      "activityStartMinute",
      "Use a non-cross-midnight window and valid minute values.",
      "invalid_window",
    );
  const activityEndMinute =
    input.activityStartMinute + input.activityDurationMinutes;
  if (activityEndMinute > 1440)
    simpleError(
      "activityDurationMinutes",
      "Activity interval must not cross midnight.",
      "interval_crosses_midnight",
    );
  const within =
    input.activityStartMinute >= input.allowedStartMinute &&
    activityEndMinute <= input.allowedEndMinute;
  return {
    activityEndMinute,
    compliantWithSuppliedHours: within || input.varianceGranted,
    usedVariance: !within && input.varianceGranted,
  };
};

export const example = {
  input: {
    activityDurationMinutes: 120,
    activityStartMinute: 480,
    allowedEndMinute: 1080,
    allowedStartMinute: 420,
    varianceGranted: false,
  },
  output: {
    activityEndMinute: 600,
    compliantWithSuppliedHours: true,
    usedVariance: false,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    activityDurationMinutes: 60,
    activityStartMinute: 360,
    allowedEndMinute: 1080,
    allowedStartMinute: 420,
    varianceGranted: true,
  },
  output: {
    activityEndMinute: 420,
    compliantWithSuppliedHours: true,
    usedVariance: true,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      activityDurationMinutes: input.activityDurationMinutes as number,
      activityStartMinute: input.activityStartMinute as number,
      allowedEndMinute: input.allowedEndMinute as number,
      allowedStartMinute: input.allowedStartMinute as number,
      varianceGranted: input.varianceGranted as boolean,
    }),
  description:
    "Check a same-day activity interval against caller-supplied ordinance hours, with an explicit variance override; it embeds no jurisdictional schedule.",
  id: "acoustics/ordinance-hours-screen",
  inputs: [
    {
      id: "activityDurationMinutes",
      kind: "integer",
      label: "Activity duration",
      minimum: 0,
      maximum: 1440,
      unit: "min",
    },
    {
      id: "activityStartMinute",
      kind: "integer",
      label: "Activity start minute",
      minimum: 0,
      maximum: 1439,
    },
    {
      id: "allowedEndMinute",
      kind: "integer",
      label: "Allowed end minute",
      minimum: 0,
      maximum: 1440,
    },
    {
      id: "allowedStartMinute",
      kind: "integer",
      label: "Allowed start minute",
      minimum: 0,
      maximum: 1439,
    },
    { id: "varianceGranted", kind: "boolean", label: "Variance granted" },
  ],
  outputs: [
    {
      id: "activityEndMinute",
      kind: "integer",
      label: "Activity end minute",
      minimum: 0,
      maximum: 1440,
    },
    {
      id: "compliantWithSuppliedHours",
      kind: "boolean",
      label: "Compliant with supplied hours",
    },
    { id: "usedVariance", kind: "boolean", label: "Used variance" },
  ],
  title: "Ordinance Hours Screen",
});

export const run = tool.execute;
export default tool;
