import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDispersionGradientMSecond: number;
  readonly callerMeanFreshwaterVelocityMSecond: number;
}>;
export type Output = Readonly<{ readonly signedVanDenBurghK: number }>;
const inputFields = [
  {
    id: "observedDispersionGradientMSecond",
    label: "Observed dispersion gradient m second",
    kind: "number",
  },
  {
    id: "callerMeanFreshwaterVelocityMSecond",
    label: "Caller mean freshwater velocity m second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMeanFreshwaterVelocityMSecond,
    "callerMeanFreshwaterVelocityMSecond",
  );
  return {
    signedVanDenBurghK:
      -input.observedDispersionGradientMSecond /
      input.callerMeanFreshwaterVelocityMSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDispersionGradientMSecond: 2,
  callerMeanFreshwaterVelocityMSecond: 4,
} satisfies Input;
export const exampleOutput = { signedVanDenBurghK: -0.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/van-den-burgh-k-intrusion-parameter",
  title: "Van Den Burgh K Intrusion Parameter Calculator",
  description:
    "Infer local Van den Burgh dD/dx=−Ku convention withx upstream and positive seaward residual speed, signed K retained; no intrusion-length law invented. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedVanDenBurghK",
      label: "Signed van den burgh k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDispersionGradientMSecond:
        value.observedDispersionGradientMSecond as number,
      callerMeanFreshwaterVelocityMSecond:
        value.callerMeanFreshwaterVelocityMSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
