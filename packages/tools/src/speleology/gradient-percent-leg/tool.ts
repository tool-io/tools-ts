import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSurveyLegInclinationDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSurveyLegInclinationDegrees",
    label: "Actual survey leg inclination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (Math.abs(input.actualSurveyLegInclinationDegrees) >= 90)
    simpleError("inclination", "Nonverticalleg−90<a<90.");
  return {
    conditionalSurveyLegGradientPercent:
      100 * Math.tan((input.actualSurveyLegInclinationDegrees * Math.PI) / 180),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSurveyLegInclinationDegrees: 45 },
  output: { result: { conditionalSurveyLegGradientPercent: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/gradient-percent-leg",
  title: "Gradient Percent Along Survey Leg Calculator",
  description:
    "Signed caveleg vertical/horizontal gradient = 100 tan(inclination); not sine-normalized path gradient, vertical leg percentage or a safety limit.",
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
