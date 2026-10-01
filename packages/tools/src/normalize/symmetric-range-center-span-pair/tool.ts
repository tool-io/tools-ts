import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly minimum: number; readonly maximum: number };
export type Output = { readonly center: number; readonly halfSpan: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { center: { type: "number" }, halfSpan: { type: "number" } },
  required: ["center", "halfSpan"],
} as const;
/** Calculate symmetric range center span pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(minimum < maximum);
    return {
      center: minimum / 2 + maximum / 2,
      halfSpan: (maximum - minimum) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minimum: -2, maximum: 8 },
  output: { center: 3, halfSpan: 5 },
} satisfies ToolExample<Input, Output>;
export const symmetricRangeCenterSpanPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/symmetric-range-center-span-pair",
    title: "Symmetric Range Center Span Pair Tool",
    description:
      "Calculate symmetric range center span pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { minimum: { type: "number" }, maximum: { type: "number" } },
      required: ["minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { center: { type: "number" }, halfSpan: { type: "number" } },
      required: ["center", "halfSpan"],
    },
    ports: {
      inputs: [
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "center", label: "Center", valueType: { type: "number" } },
        { id: "halfSpan", label: "Half Span", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = symmetricRangeCenterSpanPairTool.execute;
export default symmetricRangeCenterSpanPairTool;
