import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldHeight: number;
  readonly observedSplitY: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "fieldHeight", label: "Field height", kind: "number" },
  { id: "observedSplitY", label: "Observed split y", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.fieldHeight, "fieldHeight");
  if (input.observedSplitY < 0 || input.observedSplitY > input.fieldHeight)
    simpleError("split", "Inside field.");
  return { signedMidlineOffset: input.observedSplitY - input.fieldHeight / 2 };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldHeight: 100, observedSplitY: 50 },
  output: { result: { signedMidlineOffset: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/per-fess-split-checker",
  title: "Per Fess Horizontal Split Position Checker",
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
