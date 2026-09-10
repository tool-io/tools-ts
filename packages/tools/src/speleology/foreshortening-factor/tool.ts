import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{ readonly actualInclinationDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInclinationDegrees",
    label: "Actual inclination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (Math.abs(input.actualInclinationDegrees) > 90)
    simpleError("angle", "Actual inclination±90.");
  return {
    conditionalPlanToSlopeForeshorteningFactor: Math.cos(
      (input.actualInclinationDegrees * Math.PI) / 180,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInclinationDegrees: 60 },
  output: { result: { conditionalPlanToSlopeForeshorteningFactor: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/foreshortening-factor",
  title: "Plan-to-Elevation Foreshortening Factor Calculator",
  description:
    "Declared plan horizontal length/slope length cosinefactor, not ratio to an arbitrary projected extended-elevation orientation. Actual signed inclination independently calibrated.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
