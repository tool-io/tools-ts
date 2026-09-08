import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedScarpCrossSectionStationsM: readonly number[];
  readonly observedScarpCrossSectionAreasM2: readonly number[];
  readonly callerIndependentSourceToDepositBulkingRatio: number;
}>;
export type Output = Readonly<{
  readonly observedSourceScarpVolumeM3: number;
  readonly callerBulkedDepositScenarioM3: number;
}>;
const inputFields = [
  {
    id: "observedScarpCrossSectionStationsM",
    label: "Observed scarp cross section stations m",
    kind: "numberList",
  },
  {
    id: "observedScarpCrossSectionAreasM2",
    label: "Observed scarp cross section areas m2",
    kind: "numberList",
  },
  {
    id: "callerIndependentSourceToDepositBulkingRatio",
    label: "Caller independent source to deposit bulking ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentSourceToDepositBulkingRatio,
    "callerIndependentSourceToDepositBulkingRatio",
  );
  input.observedScarpCrossSectionStationsM.forEach((v) =>
    nonnegative(v, "observedScarpCrossSectionStationsM"),
  );
  input.observedScarpCrossSectionAreasM2.forEach((v) =>
    nonnegative(v, "observedScarpCrossSectionAreasM2"),
  );
  const source = integral(
    input.observedScarpCrossSectionStationsM,
    input.observedScarpCrossSectionAreasM2,
  );
  return {
    observedSourceScarpVolumeM3: source,
    callerBulkedDepositScenarioM3:
      source * input.callerIndependentSourceToDepositBulkingRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScarpCrossSectionStationsM: [0, 1, 3],
  observedScarpCrossSectionAreasM2: [1, 2, 0],
  callerIndependentSourceToDepositBulkingRatio: 2,
} satisfies Input;
export const exampleOutput = {
  observedSourceScarpVolumeM3: 3.5,
  callerBulkedDepositScenarioM3: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/sector-collapse-scarp-volume-estimate",
  title: "Sector Collapse Scarp Volume Estimate Calculator",
  description:
    "Integrate independently mapped scarp source sections and explicit bulking scenario, not area-times-uniform-thickness deposit tool or future collapse prediction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSourceScarpVolumeM3",
      label: "Observed source scarp volume m3",
      kind: "number",
    },
    {
      id: "callerBulkedDepositScenarioM3",
      label: "Caller bulked deposit scenario m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedScarpCrossSectionStationsM:
        value.observedScarpCrossSectionStationsM as readonly number[],
      observedScarpCrossSectionAreasM2:
        value.observedScarpCrossSectionAreasM2 as readonly number[],
      callerIndependentSourceToDepositBulkingRatio:
        value.callerIndependentSourceToDepositBulkingRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
