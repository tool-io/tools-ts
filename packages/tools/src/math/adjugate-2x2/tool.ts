import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  shape,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMatrix: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMatrix", label: "Actual matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    shape(input.actualMatrix, "matrix") !== 2 ||
    input.actualMatrix.length !== 2
  )
    simpleError("matrix", "2×2matrix.");
  const [a, b, c, d] = input.actualMatrix.flat();
  return {
    adjugate: [
      [d, -b],
      [-c, a],
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatrix: [
      [1, 2],
      [3, 4],
    ],
  },
  output: {
    result: {
      adjugate: [
        [4, -2],
        [-3, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/adjugate-2x2",
  title: "2x2 Adjugate Calculator",
  description:
    "Actual2\u00d72classical adjugate[[d,\u2212b],[\u2212c, a]], even for singular matrix, not conjugate transpose or inverse.",
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
