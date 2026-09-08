import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAvalancheDepositCellAreasM2: readonly number[];
  readonly observedDepositThicknessLowerM: readonly number[];
  readonly observedDepositThicknessUpperM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDepositVolumeLowerM3: number;
  readonly observedDepositVolumeUpperM3: number;
}>;
const inputFields = [
  {
    id: "observedAvalancheDepositCellAreasM2",
    label: "Observed avalanche deposit cell areas m2",
    kind: "numberList",
  },
  {
    id: "observedDepositThicknessLowerM",
    label: "Observed deposit thickness lower m",
    kind: "numberList",
  },
  {
    id: "observedDepositThicknessUpperM",
    label: "Observed deposit thickness upper m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAvalancheDepositCellAreasM2.forEach((v) =>
    positive(v, "observedAvalancheDepositCellAreasM2"),
  );
  input.observedDepositThicknessLowerM.forEach((v) =>
    nonnegative(v, "observedDepositThicknessLowerM"),
  );
  input.observedDepositThicknessUpperM.forEach((v) =>
    nonnegative(v, "observedDepositThicknessUpperM"),
  );
  aligned(
    input.observedAvalancheDepositCellAreasM2,
    input.observedDepositThicknessLowerM,
    "observedAvalancheDepositCellAreasM2",
  );
  aligned(
    input.observedAvalancheDepositCellAreasM2,
    input.observedDepositThicknessUpperM,
    "observedAvalancheDepositCellAreasM2",
  );
  input.observedDepositThicknessLowerM.forEach((v, i) =>
    ordered(v, input.observedDepositThicknessUpperM[i]),
  );
  return {
    observedDepositVolumeLowerM3: sum(
      input.observedAvalancheDepositCellAreasM2.map(
        (v, i) => v * input.observedDepositThicknessLowerM[i],
      ),
    ),
    observedDepositVolumeUpperM3: sum(
      input.observedAvalancheDepositCellAreasM2.map(
        (v, i) => v * input.observedDepositThicknessUpperM[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAvalancheDepositCellAreasM2: [10, 20],
  observedDepositThicknessLowerM: [1, 2],
  observedDepositThicknessUpperM: [2, 3],
} satisfies Input;
export const exampleOutput = {
  observedDepositVolumeLowerM3: 50,
  observedDepositVolumeUpperM3: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/volcanic-debris-avalanche-volume",
  title: "Volcanic Debris Avalanche Volume Calculator",
  description:
    "Bound completed independently mapped avalanche deposit using explicit cell thickness intervals, not runout/hazard or single uniform slab volume. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDepositVolumeLowerM3",
      label: "Observed deposit volume lower m3",
      kind: "number",
    },
    {
      id: "observedDepositVolumeUpperM3",
      label: "Observed deposit volume upper m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAvalancheDepositCellAreasM2:
        value.observedAvalancheDepositCellAreasM2 as readonly number[],
      observedDepositThicknessLowerM:
        value.observedDepositThicknessLowerM as readonly number[],
      observedDepositThicknessUpperM:
        value.observedDepositThicknessUpperM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
