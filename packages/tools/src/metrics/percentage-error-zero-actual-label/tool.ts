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
  return H.finish({
    defined: i.actual !== 0,
    percentageError:
      i.actual === 0 ? 0 : (100 * (i.forecast - i.actual)) / Math.abs(i.actual),
    zeroActual: i.actual === 0,
  });
};
export const example = {
  input: { actual: 0, forecast: 2 },
  output: { result: { defined: false, percentageError: 0, zeroActual: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/percentage-error-zero-actual-label",
  title: "Metrics: Percentage Error Zero Actual Label Tool",
  description:
    "Compute signed percentage forecast error with an explicit undefined flag and unused zero when actual is zero; does not silently claim zero error.",
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
          defined: { type: "boolean" },
          percentageError: { type: "number" },
          zeroActual: { type: "boolean" },
        },
        required: ["defined", "percentageError", "zeroActual"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
