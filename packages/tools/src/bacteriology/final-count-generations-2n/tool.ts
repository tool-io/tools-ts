import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialCount: number;
  readonly generations: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "initialCount", label: "Initial count", kind: "number" },
  { id: "generations", label: "Generations", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.initialCount, "initial");
  angle(i.generations, "generations", -1022, 1022);
  return { conditionalFinalCount: i.initialCount * 2 ** i.generations };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialCount: 100, generations: 3 },
  output: { result: { conditionalFinalCount: 800 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/final-count-generations-2n",
  title: "Final Cell Count from Initial and Generations 2^n Calculator",
  description:
    "Conditional final count for independently established net doublings, no lag/death/resource constraint model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalFinalCount: { type: "number" } },
        required: ["conditionalFinalCount"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
