import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedPlatformReportableGrossMinor: number;
  readonly callerVerifiedPlatformReportableGrossThresholdMinor: number;
}>;
export type Output = Readonly<{
  readonly signedThresholdExcessMinor: number;
  readonly callerThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedPlatformReportableGrossMinor",
    label: "Observed platform reportable gross minor",
    kind: "number",
  },
  {
    id: "callerVerifiedPlatformReportableGrossThresholdMinor",
    label: "Caller verified platform reportable gross threshold minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.observedPlatformReportableGrossMinor,
    "observedPlatformReportableGrossMinor",
  );
  money(
    input.callerVerifiedPlatformReportableGrossThresholdMinor,
    "callerVerifiedPlatformReportableGrossThresholdMinor",
  );
  return {
    signedThresholdExcessMinor: signedSum([
      input.observedPlatformReportableGrossMinor,
      -input.callerVerifiedPlatformReportableGrossThresholdMinor,
    ]),
    callerThresholdReached:
      input.observedPlatformReportableGrossMinor >=
      input.callerVerifiedPlatformReportableGrossThresholdMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlatformReportableGrossMinor: 120,
  callerVerifiedPlatformReportableGrossThresholdMinor: 100,
} satisfies Input;
export const exampleOutput = {
  signedThresholdExcessMinor: 20,
  callerThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/form-1099k-platform-threshold-checker",
  title: "Form 1099K Platform Threshold Checker",
  description:
    "Independently reportable platform gross against caller applicable Form1099Kthreshold, no net-income or actual reporting duty. Integer minor units one caller currency, explicit inclusive threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedThresholdExcessMinor",
      label: "Signed threshold excess minor",
      kind: "number",
    },
    {
      id: "callerThresholdReached",
      label: "Caller threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlatformReportableGrossMinor:
        value.observedPlatformReportableGrossMinor as number,
      callerVerifiedPlatformReportableGrossThresholdMinor:
        value.callerVerifiedPlatformReportableGrossThresholdMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
