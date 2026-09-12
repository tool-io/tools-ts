import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInteriorLatticePointCount: number;
  readonly actualBoundaryLatticePointCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInteriorLatticePointCount",
    label: "Actual interior lattice point count",
    kind: "number",
  },
  {
    id: "actualBoundaryLatticePointCount",
    label: "Actual boundary lattice point count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualInteriorLatticePointCount,
    "actualInteriorLatticePointCount",
    0,
    1000000,
  );
  bounded(
    input.actualBoundaryLatticePointCount,
    "actualBoundaryLatticePointCount",
    0,
    1000000,
  );
  if (
    input.actualBoundaryLatticePointCount < 3 ||
    input.actualInteriorLatticePointCount +
      input.actualBoundaryLatticePointCount / 2 -
      1 <=
      0
  )
    simpleError("polygon", "Actualnondegenerateboundary≥3andpositivearea.");
  return {
    value:
      input.actualInteriorLatticePointCount +
      input.actualBoundaryLatticePointCount / 2 -
      1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInteriorLatticePointCount: 1,
    actualBoundaryLatticePointCount: 4,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/pick-theorem-area",
  title: "Pick Theorem Area Calculator",
  description:
    "PicklatticeareaI+B/2\u22121, actual independently verified simple hole free integer lattice polygon counts, integer area or half integer; counts not proof valid polygon.",
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
