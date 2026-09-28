import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  westDegrees: number;
  eastDegrees: number;
  equalEndpoints: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "westDegrees", label: "West degrees", kind: "number", unit: "deg" },
  { id: "eastDegrees", label: "East degrees", kind: "number", unit: "deg" },
  {
    id: "equalEndpoints",
    label: "Equal endpoints",
    kind: "string",
    enum: ["empty", "full"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.westDegrees, -180, 180);
  H.bounded(i.eastDegrees, -180, 180);
  H.choice(i.equalEndpoints, ["empty", "full"]);
  const raw = i.eastDegrees - i.westDegrees,
    span =
      raw === 0
        ? i.equalEndpoints === "full"
          ? 360
          : 0
        : raw === 360
          ? 360
          : H.mod(raw, 360);
  return H.finish({
    spanDegrees: span,
    crossesSeam: i.eastDegrees < i.westDegrees && span > 0,
  });
};
export const example = {
  input: { westDegrees: 170, eastDegrees: -170, equalEndpoints: "empty" },
  output: { result: { spanDegrees: 20, crossesSeam: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/longitude-interval-span-with-wrap",
  title: "Geography: Longitude Interval Span With Wrap Tool",
  description:
    "Compute eastward longitude span with an explicit equal-endpoint empty/full policy; a wrapped west/east interval is not a sorted numerical range.",
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
          crossesSeam: { type: "boolean" },
          spanDegrees: { type: "number" },
        },
        required: ["crossesSeam", "spanDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
