import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  triangleArea,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly sideA: number;
  readonly sideB: number;
  readonly sideC: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "sideA", label: "Side a", kind: "number" },
  { id: "sideB", label: "Side b", kind: "number" },
  { id: "sideC", label: "Side c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.sideA, "sideA");
  positive(input.sideB, "sideB");
  positive(input.sideC, "sideC");
  return {
    value:
      triangleArea(input.sideA, input.sideB, input.sideC) /
      ((input.sideA + input.sideB + input.sideC) / 2),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { sideA: 3, sideB: 4, sideC: 5 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/incircle-radius",
  title: "Incircle Radius Calculator",
  description:
    "Incircle r=\u0394/sforactualstrictnondegeneratetrianglesides, notexcircle or radius from one leg.",
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
