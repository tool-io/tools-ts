import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, vector3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedCrownFacetVertexA: readonly number[];
  readonly observedCrownFacetVertexB: readonly number[];
  readonly observedCrownFacetVertexC: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTriangleFacetAreaMM2: number;
}>;
const inputFields = [
  {
    id: "observedCrownFacetVertexA",
    label: "Observed crown facet vertex a",
    kind: "numberList",
  },
  {
    id: "observedCrownFacetVertexB",
    label: "Observed crown facet vertex b",
    kind: "numberList",
  },
  {
    id: "observedCrownFacetVertexC",
    label: "Observed crown facet vertex c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.observedCrownFacetVertexA,
    input.observedCrownFacetVertexB,
    input.observedCrownFacetVertexC,
  ])
    vector3(v, "vertices");
  const u = input.observedCrownFacetVertexB.map(
      (v, i) => v - input.observedCrownFacetVertexA[i],
    ),
    w = input.observedCrownFacetVertexC.map(
      (v, i) => v - input.observedCrownFacetVertexA[i],
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
  observedCrownFacetVertexA: [0, 0, 0],
  observedCrownFacetVertexB: [3, 0, 0],
  observedCrownFacetVertexC: [0, 4, 0],
} satisfies Input;
export const exampleOutput = {
  observedTriangleFacetAreaMM2: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/crown-facet-area",
  title: "Crown Facet Slope Area Calculator",
  description:
    "Crown actual independently measured triangular facet 3 Darea, not full conical envelope or optical-return grading. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      observedCrownFacetVertexA:
        value.observedCrownFacetVertexA as readonly number[],
      observedCrownFacetVertexB:
        value.observedCrownFacetVertexB as readonly number[],
      observedCrownFacetVertexC:
        value.observedCrownFacetVertexC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
