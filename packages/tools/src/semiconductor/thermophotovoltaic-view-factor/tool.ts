import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyEvaluatedEmitterPowerInterceptedByCell: number;
  readonly independentlyMatchedTotalEmitterHemisphericPower: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEvaluatedEmitterPowerInterceptedByCell",
    label: "Independently evaluated emitter power intercepted by cell",
    kind: "number",
  },
  {
    id: "independentlyMatchedTotalEmitterHemisphericPower",
    label: "Independently matched total emitter hemispheric power",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyEvaluatedEmitterPowerInterceptedByCell,
    "numerator",
  );
  positive(
    input.independentlyMatchedTotalEmitterHemisphericPower,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.independentlyEvaluatedEmitterPowerInterceptedByCell) /
      input.independentlyMatchedTotalEmitterHemisphericPower,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEvaluatedEmitterPowerInterceptedByCell: 2,
    independentlyMatchedTotalEmitterHemisphericPower: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/thermophotovoltaic-view-factor",
  title: "Semiconductor Thermophotovoltaic View Factor Calculator",
  description:
    "Actual independently assessed TPVgeometric intercepted-emitter power fraction, not assume radiative view factor from cell/emitter area alone. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
