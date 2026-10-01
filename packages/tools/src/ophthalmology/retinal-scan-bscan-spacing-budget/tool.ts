import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly span: number;
  readonly bscans: number;
  readonly endpointInclusive: boolean;
};
export type Output = {
  readonly intervals: number;
  readonly spacing: number;
  readonly representedSpan: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", minimum: 0 },
    bscans: { type: "integer", minimum: 1 },
    endpointInclusive: { type: "boolean" },
  },
  required: ["span", "bscans", "endpointInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervals: { type: "integer" },
    spacing: { type: "number" },
    representedSpan: { type: "number" },
  },
  required: ["intervals", "spacing", "representedSpan"],
} as const;
/** Explicit endpoint-inclusive versus equal-cell B-scan placement convention, without an acquisition-density recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, bscans, endpointInclusive } = request;
  const compute = (): Output => {
    H.domain(span >= 0);
    H.integer(bscans, 1);
    H.domain(!endpointInclusive || bscans >= 2);
    return {
      intervals: endpointInclusive ? bscans - 1 : bscans,
      spacing: span / (endpointInclusive ? bscans - 1 : bscans),
      representedSpan: endpointInclusive
        ? span
        : (span * (bscans - 1)) / bscans,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 6, bscans: 13, endpointInclusive: true },
  output: { intervals: 12, spacing: 0.5, representedSpan: 6 },
} satisfies ToolExample<Input, Output>;
export const retinalScanBscanSpacingBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/retinal-scan-bscan-spacing-budget",
    title: "Retinal Scan Bscan Spacing Budget Tool",
    description:
      "Explicit endpoint-inclusive versus equal-cell B-scan placement convention, without an acquisition-density recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", minimum: 0 },
        bscans: { type: "integer", minimum: 1 },
        endpointInclusive: { type: "boolean" },
      },
      required: ["span", "bscans", "endpointInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervals: { type: "integer" },
        spacing: { type: "number" },
        representedSpan: { type: "number" },
      },
      required: ["intervals", "spacing", "representedSpan"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bscans",
          label: "Bscans",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endpointInclusive",
          label: "Endpoint Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "intervals", label: "Intervals", valueType: { type: "integer" } },
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
        {
          id: "representedSpan",
          label: "Represented Span",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retinalScanBscanSpacingBudgetTool.execute;
export default retinalScanBscanSpacingBudgetTool;
