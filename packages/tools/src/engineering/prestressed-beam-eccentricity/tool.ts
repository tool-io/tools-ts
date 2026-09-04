import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerRequiredPrestressCounterMomentNm: number;
  readonly observedRetainedPrestressForceN: number;
}>;
export type Output = Readonly<{
  readonly signedPrestressedBeamEccentricityM: number;
}>;
const inputFields = [
  {
    id: "callerRequiredPrestressCounterMomentNm",
    label: "Caller required prestress counter moment nm",
    kind: "number",
  },
  {
    id: "observedRetainedPrestressForceN",
    label: "Observed retained prestress force n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedRetainedPrestressForceN,
    "observedRetainedPrestressForceN",
  );
  return {
    signedPrestressedBeamEccentricityM:
      input.callerRequiredPrestressCounterMomentNm /
      input.observedRetainedPrestressForceN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRequiredPrestressCounterMomentNm: 20,
  observedRetainedPrestressForceN: 100,
} satisfies Input;
export const exampleOutput = {
  signedPrestressedBeamEccentricityM: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/prestressed-beam-eccentricity",
  title: "Prestressed Beam Eccentricity Calculator",
  description:
    "Invert independent counter-moment against observed retained tendon force, not tendon layout legality or combined section stress. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPrestressedBeamEccentricityM",
      label: "Signed prestressed beam eccentricity m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRequiredPrestressCounterMomentNm:
        value.callerRequiredPrestressCounterMomentNm as number,
      observedRetainedPrestressForceN:
        value.observedRetainedPrestressForceN as number,
    }),
});
export const run = tool.execute;
export default tool;
