import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, vector3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPavilionFacetVertexA: readonly number[];
  readonly observedPavilionFacetVertexB: readonly number[];
  readonly observedPavilionFacetVertexC: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTriangleFacetAreaMM2: number;
}>;
const inputFields = [
  {
    id: "observedPavilionFacetVertexA",
    label: "Observed pavilion facet vertex a",
    kind: "numberList",
  },
  {
    id: "observedPavilionFacetVertexB",
    label: "Observed pavilion facet vertex b",
    kind: "numberList",
  },
  {
    id: "observedPavilionFacetVertexC",
    label: "Observed pavilion facet vertex c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.observedPavilionFacetVertexA,
    input.observedPavilionFacetVertexB,
    input.observedPavilionFacetVertexC,
  ])
    vector3(v, "vertices");
  const u = input.observedPavilionFacetVertexB.map(
      (v, i) => v - input.observedPavilionFacetVertexA[i],
    ),
    w = input.observedPavilionFacetVertexC.map(
      (v, i) => v - input.observedPavilionFacetVertexA[i],
    );
  return {
    observedTriangleFacetAreaMM2:
      Math.hypot(
        u[1] * w[2] - u[2] * w[1],
        u[2] * w[0] - u[0] * w[2],
        u[0] * w[1] - u[1] * w[0],
      ) / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPavilionFacetVertexA: [0, 0, 0],
  observedPavilionFacetVertexB: [3, 0, 0],
  observedPavilionFacetVertexC: [0, 4, 0],
} satisfies Input;
export const exampleOutput = {
  observedTriangleFacetAreaMM2: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pavilion-facet-area",
  title: "Pavilion Facet Area Calculator",
  description:
    "Pavilion actual independently measured triangular facet 3 Darea, not full conical envelope or optical-return grading. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTriangleFacetAreaMM2",
      label: "Observed triangle facet area m m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPavilionFacetVertexA:
        value.observedPavilionFacetVertexA as readonly number[],
      observedPavilionFacetVertexB:
        value.observedPavilionFacetVertexB as readonly number[],
      observedPavilionFacetVertexC:
        value.observedPavilionFacetVertexC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
