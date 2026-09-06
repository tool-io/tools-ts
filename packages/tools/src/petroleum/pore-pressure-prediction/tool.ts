import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedOverburdenPa: number;
  readonly callerHydrostaticReferencePa: number;
  readonly observedSonicTransitUsFoot: number;
  readonly callerMatchedNormalSonicTransitUsFoot: number;
  readonly callerEatonSonicExponent: number;
}>;
export type Output = Readonly<{
  readonly eatonSonicModeledPorePressurePa: number;
}>;
const inputFields = [
  {
    id: "callerIndependentlyEstablishedOverburdenPa",
    label: "Caller independently established overburden pa",
    kind: "number",
  },
  {
    id: "callerHydrostaticReferencePa",
    label: "Caller hydrostatic reference pa",
    kind: "number",
  },
  {
    id: "observedSonicTransitUsFoot",
    label: "Observed sonic transit us foot",
    kind: "number",
  },
  {
    id: "callerMatchedNormalSonicTransitUsFoot",
    label: "Caller matched normal sonic transit us foot",
    kind: "number",
  },
  {
    id: "callerEatonSonicExponent",
    label: "Caller eaton sonic exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSonicTransitUsFoot, "observedSonicTransitUsFoot");
  positive(
    input.callerMatchedNormalSonicTransitUsFoot,
    "callerMatchedNormalSonicTransitUsFoot",
  );
  positive(input.callerEatonSonicExponent, "callerEatonSonicExponent");
  nonnegative(
    input.callerIndependentlyEstablishedOverburdenPa,
    "callerIndependentlyEstablishedOverburdenPa",
  );
  nonnegative(
    input.callerHydrostaticReferencePa,
    "callerHydrostaticReferencePa",
  );
  ordered(
    input.callerHydrostaticReferencePa,
    input.callerIndependentlyEstablishedOverburdenPa,
  );
  return {
    eatonSonicModeledPorePressurePa:
      input.callerIndependentlyEstablishedOverburdenPa -
      (input.callerIndependentlyEstablishedOverburdenPa -
        input.callerHydrostaticReferencePa) *
        (input.callerMatchedNormalSonicTransitUsFoot /
          input.observedSonicTransitUsFoot) **
          input.callerEatonSonicExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyEstablishedOverburdenPa: 100,
  callerHydrostaticReferencePa: 20,
  observedSonicTransitUsFoot: 2,
  callerMatchedNormalSonicTransitUsFoot: 1,
  callerEatonSonicExponent: 3,
} satisfies Input;
export const exampleOutput = {
  eatonSonicModeledPorePressurePa: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/pore-pressure-prediction",
  title: "Petroleum Pore Pressure Prediction Calculator",
  description:
    "Named Eaton SONIC normal/observed transit-time convention with explicit exponent (3 example), independently established overburden/hydrostatic pressures; not resistivity exponent, proven pore pressure or drilling safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "eatonSonicModeledPorePressurePa",
      label: "Eaton sonic modeled pore pressure pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyEstablishedOverburdenPa:
        value.callerIndependentlyEstablishedOverburdenPa as number,
      callerHydrostaticReferencePa:
        value.callerHydrostaticReferencePa as number,
      observedSonicTransitUsFoot: value.observedSonicTransitUsFoot as number,
      callerMatchedNormalSonicTransitUsFoot:
        value.callerMatchedNormalSonicTransitUsFoot as number,
      callerEatonSonicExponent: value.callerEatonSonicExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
