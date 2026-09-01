import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBarHeightsMeters: readonly number[];
  readonly observedLowestBodyClearanceHeightsMeters: readonly number[];
  readonly observedBarStayedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedMeasuredBodyBarMarginsMeters: readonly number[];
  readonly observedSuccessfulClearanceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBarHeightsMeters",
    label: "Observed bar heights meters",
    kind: "numberList",
  },
  {
    id: "observedLowestBodyClearanceHeightsMeters",
    label: "Observed lowest body clearance heights meters",
    kind: "numberList",
  },
  {
    id: "observedBarStayedFlags",
    label: "Observed bar stayed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBarHeightsMeters.forEach((v) =>
    positive(v, "observedBarHeightsMeters"),
  );
  input.observedLowestBodyClearanceHeightsMeters.forEach((v) =>
    positive(v, "observedLowestBodyClearanceHeightsMeters"),
  );
  binary(input.observedBarStayedFlags, "observedBarStayedFlags");
  aligned(
    input.observedBarHeightsMeters,
    input.observedLowestBodyClearanceHeightsMeters,
    "observedBarHeightsMeters",
  );
  aligned(
    input.observedBarHeightsMeters,
    input.observedBarStayedFlags,
    "observedBarHeightsMeters",
  );
  return {
    signedMeasuredBodyBarMarginsMeters:
      input.observedLowestBodyClearanceHeightsMeters.map(
        (v, i) => v - input.observedBarHeightsMeters[i],
      ),
    observedSuccessfulClearanceFlags: [...input.observedBarStayedFlags],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBarHeightsMeters: [1.5, 1.6],
  observedLowestBodyClearanceHeightsMeters: [1.55, 1.58],
  observedBarStayedFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedMeasuredBodyBarMarginsMeters: [0.05, -0.02],
  observedSuccessfulClearanceFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/high-jump-scissor-bar-clearance-height-checker",
  title: "High Jump Clearance Height Check",
  description:
    "Audit actual high-jump measured body/bar margin and independently observed bar-stayed evidence; geometry does not infer successful clearance, valid technique or landing safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMeasuredBodyBarMarginsMeters",
      label: "Signed measured body bar margins meters",
      kind: "numberList",
    },
    {
      id: "observedSuccessfulClearanceFlags",
      label: "Observed successful clearance flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBarHeightsMeters:
        value.observedBarHeightsMeters as readonly number[],
      observedLowestBodyClearanceHeightsMeters:
        value.observedLowestBodyClearanceHeightsMeters as readonly number[],
      observedBarStayedFlags: value.observedBarStayedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
