import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedEquivalentDoseGy: number;
  readonly callerIndependentlyMatchedAverageDoseRateGyPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyResolvedEquivalentDoseGy",
    label: "Actual independently resolved equivalent dose gy",
    kind: "number",
  },
  {
    id: "callerIndependentlyMatchedAverageDoseRateGyPerYear",
    label: "Caller independently matched average dose rate gy per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentlyResolvedEquivalentDoseGy, "numerator");
  positive(
    input.callerIndependentlyMatchedAverageDoseRateGyPerYear,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualIndependentlyResolvedEquivalentDoseGy) /
      input.callerIndependentlyMatchedAverageDoseRateGyPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyResolvedEquivalentDoseGy: 2,
    callerIndependentlyMatchedAverageDoseRateGyPerYear: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/electron-spin-resonance-age",
  title: "Geology Electron Spin Resonance Age Calculator",
  description:
    "electron-spin resonance actual equivalent-dose/dose-rate age under independently resolved fading, uptake, water and saturation assumptions. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
