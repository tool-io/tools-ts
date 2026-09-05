import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly observedFacingVectorX: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedFacingVectorX",
    label: "Observed facing vector x",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.observedFacingVectorX === 0)
    simpleError(
      "facing",
      "Nonzero independently observed horizontal facing component.",
    );
  return {
    viewerFacing: input.observedFacingVectorX < 0 ? "left" : "right",
    bearerFacing: input.observedFacingVectorX < 0 ? "dexter" : "sinister",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFacingVectorX: -1 },
  output: { result: { viewerFacing: "left", bearerFacing: "dexter" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/facing-dexter-convention-checker",
  title: "Charge Facing Dexter Convention Checker",
  description:
    "Describe witnessed horizontal facing in viewer x-right coordinates; bearer dexter is viewer left, not a legal pose judgement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
