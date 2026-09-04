import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDiametralInterferenceM: number;
  readonly interfaceDiameterM: number;
  readonly callerIndependentShaftDiametralComplianceMPerPa: number;
  readonly callerIndependentHubDiametralComplianceMPerPa: number;
}>;
export type Output = Readonly<{
  readonly compatibleInterferenceContactPressurePa: number;
  readonly observedRelativeDiametralInterference: number;
}>;
const inputFields = [
  {
    id: "observedDiametralInterferenceM",
    label: "Observed diametral interference m",
    kind: "number",
  },
  { id: "interfaceDiameterM", label: "Interface diameter m", kind: "number" },
  {
    id: "callerIndependentShaftDiametralComplianceMPerPa",
    label: "Caller independent shaft diametral compliance m per pa",
    kind: "number",
  },
  {
    id: "callerIndependentHubDiametralComplianceMPerPa",
    label: "Caller independent hub diametral compliance m per pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.interfaceDiameterM, "interfaceDiameterM");
  positive(
    input.callerIndependentShaftDiametralComplianceMPerPa,
    "callerIndependentShaftDiametralComplianceMPerPa",
  );
  positive(
    input.callerIndependentHubDiametralComplianceMPerPa,
    "callerIndependentHubDiametralComplianceMPerPa",
  );
  nonnegative(
    input.observedDiametralInterferenceM,
    "observedDiametralInterferenceM",
  );
  return {
    compatibleInterferenceContactPressurePa:
      input.observedDiametralInterferenceM /
      (input.callerIndependentShaftDiametralComplianceMPerPa +
        input.callerIndependentHubDiametralComplianceMPerPa),
    observedRelativeDiametralInterference:
      input.observedDiametralInterferenceM / input.interfaceDiameterM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDiametralInterferenceM: 0.002,
  interfaceDiameterM: 0.2,
  callerIndependentShaftDiametralComplianceMPerPa: 1e-6,
  callerIndependentHubDiametralComplianceMPerPa: 3e-6,
} satisfies Input;
export const exampleOutput = {
  compatibleInterferenceContactPressurePa: 500,
  observedRelativeDiametralInterference: 0.01,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/interference-fit-pressure",
  title: "Interference Fit Pressure Calculator",
  description:
    "Elastic compatibility of independently established shaft/hub DIAMETRAL compliance, not guessed Lamé support conditions or fitting instructions. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleInterferenceContactPressurePa",
      label: "Compatible interference contact pressure pa",
      kind: "number",
    },
    {
      id: "observedRelativeDiametralInterference",
      label: "Observed relative diametral interference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDiametralInterferenceM:
        value.observedDiametralInterferenceM as number,
      interfaceDiameterM: value.interfaceDiameterM as number,
      callerIndependentShaftDiametralComplianceMPerPa:
        value.callerIndependentShaftDiametralComplianceMPerPa as number,
      callerIndependentHubDiametralComplianceMPerPa:
        value.callerIndependentHubDiametralComplianceMPerPa as number,
    }),
});
export const run = tool.execute;
export default tool;
