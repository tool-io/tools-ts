import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly cupMeanDiameterM: number;
  readonly cupWallHeightM: number;
  readonly callerIndependentlyAccountedTrimAreaM2: number;
}>;
export type Output = Readonly<{
  readonly equalThicknessDeepDrawBlankDiameterM: number;
}>;
const inputFields = [
  { id: "cupMeanDiameterM", label: "Cup mean diameter m", kind: "number" },
  { id: "cupWallHeightM", label: "Cup wall height m", kind: "number" },
  {
    id: "callerIndependentlyAccountedTrimAreaM2",
    label: "Caller independently accounted trim area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cupMeanDiameterM, "cupMeanDiameterM");
  nonnegative(input.cupWallHeightM, "cupWallHeightM");
  nonnegative(
    input.callerIndependentlyAccountedTrimAreaM2,
    "callerIndependentlyAccountedTrimAreaM2",
  );
  return {
    equalThicknessDeepDrawBlankDiameterM: Math.sqrt(
      input.cupMeanDiameterM ** 2 +
        4 * input.cupMeanDiameterM * input.cupWallHeightM +
        (4 * input.callerIndependentlyAccountedTrimAreaM2) / Math.PI,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cupMeanDiameterM: 2,
  cupWallHeightM: 3,
  callerIndependentlyAccountedTrimAreaM2: 0,
} satisfies Input;
export const exampleOutput = {
  equalThicknessDeepDrawBlankDiameterM: 5.291502622129181,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/deep-drawing-blank-diameter",
  title: "Deep Drawing Blank Diameter Calculator",
  description:
    "Equal-thickness cup base+wall area conservation with independent trim area; no drawability, corner radii or thinning inference. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "equalThicknessDeepDrawBlankDiameterM",
      label: "Equal thickness deep draw blank diameter m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cupMeanDiameterM: value.cupMeanDiameterM as number,
      cupWallHeightM: value.cupWallHeightM as number,
      callerIndependentlyAccountedTrimAreaM2:
        value.callerIndependentlyAccountedTrimAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
