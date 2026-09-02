import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedLunarAngularDiameterArcmin: number;
  readonly callerComparisonAngularDiameterArcmin: number;
  readonly callerIncreaseReviewPercent: number;
}>;
export type Output = Readonly<{
  readonly observedDiameterIncreasePercent: number;
  readonly callerDiameterThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedLunarAngularDiameterArcmin",
    label: "Observed lunar angular diameter arcmin",
    kind: "number",
  },
  {
    id: "callerComparisonAngularDiameterArcmin",
    label: "Caller comparison angular diameter arcmin",
    kind: "number",
  },
  {
    id: "callerIncreaseReviewPercent",
    label: "Caller increase review percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedLunarAngularDiameterArcmin,
    "observedLunarAngularDiameterArcmin",
  );
  positive(
    input.callerComparisonAngularDiameterArcmin,
    "callerComparisonAngularDiameterArcmin",
  );
  nonnegative(input.callerIncreaseReviewPercent, "callerIncreaseReviewPercent");
  return {
    observedDiameterIncreasePercent:
      100 *
      (input.observedLunarAngularDiameterArcmin /
        input.callerComparisonAngularDiameterArcmin -
        1),
    callerDiameterThresholdReached:
      100 *
        (input.observedLunarAngularDiameterArcmin /
          input.callerComparisonAngularDiameterArcmin -
          1) >=
      input.callerIncreaseReviewPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLunarAngularDiameterArcmin: 34,
  callerComparisonAngularDiameterArcmin: 30,
  callerIncreaseReviewPercent: 10,
} satisfies Input;
export const exampleOutput = {
  observedDiameterIncreasePercent: 13.333333333333334,
  callerDiameterThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/supermoon-size-increase-percent-checker",
  title: "Supermoon Size Increase Percent Check",
  description:
    "Actual angular diameter increase vs independently defined reference and caller screen; diameter not area, no universal supermoon designation. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDiameterIncreasePercent",
      label: "Observed diameter increase percent",
      kind: "number",
    },
    {
      id: "callerDiameterThresholdReached",
      label: "Caller diameter threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLunarAngularDiameterArcmin:
        value.observedLunarAngularDiameterArcmin as number,
      callerComparisonAngularDiameterArcmin:
        value.callerComparisonAngularDiameterArcmin as number,
      callerIncreaseReviewPercent: value.callerIncreaseReviewPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
