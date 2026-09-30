import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  actual: number;
  forecast: number;
  convention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "Actual", kind: "number" },
  { id: "forecast", label: "Forecast", kind: "number" },
  {
    id: "convention",
    label: "Convention",
    kind: "string",
    enum: ["forecast-minus-actual", "actual-minus-forecast"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.convention, ["forecast-minus-actual", "actual-minus-forecast"]);
  return H.finish({
    error:
      i.convention === "forecast-minus-actual"
        ? i.forecast - i.actual
        : i.actual - i.forecast,
  });
};
export const example = {
  input: { actual: 3, forecast: 5, convention: "forecast-minus-actual" },
  output: { result: { error: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/forecast-error-sign-convention",
  title: "Metrics: Forecast Error Sign Convention Tool",
  description:
    "Evaluate signed forecast residual only under an explicit forecast-minus-actual or actual-minus-forecast convention; no fitted forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { error: { type: "number" } },
        required: ["error"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
