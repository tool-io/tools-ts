import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSapLitres: readonly number[];
  readonly observedSapSugarMassFractions: readonly number[];
  readonly callerMatchedSapDensityKgL: readonly number[];
  readonly callerSyrupSugarMassFraction: number;
  readonly callerSyrupDensityKgL: number;
  readonly callerRecoveredSugarFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledSyrupLitres: number;
  readonly observedSapToModeledSyrupRatio: number;
}>;
const inputFields = [
  { id: "observedSapLitres", label: "Observed sap litres", kind: "numberList" },
  {
    id: "observedSapSugarMassFractions",
    label: "Observed sap sugar mass fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedSapDensityKgL",
    label: "Caller matched sap density kg l",
    kind: "numberList",
  },
  {
    id: "callerSyrupSugarMassFraction",
    label: "Caller syrup sugar mass fraction",
    kind: "number",
  },
  {
    id: "callerSyrupDensityKgL",
    label: "Caller syrup density kg l",
    kind: "number",
  },
  {
    id: "callerRecoveredSugarFractions",
    label: "Caller recovered sugar fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedSapDensityKgL.forEach((v) =>
    positive(v, "callerMatchedSapDensityKgL"),
  );
  positive(input.callerSyrupSugarMassFraction, "callerSyrupSugarMassFraction");
  positive(input.callerSyrupDensityKgL, "callerSyrupDensityKgL");
  input.observedSapLitres.forEach((v) => nonnegative(v, "observedSapLitres"));
  input.observedSapSugarMassFractions.forEach((v) =>
    fraction(v, "observedSapSugarMassFractions"),
  );
  fraction(input.callerSyrupSugarMassFraction, "callerSyrupSugarMassFraction");
  input.callerRecoveredSugarFractions.forEach((v) =>
    fraction(v, "callerRecoveredSugarFractions"),
  );
  aligned(
    input.observedSapLitres,
    input.observedSapSugarMassFractions,
    "observedSapLitres",
  );
  aligned(
    input.observedSapLitres,
    input.callerMatchedSapDensityKgL,
    "observedSapLitres",
  );
  aligned(
    input.observedSapLitres,
    input.callerRecoveredSugarFractions,
    "observedSapLitres",
  );
  const sugar = sum(
    input.observedSapLitres.map(
      (v, i) =>
        v *
        input.callerMatchedSapDensityKgL[i] *
        input.observedSapSugarMassFractions[i] *
        input.callerRecoveredSugarFractions[i],
    ),
  );
  positive(sugar, "recovered sugar");
  const syrup =
    sugar / input.callerSyrupSugarMassFraction / input.callerSyrupDensityKgL;
  return {
    modeledSyrupLitres: syrup,
    observedSapToModeledSyrupRatio: sum(input.observedSapLitres) / syrup,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSapLitres: [10, 20],
  observedSapSugarMassFractions: [0.02, 0.03],
  callerMatchedSapDensityKgL: [1, 1],
  callerSyrupSugarMassFraction: 0.6,
  callerSyrupDensityKgL: 1.2,
  callerRecoveredSugarFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  modeledSyrupLitres: 0.6944444444444444,
  observedSapToModeledSyrupRatio: 43.199999999999996,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/sap-to-syrup-conversion-ratio-liter-liter",
  title: "Sap-to-Syrup Liter Conversion Ratio",
  description:
    "Close actual sap sugar inventory through explicit recovery and independently established syrup concentration/density, no universal40:1 volume ratio or cooking/food-safety recipe. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "modeledSyrupLitres", label: "Modeled syrup litres", kind: "number" },
    {
      id: "observedSapToModeledSyrupRatio",
      label: "Observed sap to modeled syrup ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSapLitres: value.observedSapLitres as readonly number[],
      observedSapSugarMassFractions:
        value.observedSapSugarMassFractions as readonly number[],
      callerMatchedSapDensityKgL:
        value.callerMatchedSapDensityKgL as readonly number[],
      callerSyrupSugarMassFraction:
        value.callerSyrupSugarMassFraction as number,
      callerSyrupDensityKgL: value.callerSyrupDensityKgL as number,
      callerRecoveredSugarFractions:
        value.callerRecoveredSugarFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
