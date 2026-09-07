import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPlaquetteBerryFluxRadians: readonly number[];
  readonly observedPlaquetteKSpaceAreas: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBerryCurvatureByPlaquette: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlaquetteBerryFluxRadians",
    label: "Observed plaquette berry flux radians",
    kind: "numberList",
  },
  {
    id: "observedPlaquetteKSpaceAreas",
    label: "Observed plaquette k space areas",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPlaquetteKSpaceAreas.forEach((v) =>
    positive(v, "observedPlaquetteKSpaceAreas"),
  );
  aligned(
    input.observedPlaquetteBerryFluxRadians,
    input.observedPlaquetteKSpaceAreas,
    "observedPlaquetteBerryFluxRadians",
  );
  if (
    input.observedPlaquetteBerryFluxRadians.some((v) => Math.abs(v) > Math.PI)
  )
    simpleError(
      "flux",
      "Explicit principal-branch plaquette flux |φ|≤π required.",
    );
  return {
    observedBerryCurvatureByPlaquette:
      input.observedPlaquetteBerryFluxRadians.map(
        (v, i) => v / input.observedPlaquetteKSpaceAreas[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlaquetteBerryFluxRadians: [0.2, -0.4],
  observedPlaquetteKSpaceAreas: [2, 4],
} satisfies Input;
export const exampleOutput = {
  observedBerryCurvatureByPlaquette: [0.1, -0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/berry-curvature",
  title: "Semiconductor Berry Curvature Calculator",
  description:
    "Infer actual discrete plaquette curvature from independently computed principal Berry flux and oriented positive cell area; no eigenvector gauge reconstruction or phase unwrap.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBerryCurvatureByPlaquette",
      label: "Observed berry curvature by plaquette",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlaquetteBerryFluxRadians:
        value.observedPlaquetteBerryFluxRadians as readonly number[],
      observedPlaquetteKSpaceAreas:
        value.observedPlaquetteKSpaceAreas as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
