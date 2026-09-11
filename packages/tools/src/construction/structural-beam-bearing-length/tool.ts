import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSupportReaction: number;
  readonly actualBearingWidth: number;
  readonly callerIndependentlyApplicableBearingStress: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSupportReaction",
    label: "Actual support reaction",
    kind: "number",
  },
  { id: "actualBearingWidth", label: "Actual bearing width", kind: "number" },
  {
    id: "callerIndependentlyApplicableBearingStress",
    label: "Caller independently applicable bearing stress",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSupportReaction, "actualSupportReaction");
  positive(input.actualBearingWidth, "actualBearingWidth");
  positive(
    input.callerIndependentlyApplicableBearingStress,
    "callerIndependentlyApplicableBearingStress",
  );
  return {
    value:
      input.actualSupportReaction /
      (input.actualBearingWidth *
        input.callerIndependentlyApplicableBearingStress),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSupportReaction: 20,
    actualBearingWidth: 2,
    callerIndependentlyApplicableBearingStress: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/structural-beam-bearing-length",
  title: "Beam Bearing Length Calculator",
  description:
    "Ideal uniformbearinglengthR/(width\u00d7independent allowable stress), local crushing/load spread design external. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
