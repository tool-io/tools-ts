import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedMixtureSpecificEnthalpyKjKg: readonly number[];
  readonly callerMatchedSaturatedLiquidEnthalpyKjKg: number;
  readonly callerMatchedSaturatedVaporEnthalpyKjKg: number;
}>;
export type Output = Readonly<{
  readonly inferredSteamVaporMassFractions: readonly number[];
  readonly withinCallerSaturationEnthalpyEnvelopeFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMixtureSpecificEnthalpyKjKg",
    label: "Observed mixture specific enthalpy kj kg",
    kind: "numberList",
  },
  {
    id: "callerMatchedSaturatedLiquidEnthalpyKjKg",
    label: "Caller matched saturated liquid enthalpy kj kg",
    kind: "number",
  },
  {
    id: "callerMatchedSaturatedVaporEnthalpyKjKg",
    label: "Caller matched saturated vapor enthalpy kj kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerMatchedSaturatedVaporEnthalpyKjKg <=
    input.callerMatchedSaturatedLiquidEnthalpyKjKg
  )
    simpleError(
      "enthalpy",
      "Distinct ordered same-pressure liquid/vapor enthalpy required.",
    );
  const quality = input.observedMixtureSpecificEnthalpyKjKg.map(
    (v) =>
      (v - input.callerMatchedSaturatedLiquidEnthalpyKjKg) /
      (input.callerMatchedSaturatedVaporEnthalpyKjKg -
        input.callerMatchedSaturatedLiquidEnthalpyKjKg),
  );
  return {
    inferredSteamVaporMassFractions: quality,
    withinCallerSaturationEnthalpyEnvelopeFlags: quality.map((v) =>
      v >= 0 && v <= 1 ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMixtureSpecificEnthalpyKjKg: [1500, 2600],
  callerMatchedSaturatedLiquidEnthalpyKjKg: 500,
  callerMatchedSaturatedVaporEnthalpyKjKg: 2500,
} satisfies Input;
export const exampleOutput = {
  inferredSteamVaporMassFractions: [0.5, 1.05],
  withinCallerSaturationEnthalpyEnvelopeFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-quality",
  title: "Plumbing Steam Quality Calculator",
  description:
    "Infer actual enthalpy-based saturated-mixture quality on caller same-pressure liquid/vapor endpoints, preserve out-of-envelope superheat/measurement evidence; not property database or steam operation safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSteamVaporMassFractions",
      label: "Inferred steam vapor mass fractions",
      kind: "numberList",
    },
    {
      id: "withinCallerSaturationEnthalpyEnvelopeFlags",
      label: "Within caller saturation enthalpy envelope flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMixtureSpecificEnthalpyKjKg:
        value.observedMixtureSpecificEnthalpyKjKg as readonly number[],
      callerMatchedSaturatedLiquidEnthalpyKjKg:
        value.callerMatchedSaturatedLiquidEnthalpyKjKg as number,
      callerMatchedSaturatedVaporEnthalpyKjKg:
        value.callerMatchedSaturatedVaporEnthalpyKjKg as number,
    }),
});
export const run = tool.execute;
export default tool;
