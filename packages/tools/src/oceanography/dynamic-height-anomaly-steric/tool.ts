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
  readonly observedPressureDbar: readonly number[];
  readonly observedSpecificVolumeAnomalyM3Kg: readonly number[];
  readonly gravityMSecond2: number;
}>;
export type Output = Readonly<{
  readonly dynamicHeightGeopotentialAnomalyM2Second2: number;
  readonly stericEquivalentHeightM: number;
}>;
const inputFields = [
  {
    id: "observedPressureDbar",
    label: "Observed pressure dbar",
    kind: "numberList",
  },
  {
    id: "observedSpecificVolumeAnomalyM3Kg",
    label: "Observed specific volume anomaly m3 kg",
    kind: "numberList",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gravityMSecond2, "gravityMSecond2");
  input.observedPressureDbar.forEach((v) =>
    nonnegative(v, "observedPressureDbar"),
  );
  const height =
    10000 *
    integral(
      input.observedPressureDbar,
      input.observedSpecificVolumeAnomalyM3Kg,
    );
  return {
    dynamicHeightGeopotentialAnomalyM2Second2: height,
    stericEquivalentHeightM: height / input.gravityMSecond2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPressureDbar: [0, 10, 30],
  observedSpecificVolumeAnomalyM3Kg: [1e-6, 2e-6, 0],
  gravityMSecond2: 10,
} satisfies Input;
export const exampleOutput = {
  dynamicHeightGeopotentialAnomalyM2Second2: 0.35,
  stericEquivalentHeightM: 0.035,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/dynamic-height-anomaly-steric",
  title: "Dynamic Height Anomaly Steric Calculator",
  description:
    "Integrate independently reference-matched specific volume anomaly over pressure with1dbar=10000Pa, explicit pressure interval/reference; not salinity-only or thermal component. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "dynamicHeightGeopotentialAnomalyM2Second2",
      label: "Dynamic height geopotential anomaly m2 second2",
      kind: "number",
    },
    {
      id: "stericEquivalentHeightM",
      label: "Steric equivalent height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPressureDbar: value.observedPressureDbar as readonly number[],
      observedSpecificVolumeAnomalyM3Kg:
        value.observedSpecificVolumeAnomalyM3Kg as readonly number[],
      gravityMSecond2: value.gravityMSecond2 as number,
    }),
});
export const run = tool.execute;
export default tool;
