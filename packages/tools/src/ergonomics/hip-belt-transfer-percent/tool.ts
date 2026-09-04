import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly measuredShoulderVerticalLoadN: number;
  readonly measuredHipVerticalLoadN: number;
  readonly independentPackWeightN: number;
}>;
export type Output = Readonly<{
  readonly observedHipLoadTransferPercent: number;
  readonly signedSupportClosureResidualN: number;
}>;
const inputFields = [
  {
    id: "measuredShoulderVerticalLoadN",
    label: "Measured shoulder vertical load n",
    kind: "number",
  },
  {
    id: "measuredHipVerticalLoadN",
    label: "Measured hip vertical load n",
    kind: "number",
  },
  {
    id: "independentPackWeightN",
    label: "Independent pack weight n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.independentPackWeightN, "independentPackWeightN");
  nonnegative(
    input.measuredShoulderVerticalLoadN,
    "measuredShoulderVerticalLoadN",
  );
  nonnegative(input.measuredHipVerticalLoadN, "measuredHipVerticalLoadN");
  const t = positive(
    input.measuredShoulderVerticalLoadN + input.measuredHipVerticalLoadN,
    "measured supports",
  );
  return {
    observedHipLoadTransferPercent: (100 * input.measuredHipVerticalLoadN) / t,
    signedSupportClosureResidualN: t - input.independentPackWeightN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredShoulderVerticalLoadN: 60,
  measuredHipVerticalLoadN: 40,
  independentPackWeightN: 110,
} satisfies Input;
export const exampleOutput = {
  observedHipLoadTransferPercent: 40,
  signedSupportClosureResidualN: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hip-belt-transfer-percent",
  title: "Backpack Hip Belt Load Transfer Percent Calculator",
  description:
    "Observed hip/shoulder vertical load transfer with independent pack-weight closure residual; missing supports not silently normalized away. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedHipLoadTransferPercent",
      label: "Observed hip load transfer percent",
      kind: "number",
    },
    {
      id: "signedSupportClosureResidualN",
      label: "Signed support closure residual n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredShoulderVerticalLoadN:
        value.measuredShoulderVerticalLoadN as number,
      measuredHipVerticalLoadN: value.measuredHipVerticalLoadN as number,
      independentPackWeightN: value.independentPackWeightN as number,
    }),
});
export const run = tool.execute;
export default tool;
