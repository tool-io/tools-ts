import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredHopaneSignal: number;
  readonly independentlyMeasuredSteraneSignal: number;
  readonly callerReferenceRatioBoundary: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredHopaneSignal",
    label: "Independently measured hopane signal",
    kind: "number",
  },
  {
    id: "independentlyMeasuredSteraneSignal",
    label: "Independently measured sterane signal",
    kind: "number",
  },
  {
    id: "callerReferenceRatioBoundary",
    label: "Caller reference ratio boundary",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredHopaneSignal, "hopane");
  positive(input.independentlyMeasuredSteraneSignal, "sterane");
  nonnegative(input.callerReferenceRatioBoundary, "boundary");
  const r =
    input.independentlyMeasuredHopaneSignal /
    input.independentlyMeasuredSteraneSignal;
  return {
    observedHopaneSteraneRatio: r,
    aboveCallerRatioBoundary: r > input.callerReferenceRatioBoundary,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredHopaneSignal: 2,
    independentlyMeasuredSteraneSignal: 1,
    callerReferenceRatioBoundary: 1,
  },
  output: {
    result: { observedHopaneSteraneRatio: 2, aboveCallerRatioBoundary: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/lipid-hopane-sterane-ratio-classifier",
  title: "Lipid Biomarker Hopane Sterane Presence Ratio Classifier",
  description:
    "Actual matched analytical hopane/sterane signal ratio relative to independent reference, not compound identification or biogenicity. Response factors, contamination, diagenesis and provenance remain external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
