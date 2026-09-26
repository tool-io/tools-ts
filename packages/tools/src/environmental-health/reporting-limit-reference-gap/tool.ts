import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedLimit: number;
  readonly referenceLimit: number;
};
export type Output = {
  readonly gap: number;
  readonly ratio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedLimit: { type: "number", minimum: 0 },
    referenceLimit: { type: "number", minimum: 0 },
  },
  required: ["reportedLimit", "referenceLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    ratio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["gap", "ratio", "defined"],
} as const;
/** Compare supplied laboratory reporting limits without treating them as health thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedLimit, referenceLimit } = request;
  const compute = (): Output => {
    H.domain(reportedLimit >= 0 && referenceLimit >= 0);
    return {
      gap: reportedLimit - referenceLimit,
      ratio: referenceLimit > 0 ? reportedLimit / referenceLimit : 0,
      defined: referenceLimit > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedLimit: 3, referenceLimit: 2 },
  output: { gap: 1, ratio: 1.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const reportingLimitReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/reporting-limit-reference-gap",
    title: "Reporting Limit Reference Gap Tool",
    description:
      "Compare supplied laboratory reporting limits without treating them as health thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedLimit: { type: "number", minimum: 0 },
        referenceLimit: { type: "number", minimum: 0 },
      },
      required: ["reportedLimit", "referenceLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        ratio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["gap", "ratio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "reportedLimit",
          label: "Reported Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLimit",
          label: "Reference Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = reportingLimitReferenceGapTool.execute;
export default reportingLimitReferenceGapTool;
