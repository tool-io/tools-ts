import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualUsableCalciumCarbideMassGrams: number;
  readonly callerIndependentlyMeasuredCarbideConsumptionGramsPerHour: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUsableCalciumCarbideMassGrams",
    label: "Actual usable calcium carbide mass grams",
    kind: "number",
  },
  {
    id: "callerIndependentlyMeasuredCarbideConsumptionGramsPerHour",
    label: "Caller independently measured carbide consumption grams per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualUsableCalciumCarbideMassGrams, "numerator");
  positive(
    input.callerIndependentlyMeasuredCarbideConsumptionGramsPerHour,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualUsableCalciumCarbideMassGrams) /
      input.callerIndependentlyMeasuredCarbideConsumptionGramsPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUsableCalciumCarbideMassGrams: 2,
    callerIndependentlyMeasuredCarbideConsumptionGramsPerHour: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/carbide-lamp-burn-time",
  title: "Carbide Lamp Burn Time Calculator",
  description:
    "Conditional actual usable carbide/independently measured rate runtime; not lamp operation instructions or safe acetylene handling. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
