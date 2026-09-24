import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalSpan: number;
  readonly quotedSpan: number;
  readonly declaredOmitted: number;
};
export type Output = { readonly lengthGap: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalSpan: { type: "integer", minimum: 0 },
    quotedSpan: { type: "integer", minimum: 0 },
    declaredOmitted: { type: "integer", minimum: 0 },
  },
  required: ["originalSpan", "quotedSpan", "declaredOmitted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthGap: { type: "integer" }, residual: { type: "integer" } },
  required: ["lengthGap", "residual"],
} as const;
/** Audit explicitly counted text units without inferring omitted meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalSpan, quotedSpan, declaredOmitted } = request;
  const compute = (): Output => {
    H.integer(originalSpan, 0);
    H.integer(quotedSpan, 0, originalSpan);
    H.integer(declaredOmitted, 0);
    return {
      lengthGap: originalSpan - quotedSpan,
      residual: originalSpan - quotedSpan - declaredOmitted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalSpan: 100, quotedSpan: 70, declaredOmitted: 25 },
  output: { lengthGap: 30, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const quotationEllipsisSpanGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/quotation-ellipsis-span-gap",
    title: "Quotation Ellipsis Span Gap Tool",
    description:
      "Audit explicitly counted text units without inferring omitted meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalSpan: { type: "integer", minimum: 0 },
        quotedSpan: { type: "integer", minimum: 0 },
        declaredOmitted: { type: "integer", minimum: 0 },
      },
      required: ["originalSpan", "quotedSpan", "declaredOmitted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthGap: { type: "integer" },
        residual: { type: "integer" },
      },
      required: ["lengthGap", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "originalSpan",
          label: "Original Span",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quotedSpan",
          label: "Quoted Span",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declaredOmitted",
          label: "Declared Omitted",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lengthGap",
          label: "Length Gap",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = quotationEllipsisSpanGapTool.execute;
export default quotationEllipsisSpanGapTool;
