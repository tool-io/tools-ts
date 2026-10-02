import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly percent: number;
  readonly baselineOrigin: number;
  readonly baselineSpan: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percent: { type: "number" },
    baselineOrigin: { type: "number" },
    baselineSpan: { type: "number" },
  },
  required: ["percent", "baselineOrigin", "baselineSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Calculate percent baseline origin offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { percent, baselineOrigin, baselineSpan } = request;
  const compute = (): Output => {
    H.domain(baselineSpan !== 0);
    return { value: baselineOrigin + (percent / 100) * baselineSpan };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { percent: 25, baselineOrigin: 10, baselineSpan: 8 },
  output: { value: 12 },
} satisfies ToolExample<Input, Output>;
export const percentBaselineOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/percent-baseline-origin-offset",
    title: "Percent Baseline Origin Offset Tool",
    description:
      "Calculate percent baseline origin offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        percent: { type: "number" },
        baselineOrigin: { type: "number" },
        baselineSpan: { type: "number" },
      },
      required: ["percent", "baselineOrigin", "baselineSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "percent",
          label: "Percent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineOrigin",
          label: "Baseline Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineSpan",
          label: "Baseline Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = percentBaselineOriginOffsetTool.execute;
export default percentBaselineOriginOffsetTool;
