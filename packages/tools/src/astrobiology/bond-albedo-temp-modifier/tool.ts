import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly baselineTemperatureK: number;
  readonly baselineAlbedo: number;
  readonly revisedAlbedo: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "baselineTemperatureK",
    label: "Baseline temperature k",
    kind: "number",
  },
  { id: "baselineAlbedo", label: "Baseline albedo", kind: "number" },
  { id: "revisedAlbedo", label: "Revised albedo", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.baselineTemperatureK, "temperature");
  fraction(i.baselineAlbedo, "baseline");
  fraction(i.revisedAlbedo, "revised");
  if (i.baselineAlbedo === 1) simpleError("albedo", "Nonunit baseline albedo.");
  return {
    modifiedRadiativeTemperatureK:
      i.baselineTemperatureK *
      ((1 - i.revisedAlbedo) / (1 - i.baselineAlbedo)) ** 0.25,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    baselineTemperatureK: 300,
    baselineAlbedo: 0,
    revisedAlbedo: 0.9375,
  },
  output: { result: { modifiedRadiativeTemperatureK: 150 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/bond-albedo-temp-modifier",
  title: "Bond Albedo Adjustment Surface Temperature Modifier Calculator",
  description:
    "Relative radiative-equilibrium temperature modifier at fixed insolation/redistribution; not actual greenhouse surface temperature.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { modifiedRadiativeTemperatureK: { type: "number" } },
        required: ["modifiedRadiativeTemperatureK"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
