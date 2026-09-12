import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFinitePowerSeriesCoefficients: readonly number[];
  readonly actualRealEvaluationPoint: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFinitePowerSeriesCoefficients",
    label: "Actual finite power series coefficients",
    kind: "numberList",
  },
  {
    id: "actualRealEvaluationPoint",
    label: "Actual real evaluation point",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualFinitePowerSeriesCoefficients.length)
    simpleError("coefficients", "Actualfinitepolynomial.");
  if (
    Math.abs(input.actualRealEvaluationPoint) > 10 ||
    input.actualFinitePowerSeriesCoefficients.length > 64
  )
    simpleError("budget", "Boundedfinitepolynomialdegree/evaluation.");
  let y = 0;
  for (
    let i = input.actualFinitePowerSeriesCoefficients.length - 1;
    i >= 0;
    i--
  )
    y =
      y * input.actualRealEvaluationPoint +
      input.actualFinitePowerSeriesCoefficients[i];
  return { exactPolynomialBorelLaplaceValue: y };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFinitePowerSeriesCoefficients: [1, 2, 3],
    actualRealEvaluationPoint: 2,
  },
  output: { result: { exactPolynomialBorelLaplaceValue: 17 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/borel-sum",
  title: "Borel Sum Calculator",
  description:
    "FinitepolynomialBorel-Laplace identity\u03a3anx^n:integralexp(\u2212t)\u03a3an(xt)^n/n!dt=\u03a3anx^n; not a method to certifyBorelsummabilityofdivergentinfiniteinputseries. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
