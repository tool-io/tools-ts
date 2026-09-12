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
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sideA", label: "Side a", kind: "number" },
  { id: "sideB", label: "Side b", kind: "number" },
  { id: "sideC", label: "Side c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.sideA, "sideA");
  positive(input.sideB, "sideB");
  positive(input.sideC, "sideC");
  return {
    value:
      8 *
      ((input.sideA * input.sideB * input.sideC) /
        (4 * triangleArea(input.sideA, input.sideB, input.sideC))) *
      Math.sin(
        Math.acos(
          (input.sideB ** 2 + input.sideC ** 2 - input.sideA ** 2) /
            (2 * input.sideB * input.sideC),
        ) / 3,
      ) *
      Math.sin(
        Math.acos(
          (input.sideA ** 2 + input.sideC ** 2 - input.sideB ** 2) /
            (2 * input.sideA * input.sideC),
        ) / 3,
      ) *
      Math.sin(
        Math.acos(
          (input.sideA ** 2 + input.sideB ** 2 - input.sideC ** 2) /
            (2 * input.sideA * input.sideB),
        ) / 3,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { sideA: 3, sideB: 4, sideC: 5 },
  output: { result: { value: 0.6475176883770992 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/morley-triangle",
  title: "Morley Triangle Calculator",
  description:
    "First/interior Morley equilateral triangle SIDE8Rsin(A/3) sin(B/3) sin(C/3), strictly valid sides, same units. Not externaltrisectorvariantsor full coordinates.",
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
