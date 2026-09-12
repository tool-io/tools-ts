import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSoluteMassGrams: number;
  readonly actualFinalSolutionVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSoluteMassGrams",
    label: "Actual solute mass grams",
    kind: "number",
  },
  {
    id: "actualFinalSolutionVolumeMl",
    label: "Actual final solution volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSoluteMassGrams, "actualSoluteMassGrams");
  positive(input.actualFinalSolutionVolumeMl, "actualFinalSolutionVolumeMl");
  return {
    value:
      (100 * input.actualSoluteMassGrams) / input.actualFinalSolutionVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSoluteMassGrams: 5, actualFinalSolutionVolumeMl: 100 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/percent-strength-wv-from-grams",
  title: "Percent Strength w/v From Grams Calculator",
  description:
    "Explicit w/vpercent grams per100mL FINAL solution volume, not solvent volume or w/wdensity assumption. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
