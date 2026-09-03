import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedVibratorOnSecondsByInsertion: readonly number[];
  readonly observedIndependentlyMappedAffectedVolumesM3: readonly number[];
  readonly callerIndependentOverlapVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly observedTotalVibrationSeconds: number;
  readonly overlapAdjustedExposureSecondsM3: number;
}>;
const inputFields = [
  {
    id: "observedVibratorOnSecondsByInsertion",
    label: "Observed vibrator on seconds by insertion",
    kind: "numberList",
  },
  {
    id: "observedIndependentlyMappedAffectedVolumesM3",
    label: "Observed independently mapped affected volumes m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentOverlapVolumeM3",
    label: "Caller independent overlap volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentlyMappedAffectedVolumesM3.forEach((v) =>
    positive(v, "observedIndependentlyMappedAffectedVolumesM3"),
  );
  input.observedVibratorOnSecondsByInsertion.forEach((v) =>
    nonnegative(v, "observedVibratorOnSecondsByInsertion"),
  );
  nonnegative(
    input.callerIndependentOverlapVolumeM3,
    "callerIndependentOverlapVolumeM3",
  );
  aligned(
    input.observedVibratorOnSecondsByInsertion,
    input.observedIndependentlyMappedAffectedVolumesM3,
    "observedVibratorOnSecondsByInsertion",
  );
  const volume =
    sum(input.observedIndependentlyMappedAffectedVolumesM3) -
    input.callerIndependentOverlapVolumeM3;
  positive(volume, "unique affected volume");
  const time = sum(input.observedVibratorOnSecondsByInsertion);
  return {
    observedTotalVibrationSeconds: time,
    overlapAdjustedExposureSecondsM3: time / volume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVibratorOnSecondsByInsertion: [2, 4],
  observedIndependentlyMappedAffectedVolumesM3: [1, 2],
  callerIndependentOverlapVolumeM3: 1,
} satisfies Input;
export const exampleOutput = {
  observedTotalVibrationSeconds: 6,
  overlapAdjustedExposureSecondsM3: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-vibration-time",
  title: "Concrete Vibration Time Calculator",
  description:
    "Audit completed vibration on-times per independently mapped unique affected volume, not recommended consolidation time or over-vibration safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTotalVibrationSeconds",
      label: "Observed total vibration seconds",
      kind: "number",
    },
    {
      id: "overlapAdjustedExposureSecondsM3",
      label: "Overlap adjusted exposure seconds m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVibratorOnSecondsByInsertion:
        value.observedVibratorOnSecondsByInsertion as readonly number[],
      observedIndependentlyMappedAffectedVolumesM3:
        value.observedIndependentlyMappedAffectedVolumesM3 as readonly number[],
      callerIndependentOverlapVolumeM3:
        value.callerIndependentOverlapVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
