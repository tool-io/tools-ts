import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedLocalRelativeSeaLevelMmYear: number;
  readonly callerIndependentGlobalAbsoluteMmYear: number;
  readonly callerIndependentLandUpliftMmYear: number;
}>;
export type Output = Readonly<{
  readonly localAbsoluteSeaLevelMmYear: number;
  readonly signedLocalOceanResidualMmYear: number;
}>;
const inputFields = [
  {
    id: "observedLocalRelativeSeaLevelMmYear",
    label: "Observed local relative sea level mm year",
    kind: "number",
  },
  {
    id: "callerIndependentGlobalAbsoluteMmYear",
    label: "Caller independent global absolute mm year",
    kind: "number",
  },
  {
    id: "callerIndependentLandUpliftMmYear",
    label: "Caller independent land uplift mm year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const absolute =
    input.observedLocalRelativeSeaLevelMmYear +
    input.callerIndependentLandUpliftMmYear;
  return {
    localAbsoluteSeaLevelMmYear: absolute,
    signedLocalOceanResidualMmYear:
      absolute - input.callerIndependentGlobalAbsoluteMmYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLocalRelativeSeaLevelMmYear: 5,
  callerIndependentGlobalAbsoluteMmYear: 3,
  callerIndependentLandUpliftMmYear: 1,
} satisfies Input;
export const exampleOutput = {
  localAbsoluteSeaLevelMmYear: 6,
  signedLocalOceanResidualMmYear: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/local-vs-global-sea-level-split",
  title: "Local vs Global Sea Level Split Calculator",
  description:
    "Relative rise plus independently positive land uplift→absolute ocean rise, subtract independently matched global trend, not fitted trend or causal attribution. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "localAbsoluteSeaLevelMmYear",
      label: "Local absolute sea level mm year",
      kind: "number",
    },
    {
      id: "signedLocalOceanResidualMmYear",
      label: "Signed local ocean residual mm year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLocalRelativeSeaLevelMmYear:
        value.observedLocalRelativeSeaLevelMmYear as number,
      callerIndependentGlobalAbsoluteMmYear:
        value.callerIndependentGlobalAbsoluteMmYear as number,
      callerIndependentLandUpliftMmYear:
        value.callerIndependentLandUpliftMmYear as number,
    }),
});
export const run = tool.execute;
export default tool;
