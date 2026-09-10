import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, polygonArea } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOrderedPassageBoundaryXyMeters: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOrderedPassageBoundaryXyMeters",
    label: "Actual ordered passage boundary xy meters",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    observedPolygonalPassageAreaSquareMeters: polygonArea(
      input.actualOrderedPassageBoundaryXyMeters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOrderedPassageBoundaryXyMeters: [
      [0, 0],
      [2, 0],
      [2, 3],
      [0, 3],
    ],
  },
  output: { result: { observedPolygonalPassageAreaSquareMeters: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/passage-cross-section-area",
  title: "Passage Cross Section Area Estimator",
  description:
    "Shoelacearea of actual ordered simple independently surveyed passage boundary, no holes. Reject self-intersections; not assume width\u00d7height for irregular cave geometry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
