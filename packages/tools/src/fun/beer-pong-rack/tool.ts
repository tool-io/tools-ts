import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualTriangularRackRows: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTriangularRackRows",
    label: "Actual triangular rack rows",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualTriangularRackRows, "rows", 1, 10);
  const a: number[][] = [];
  for (let r = 0; r < input.actualTriangularRackRows; r++)
    for (let c = 0; c <= r; c++) a.push([c - r / 2, (r * Math.sqrt(3)) / 2]);
  return { cupCenters: a };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTriangularRackRows: 3 },
  output: {
    result: {
      cupCenters: [
        [0, 0],
        [-0.5, 0.8660254037844386],
        [0.5, 0.8660254037844386],
        [-1, 1.7320508075688772],
        [0, 1.7320508075688772],
        [1, 1.7320508075688772],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/beer-pong-rack",
  title: "Beer Pong Rack Layout Generator",
  description:
    "Normalizedequilateraltriangularcuprackcenters,unitspacing,no drinkingrequirements or tableplacement safety. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
