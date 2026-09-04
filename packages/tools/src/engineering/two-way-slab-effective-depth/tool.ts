import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTotalSlabDepthM: number;
  readonly observedBottomCoverM: number;
  readonly observedTwoOrthogonalBarDiametersM: readonly number[];
}>;
export type Output = Readonly<{
  readonly twoWaySecondLayerEffectiveDepthM: number;
}>;
const inputFields = [
  {
    id: "observedTotalSlabDepthM",
    label: "Observed total slab depth m",
    kind: "number",
  },
  {
    id: "observedBottomCoverM",
    label: "Observed bottom cover m",
    kind: "number",
  },
  {
    id: "observedTwoOrthogonalBarDiametersM",
    label: "Observed two orthogonal bar diameters m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedTotalSlabDepthM, "observedTotalSlabDepthM");
  input.observedTwoOrthogonalBarDiametersM.forEach((v) =>
    positive(v, "observedTwoOrthogonalBarDiametersM"),
  );
  nonnegative(input.observedBottomCoverM, "observedBottomCoverM");
  if (input.observedTwoOrthogonalBarDiametersM.length !== 2)
    simpleError("bars", "Exactly first/second orthogonal bar layers.");
  return {
    twoWaySecondLayerEffectiveDepthM: positive(
      input.observedTotalSlabDepthM -
        input.observedBottomCoverM -
        input.observedTwoOrthogonalBarDiametersM[0] -
        input.observedTwoOrthogonalBarDiametersM[1] / 2,
      "remaining effective depth",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTotalSlabDepthM: 0.3,
  observedBottomCoverM: 0.05,
  observedTwoOrthogonalBarDiametersM: [0.02, 0.02],
} satisfies Input;
export const exampleOutput = {
  twoWaySecondLayerEffectiveDepthM: 0.22,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/two-way-slab-effective-depth",
  title: "Two-Way Slab Effective Depth Calculator",
  description:
    "Actual second orthogonal bar-layer centroid effective depth, no code-selected thickness or punching perimeter. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "twoWaySecondLayerEffectiveDepthM",
      label: "Two way second layer effective depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTotalSlabDepthM: value.observedTotalSlabDepthM as number,
      observedBottomCoverM: value.observedBottomCoverM as number,
      observedTwoOrthogonalBarDiametersM:
        value.observedTwoOrthogonalBarDiametersM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
