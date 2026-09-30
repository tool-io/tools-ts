import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  actual: number;
  forecast: number;
  zeroPairPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "Actual", kind: "number" },
  { id: "forecast", label: "Forecast", kind: "number" },
  {
    id: "zeroPairPolicy",
    label: "Zero pair policy",
    kind: "string",
    enum: ["zero", "reject"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.zeroPairPolicy, ["zero", "reject"]);
  const den = Math.abs(i.actual) + Math.abs(i.forecast);
  H.check(den > 0 || i.zeroPairPolicy === "zero");
  return H.finish({
    defined: den > 0,
    smapeFraction: den > 0 ? (2 * Math.abs(i.forecast - i.actual)) / den : 0,
  });
};
export const example = {
  input: { actual: 0, forecast: 0, zeroPairPolicy: "zero" },
  output: { result: { defined: false, smapeFraction: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/smape-single-pair-zero-policy",
  title: "Metrics: Smape Single Pair Zero Policy Tool",
  description:
    "Compute a single symmetric absolute percentage-error fraction using absolute magnitudes, with explicit zero/reject policy for an all-zero pair.",
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
          smapeFraction: { type: "number" },
        },
        required: ["defined", "smapeFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
