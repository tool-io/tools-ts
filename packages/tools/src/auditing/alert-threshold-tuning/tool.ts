import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly truePositiveAlerts: number;
  readonly falsePositiveAlerts: number;
  readonly missedEvents: number;
  readonly minimumPrecisionPercent: number;
  readonly minimumRecallPercent: number;
}>;
export type Output = Readonly<{
  readonly precisionPercent: number;
  readonly recallPercent: number;
  readonly falsePositivePercent: number;
  readonly meetsTargets: boolean;
}>;

export const calculate = (input: Input): Output => {
  const alerts = input.truePositiveAlerts + input.falsePositiveAlerts,
    events = input.truePositiveAlerts + input.missedEvents;
  if (alerts === 0 || events === 0)
    simpleError(
      "truePositiveAlerts",
      "At least one alert and one known event are required.",
      "invalid_counts",
    );
  const precisionPercent = (input.truePositiveAlerts / alerts) * 100,
    recallPercent = (input.truePositiveAlerts / events) * 100;
  return {
    precisionPercent,
    recallPercent,
    falsePositivePercent: (input.falsePositiveAlerts / alerts) * 100,
    meetsTargets:
      precisionPercent >= input.minimumPrecisionPercent &&
      recallPercent >= input.minimumRecallPercent,
  };
};

export const exampleInput = {
  truePositiveAlerts: 80,
  falsePositiveAlerts: 20,
  missedEvents: 20,
  minimumPrecisionPercent: 75,
  minimumRecallPercent: 75,
} satisfies Input;
export const exampleOutput = {
  precisionPercent: 80,
  recallPercent: 80,
  falsePositivePercent: 20,
  meetsTargets: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      truePositiveAlerts: input.truePositiveAlerts as number,
      falsePositiveAlerts: input.falsePositiveAlerts as number,
      missedEvents: input.missedEvents as number,
      minimumPrecisionPercent: input.minimumPrecisionPercent as number,
      minimumRecallPercent: input.minimumRecallPercent as number,
    }),
  description:
    "Measure continuous-audit alert precision, recall, and false positives.",
  id: "auditing/alert-threshold-tuning",
  inputs: [
    {
      id: "truePositiveAlerts",
      label: "True-positive alerts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "falsePositiveAlerts",
      label: "False-positive alerts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "missedEvents",
      label: "Known missed events",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumPrecisionPercent",
      label: "Minimum precision",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "minimumRecallPercent",
      label: "Minimum recall",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "precisionPercent",
      label: "Alert precision",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "recallPercent",
      label: "Alert recall",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "falsePositivePercent",
      label: "False-positive share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "meetsTargets",
      label: "Meets supplied precision and recall targets",
      kind: "boolean",
    },
  ],
  title: "Alert-Threshold Tuning",
});

export const run = tool.execute;
export default tool;
