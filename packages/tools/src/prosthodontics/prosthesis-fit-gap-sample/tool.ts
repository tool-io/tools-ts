import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gaps: readonly number[];
  readonly valid: readonly boolean[];
};
export type Output = {
  readonly meanGap: number;
  readonly validCount: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaps: { type: "array", maxItems: 256, items: { type: "number" } },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["gaps", "valid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanGap: { type: "number" },
    validCount: { type: "integer" },
    defined: { type: "boolean" },
  },
  required: ["meanGap", "validCount", "defined"],
} as const;
/** Summarize independently marked valid signed bench gap samples without judging clinical fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gaps, valid } = request;
  const compute = (): Output => {
    H.sameLength(gaps, valid);
    const chosen = gaps.filter((_, i) => valid[i]);
    return {
      meanGap: chosen.length
        ? chosen.reduce((a, b) => a + b, 0) / chosen.length
        : 0,
      validCount: chosen.length,
      defined: chosen.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gaps: [1, 2, 8], valid: [true, true, false] },
  output: { meanGap: 1.5, validCount: 2, defined: true },
} satisfies ToolExample<Input, Output>;
export const prosthesisFitGapSampleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-fit-gap-sample",
    title: "Prosthesis Fit Gap Sample Tool",
    description:
      "Summarize independently marked valid signed bench gap samples without judging clinical fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaps: { type: "array", maxItems: 256, items: { type: "number" } },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["gaps", "valid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanGap: { type: "number" },
        validCount: { type: "integer" },
        defined: { type: "boolean" },
      },
      required: ["meanGap", "validCount", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "gaps",
          label: "Gaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "meanGap", label: "Mean Gap", valueType: { type: "number" } },
        {
          id: "validCount",
          label: "Valid Count",
          valueType: { type: "integer" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisFitGapSampleTool.execute;
export default prosthesisFitGapSampleTool;
