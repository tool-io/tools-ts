import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ actual: number; forecast: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "Actual", kind: "number" },
  { id: "forecast", label: "Forecast", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.actual >= 0 && i.forecast >= 0);
  const delta = Math.log1p(i.forecast) - Math.log1p(i.actual);
  return H.finish({
    logResidual: delta,
    squaredLogResidual: delta * delta,
    rootSingleSquaredLogError: Math.abs(delta),
  });
};
export const example = {
  input: { actual: 0, forecast: 1 },
  output: {
    result: {
      logResidual: 0.6931471805599453,
      squaredLogResidual: 0.4804530139182014,
      rootSingleSquaredLogError: 0.6931471805599453,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/rmsle-single-pair-domain-check",
  title: "Metrics: Rmsle Single Pair Domain Check Tool",
  description:
    "Return the one-pair log1p residual and squared contribution behind RMSLE for nonnegative values, not an aggregated metric or silent clipping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logResidual: { type: "number" },
          rootSingleSquaredLogError: { type: "number" },
          squaredLogResidual: { type: "number" },
        },
        required: [
          "logResidual",
          "rootSingleSquaredLogError",
          "squaredLogResidual",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
