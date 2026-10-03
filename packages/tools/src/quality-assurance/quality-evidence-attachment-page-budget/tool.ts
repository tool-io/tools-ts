import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attachmentPages: readonly number[];
  readonly sharedPages: number;
  readonly maximum: number;
};
export type Output = {
  readonly grossPages: number;
  readonly uniquePages: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attachmentPages: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    sharedPages: { type: "integer", minimum: 0 },
    maximum: { type: "integer", minimum: 0 },
  },
  required: ["attachmentPages", "sharedPages", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPages: { type: "integer" },
    uniquePages: { type: "integer" },
    remaining: { type: "integer" },
  },
  required: ["grossPages", "uniquePages", "remaining"],
} as const;
/** Calculate quality evidence attachment page budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attachmentPages, sharedPages, maximum } = request;
  const compute = (): Output => {
    H.integer(maximum, 0);
    H.integer(sharedPages, 0);
    H.domain(
      attachmentPages.every((x) => x >= 0) &&
        sharedPages <= attachmentPages.reduce((a, b) => a + b, 0),
    );
    return {
      grossPages: attachmentPages.reduce((a, b) => a + b, 0),
      uniquePages: attachmentPages.reduce((a, b) => a + b, 0) - sharedPages,
      remaining:
        maximum - attachmentPages.reduce((a, b) => a + b, 0) + sharedPages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attachmentPages: [10, 20, 15], sharedPages: 5, maximum: 50 },
  output: { grossPages: 45, uniquePages: 40, remaining: 10 },
} satisfies ToolExample<Input, Output>;
export const qualityEvidenceAttachmentPageBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/quality-evidence-attachment-page-budget",
      title: "Quality Evidence Attachment Page Budget Tool",
      description:
        "Calculate quality evidence attachment page budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attachmentPages: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          sharedPages: { type: "integer", minimum: 0 },
          maximum: { type: "integer", minimum: 0 },
        },
        required: ["attachmentPages", "sharedPages", "maximum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPages: { type: "integer" },
          uniquePages: { type: "integer" },
          remaining: { type: "integer" },
        },
        required: ["grossPages", "uniquePages", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "attachmentPages",
            label: "Attachment Pages",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "sharedPages",
            label: "Shared Pages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "grossPages",
            label: "Gross Pages",
            valueType: { type: "integer" },
          },
          {
            id: "uniquePages",
            label: "Unique Pages",
            valueType: { type: "integer" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qualityEvidenceAttachmentPageBudgetTool.execute;
export default qualityEvidenceAttachmentPageBudgetTool;
