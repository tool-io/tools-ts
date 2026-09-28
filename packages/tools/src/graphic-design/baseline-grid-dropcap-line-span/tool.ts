import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fontCapHeight: number;
  readonly lineHeight: number;
  readonly spanLines: number;
  readonly baselineAdjustment: number;
};
export type Output = { readonly targetHeight: number; readonly scale: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fontCapHeight: { type: "number", exclusiveMinimum: 0 },
    lineHeight: { type: "number", exclusiveMinimum: 0 },
    spanLines: { type: "integer", minimum: 1 },
    baselineAdjustment: { type: "number" },
  },
  required: ["fontCapHeight", "lineHeight", "spanLines", "baselineAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetHeight: { type: "number" }, scale: { type: "number" } },
  required: ["targetHeight", "scale"],
} as const;
/** Calculate baseline grid dropcap line span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fontCapHeight, lineHeight, spanLines, baselineAdjustment } = request;
  const compute = (): Output => {
    H.positive(fontCapHeight);
    H.positive(lineHeight);
    H.integer(spanLines, 1);
    H.domain(
      fontCapHeight + (spanLines - 1) * lineHeight + baselineAdjustment >= 0,
    );
    return {
      targetHeight:
        fontCapHeight + (spanLines - 1) * lineHeight + baselineAdjustment,
      scale:
        (fontCapHeight + (spanLines - 1) * lineHeight + baselineAdjustment) /
        fontCapHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fontCapHeight: 10,
    lineHeight: 12,
    spanLines: 3,
    baselineAdjustment: 0,
  },
  output: { targetHeight: 34, scale: 3.4 },
} satisfies ToolExample<Input, Output>;
export const baselineGridDropcapLineSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/baseline-grid-dropcap-line-span",
    title: "Baseline Grid Dropcap Line Span Tool",
    description:
      "Calculate baseline grid dropcap line span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fontCapHeight: { type: "number", exclusiveMinimum: 0 },
        lineHeight: { type: "number", exclusiveMinimum: 0 },
        spanLines: { type: "integer", minimum: 1 },
        baselineAdjustment: { type: "number" },
      },
      required: [
        "fontCapHeight",
        "lineHeight",
        "spanLines",
        "baselineAdjustment",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetHeight: { type: "number" },
        scale: { type: "number" },
      },
      required: ["targetHeight", "scale"],
    },
    ports: {
      inputs: [
        {
          id: "fontCapHeight",
          label: "Font Cap Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineHeight",
          label: "Line Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spanLines",
          label: "Span Lines",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "baselineAdjustment",
          label: "Baseline Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetHeight",
          label: "Target Height",
          valueType: { type: "number" },
        },
        { id: "scale", label: "Scale", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = baselineGridDropcapLineSpanTool.execute;
export default baselineGridDropcapLineSpanTool;
