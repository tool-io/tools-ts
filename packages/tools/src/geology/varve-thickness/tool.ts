import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  integer,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedBoundaryDepthsMm: readonly number[];
  readonly callerVerifiedAnnualVarveCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAnnualizedThicknessesMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBoundaryDepthsMm",
    label: "Observed boundary depths mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAnnualVarveCounts",
    label: "Caller verified annual varve counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAnnualVarveCounts.forEach((v) =>
    positive(v, "callerVerifiedAnnualVarveCounts"),
  );
  strictlyIncreasing(input.observedBoundaryDepthsMm, "depths");
  if (
    input.observedBoundaryDepthsMm.length !==
    input.callerVerifiedAnnualVarveCounts.length + 1
  )
    simpleError("counts", "One verified annual count per boundary interval.");
  input.callerVerifiedAnnualVarveCounts.forEach((v) => integer(v, "count"));
  return {
    observedAnnualizedThicknessesMm: input.callerVerifiedAnnualVarveCounts.map(
      (v, i) =>
        (input.observedBoundaryDepthsMm[i + 1] -
          input.observedBoundaryDepthsMm[i]) /
        v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoundaryDepthsMm: [0, 2, 5],
  callerVerifiedAnnualVarveCounts: [1, 1],
} satisfies Input;
export const exampleOutput = {
  observedAnnualizedThicknessesMm: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/varve-thickness",
  title: "Geology Varve Thickness Calculator",
  description:
    "Actual sediment boundary intervals divided by independently verified annual lamina counts; annuality not inferred from visible banding. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAnnualizedThicknessesMm",
      label: "Observed annualized thicknesses mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBoundaryDepthsMm:
        value.observedBoundaryDepthsMm as readonly number[],
      callerVerifiedAnnualVarveCounts:
        value.callerVerifiedAnnualVarveCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
