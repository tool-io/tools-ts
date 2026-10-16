import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly observedSplitX: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "observedSplitX", label: "Observed split x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.fieldWidth, "fieldWidth");
  if (input.observedSplitX < 0 || input.observedSplitX > input.fieldWidth)
    simpleError("split", "Inside field.");
  return { signedMidlineOffset: input.observedSplitX - input.fieldWidth / 2 };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, observedSplitX: 50 },
  output: { result: { signedMidlineOffset: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/per-pale-midline-checker",
  title: "Per Pale Partition Midline Position Checker",
  description:
    "Audit per-pale/per-fess split against envelope midline, not actual curved-shield area equality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedMidlineOffset: { type: "number" } },
        required: ["signedMidlineOffset"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
