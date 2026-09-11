import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredDissolvedFreeCo2MolPerLiter: number;
  readonly callerMatchedHenryCoefficientMolPerLiterAtmosphere: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredDissolvedFreeCo2MolPerLiter",
    label: "Actual measured dissolved free co2 mol per liter",
    kind: "number",
  },
  {
    id: "callerMatchedHenryCoefficientMolPerLiterAtmosphere",
    label: "Caller matched henry coefficient mol per liter atmosphere",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMeasuredDissolvedFreeCo2MolPerLiter,
    "actualMeasuredDissolvedFreeCo2MolPerLiter",
  );
  positive(
    input.callerMatchedHenryCoefficientMolPerLiterAtmosphere,
    "callerMatchedHenryCoefficientMolPerLiterAtmosphere",
  );
  return {
    value:
      input.actualMeasuredDissolvedFreeCo2MolPerLiter /
      input.callerMatchedHenryCoefficientMolPerLiterAtmosphere,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredDissolvedFreeCo2MolPerLiter: 4,
    callerMatchedHenryCoefficientMolPerLiterAtmosphere: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/pco2",
  title: "pCO2 Calculator",
  description:
    "ExplicitfreeCO2 dissolved concentration/Henry solubility coefficient pressureatm, pCO2NOT total inorganic carbon or globalpHconversion; temperature/salinity/coefficient external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
