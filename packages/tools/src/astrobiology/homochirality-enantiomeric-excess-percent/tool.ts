import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly leftAmount: number;
  readonly rightAmount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "leftAmount", label: "Left amount", kind: "number" },
  { id: "rightAmount", label: "Right amount", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.leftAmount, "left");
  nonnegative(i.rightAmount, "right");
  positive(i.leftAmount + i.rightAmount, "total");
  return {
    signedEnantiomericExcessPercent:
      (100 * (i.leftAmount - i.rightAmount)) / (i.leftAmount + i.rightAmount),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { leftAmount: 3, rightAmount: 1 },
  output: { result: { signedEnantiomericExcessPercent: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/homochirality-enantiomeric-excess-percent",
  title: "Chirality Homochirality Enantiomeric Excess ee Percent Calculator",
  description:
    "Signed L-minus-D enantiomeric excess percent from actual same-basis amounts; not a biosignature, origin or absolute configuration inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedEnantiomericExcessPercent: { type: "number" } },
        required: ["signedEnantiomericExcessPercent"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
