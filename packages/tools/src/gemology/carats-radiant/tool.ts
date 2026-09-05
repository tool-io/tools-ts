import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRadiantDepthStationsMm: readonly number[];
  readonly observedRadiantSectionAreasMM2: readonly number[];
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly observedIntegratedRadiantVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  {
    id: "observedRadiantDepthStationsMm",
    label: "Observed radiant depth stations mm",
    kind: "numberList",
  },
  {
    id: "observedRadiantSectionAreasMM2",
    label: "Observed radiant section areas m m2",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  input.observedRadiantSectionAreasMM2.forEach((v) =>
    nonnegative(v, "observedRadiantSectionAreasMM2"),
  );
  const v = integral(
    input.observedRadiantDepthStationsMm,
    input.observedRadiantSectionAreasMM2,
  );
  return {
    observedIntegratedRadiantVolumeMM3: v,
    conditionalMassCarats: (v * input.independentlyMeasuredDensityGCM3) / 200,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRadiantDepthStationsMm: [0, 2, 4],
  observedRadiantSectionAreasMM2: [0, 40, 0],
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  observedIntegratedRadiantVolumeMM3: 80,
  conditionalMassCarats: 1.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-radiant",
  title: "Radiant Cut Carat Weight Estimator",
  description:
    "Radiant-cut mass from actually measured cross-section profile integration, not identical clipped-outline emerald proxy or undocumentedshape factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIntegratedRadiantVolumeMM3",
      label: "Observed integrated radiant volume m m3",
      kind: "number",
    },
    {
      id: "conditionalMassCarats",
      label: "Conditional mass carats",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRadiantDepthStationsMm:
        value.observedRadiantDepthStationsMm as readonly number[],
      observedRadiantSectionAreasMM2:
        value.observedRadiantSectionAreasMM2 as readonly number[],
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
