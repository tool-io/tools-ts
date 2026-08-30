import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DirectCapitalizationValueInput = Readonly<{
  readonly annualNoi: number;
  readonly capRatePercent: number;
}>;
export type DirectCapitalizationValueOutput = Readonly<{
  readonly indicatedValue: number;
}>;

export const calculateDirectCapitalizationValue = (
  x: DirectCapitalizationValueInput,
): DirectCapitalizationValueOutput => {
  if (!Number.isFinite(x.annualNoi) || x.annualNoi <= 0)
    simpleError("annualNoi", "Provide a finite positive number.");
  if (!Number.isFinite(x.capRatePercent) || x.capRatePercent <= 0)
    simpleError("capRatePercent", "Provide a finite positive number.");
  const indicatedValue = (100 * x.annualNoi) / x.capRatePercent;
  if (!Number.isFinite(indicatedValue))
    simpleError(
      "indicatedValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { indicatedValue: Object.is(indicatedValue, -0) ? 0 : indicatedValue };
};

export const example = {
  input: {
    annualNoi: 10000,
    capRatePercent: 5,
  },
  output: { indicatedValue: 200000 },
} satisfies ToolExample<
  DirectCapitalizationValueInput,
  DirectCapitalizationValueOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/direct-capitalization-value",
  title: "Direct Capitalization Value",
  description:
    "Indicative property value from stabilized annual NOI divided by an assumed cap rate; not an appraisal.",
  inputs: [
    {
      id: "annualNoi",
      kind: "number",
      label: "Annual Noi",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "capRatePercent",
      kind: "number",
      label: "Cap Rate Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "indicatedValue",
      kind: "number",
      label: "Indicated Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateDirectCapitalizationValue({
      annualNoi: input.annualNoi as number,
      capRatePercent: input.capRatePercent as number,
    }),
});
export const directCapitalizationValueTool = tool;
export const runDirectCapitalizationValue = tool.execute;
export default tool;
