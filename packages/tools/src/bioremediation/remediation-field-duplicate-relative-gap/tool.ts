import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResult: number;
  readonly secondResult: number;
};
export type Output = { readonly relativeGapFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResult: { type: "number" },
    secondResult: { type: "number" },
  },
  required: ["firstResult", "secondResult"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeGapFraction: { type: "number" } },
  required: ["relativeGapFraction"],
} as const;
/** Normalize an explicit duplicate-result absolute gap to mean absolute magnitude without applying acceptance limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstResult, secondResult } = request;
  const compute = (): Output => {
    H.domain(Math.abs(firstResult) + Math.abs(secondResult) > 0, "firstResult");
    return {
      relativeGapFraction:
        (2 * Math.abs(firstResult - secondResult)) /
        (Math.abs(firstResult) + Math.abs(secondResult)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstResult: 8, secondResult: 12 },
  output: { relativeGapFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const remediationFieldDuplicateRelativeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["bioremediation", "biology"],
        keywords: ["bioremediation", "biology"],
      },
      id: "bioremediation/remediation-field-duplicate-relative-gap",
      title: "Remediation Field Duplicate Relative Gap",
      description:
        "Normalize an explicit duplicate-result absolute gap to mean absolute magnitude without applying acceptance limits.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstResult: { type: "number" },
          secondResult: { type: "number" },
        },
        required: ["firstResult", "secondResult"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeGapFraction: { type: "number" } },
        required: ["relativeGapFraction"],
      },
      ports: {
        inputs: [
          {
            id: "firstResult",
            label: "First Result",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondResult",
            label: "Second Result",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeGapFraction",
            label: "Relative Gap Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = remediationFieldDuplicateRelativeGapTool.execute;
export default remediationFieldDuplicateRelativeGapTool;
