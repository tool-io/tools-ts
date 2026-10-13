import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualConcreteBatchVolume: number;
  readonly callerVerifiedProductDosagePerConcreteVolume: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualConcreteBatchVolume",
    label: "Actual concrete batch volume",
    kind: "number",
  },
  {
    id: "callerVerifiedProductDosagePerConcreteVolume",
    label: "Caller verified product dosage per concrete volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualConcreteBatchVolume, "actualConcreteBatchVolume");
  nonnegative(
    input.callerVerifiedProductDosagePerConcreteVolume,
    "callerVerifiedProductDosagePerConcreteVolume",
  );
  return {
    value:
      input.actualConcreteBatchVolume *
      input.callerVerifiedProductDosagePerConcreteVolume,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualConcreteBatchVolume: 10,
    callerVerifiedProductDosagePerConcreteVolume: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/rebar-corrosion-inhibitor-dose",
  title: "Rebar Corrosion Inhibitor Dose Calculator",
  description:
    "Bookkeeping independently prescribed product quantity/per concrete volume\u00d7actual batch volume, no inhibitor chemistry recipe or safe/durable performance. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
