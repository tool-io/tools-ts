import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly temperatureKelvin: number;
  readonly outsidePh: number;
  readonly insidePh: number;
  readonly independentlyMeasuredInsideMinusOutsidePotentialVolts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
  { id: "outsidePh", label: "Outside ph", kind: "number" },
  { id: "insidePh", label: "Inside ph", kind: "number" },
  {
    id: "independentlyMeasuredInsideMinusOutsidePotentialVolts",
    label: "Independently measured inside minus outside potential volts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.temperatureKelvin, "temperature");
  if ([input.insidePh, input.outsidePh].some((v) => v < 0 || v > 14))
    simpleError("pH", "Restricted0–14aqueous pHmodel.");
  return {
    conditionalInsideMinusOutsideProtonElectrochemicalPotentialVolts:
      input.independentlyMeasuredInsideMinusOutsidePotentialVolts -
      0.00008617333262145 *
        input.temperatureKelvin *
        Math.log(10) *
        (input.insidePh - input.outsidePh),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    temperatureKelvin: 300,
    outsidePh: 6,
    insidePh: 7,
    independentlyMeasuredInsideMinusOutsidePotentialVolts: 0,
  },
  output: {
    result: {
      conditionalInsideMinusOutsideProtonElectrochemicalPotentialVolts:
        -0.05952642933233049,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/vent-ph-gradient-pmf-estimate",
  title:
    "Hydrothermal Vent pH Gradient Proton Motive Force Estimate Calculator",
  description:
    "Proton electrochemical potential inside-minus-outside \u0394\u03c8\u22122.303RT/F\u0394pH, sign explicit. Independently measured compatible gradient/temperature; not available ATP, growth, membrane feasibility or universal vent energy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
