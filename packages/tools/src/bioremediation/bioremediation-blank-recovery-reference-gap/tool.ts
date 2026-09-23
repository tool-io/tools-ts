import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly blank: number;
  readonly recovery: number;
  readonly reference: number;
};
export type Output = {
  readonly corrected: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    blank: { type: "number" },
    recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    reference: { type: "number" },
  },
  required: ["observed", "blank", "recovery", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["corrected", "referenceGap"],
} as const;
/** Calculate bioremediation blank recovery reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, blank, recovery, reference } = request;
  const compute = (): Output => {
    H.domain(recovery > 0 && recovery <= 1);
    return {
      corrected: (observed - blank) / recovery,
      referenceGap: (observed - blank) / recovery - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 12, blank: 2, recovery: 0.8, reference: 10 },
  output: { corrected: 12.5, referenceGap: 2.5 },
} satisfies ToolExample<Input, Output>;
export const bioremediationBlankRecoveryReferenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/bioremediation-blank-recovery-reference-gap",
      title: "Bioremediation Blank Recovery Reference Gap Tool",
      description:
        "Calculate bioremediation blank recovery reference gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          blank: { type: "number" },
          recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          reference: { type: "number" },
        },
        required: ["observed", "blank", "recovery", "reference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          corrected: { type: "number" },
          referenceGap: { type: "number" },
        },
        required: ["corrected", "referenceGap"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovery",
            label: "Recovery",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "corrected",
            label: "Corrected",
            valueType: { type: "number" },
          },
          {
            id: "referenceGap",
            label: "Reference Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bioremediationBlankRecoveryReferenceGapTool.execute;
export default bioremediationBlankRecoveryReferenceGapTool;
