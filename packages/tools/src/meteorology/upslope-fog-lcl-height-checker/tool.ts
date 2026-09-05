import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedUpslopeLiftM: number;
  readonly independentlyComputedLocalLclAboveStartM: number;
}>;
export type Output = Readonly<{ readonly signedLiftLclMarginM: number }>;
const inputFields = [
  {
    id: "observedUpslopeLiftM",
    label: "Observed upslope lift m",
    kind: "number",
  },
  {
    id: "independentlyComputedLocalLclAboveStartM",
    label: "Independently computed local lcl above start m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedUpslopeLiftM, "observedUpslopeLiftM");
  nonnegative(
    input.independentlyComputedLocalLclAboveStartM,
    "independentlyComputedLocalLclAboveStartM",
  );
  return {
    signedLiftLclMarginM:
      input.observedUpslopeLiftM -
      input.independentlyComputedLocalLclAboveStartM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUpslopeLiftM: 400,
  independentlyComputedLocalLclAboveStartM: 500,
} satisfies Input;
export const exampleOutput = { signedLiftLclMarginM: -100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/upslope-fog-lcl-height-checker",
  title: "Upslope Fog LCL Height Checker",
  description:
    "Actual along-parcel upslope lift versus independently same-parcel LCL, not temperature-depression LCL formula renamed or observed fog certainty. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLiftLclMarginM",
      label: "Signed lift lcl margin m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUpslopeLiftM: value.observedUpslopeLiftM as number,
      independentlyComputedLocalLclAboveStartM:
        value.independentlyComputedLocalLclAboveStartM as number,
    }),
});
export const run = tool.execute;
export default tool;
