import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedUniaxialYieldPa: number;
  readonly observedCasingAxialStressPa: number;
  readonly observedCasingHoopStressPa: number;
}>;
export type Output = Readonly<{
  readonly idealVonMisesPositiveHoopYieldRootPa: number;
  readonly signedHoopRootMarginPa: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedUniaxialYieldPa",
    label: "Caller verified uniaxial yield pa",
    kind: "number",
  },
  {
    id: "observedCasingAxialStressPa",
    label: "Observed casing axial stress pa",
    kind: "number",
  },
  {
    id: "observedCasingHoopStressPa",
    label: "Observed casing hoop stress pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerVerifiedUniaxialYieldPa,
    "callerVerifiedUniaxialYieldPa",
  );
  if (
    Math.abs(input.observedCasingAxialStressPa) >
    input.callerVerifiedUniaxialYieldPa
  )
    simpleError(
      "branch",
      "Axial magnitude≤independently verified yield on this positive hoop-root branch.",
    );
  const root =
    (input.observedCasingAxialStressPa +
      Math.sqrt(
        4 * input.callerVerifiedUniaxialYieldPa ** 2 -
          3 * input.observedCasingAxialStressPa ** 2,
      )) /
    2;
  return {
    idealVonMisesPositiveHoopYieldRootPa: root,
    signedHoopRootMarginPa: root - input.observedCasingHoopStressPa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedUniaxialYieldPa: 100,
  observedCasingAxialStressPa: 20,
  observedCasingHoopStressPa: 50,
} satisfies Input;
export const exampleOutput = {
  idealVonMisesPositiveHoopYieldRootPa: 108.48857801796105,
  signedHoopRootMarginPa: 58.488578017961046,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/casing-biaxial-correction",
  title: "Petroleum Casing Biaxial Correction Calculator",
  description:
    "Explicit plane-stress von-Mises positive hoop yield root under independently known axial stress/yield, signed measured margin only; not manufacturer biaxial burst/collapse rating, connection strength or casing safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealVonMisesPositiveHoopYieldRootPa",
      label: "Ideal von mises positive hoop yield root pa",
      kind: "number",
    },
    {
      id: "signedHoopRootMarginPa",
      label: "Signed hoop root margin pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedUniaxialYieldPa:
        value.callerVerifiedUniaxialYieldPa as number,
      observedCasingAxialStressPa: value.observedCasingAxialStressPa as number,
      observedCasingHoopStressPa: value.observedCasingHoopStressPa as number,
    }),
});
export const run = tool.execute;
export default tool;
