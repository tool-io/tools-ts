import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citationId: string;
  readonly noticeTarget: string;
  readonly noticeType: string;
  readonly supersedingId: string;
};
export type Output = {
  readonly targetsCitation: boolean;
  readonly retracted: boolean;
  readonly corrected: boolean;
  readonly supersedingPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationId: { type: "string", maxLength: 8192 },
    noticeTarget: { type: "string", maxLength: 8192 },
    noticeType: {
      type: "string",
      maxLength: 8192,
      enum: ["retraction", "correction", "expression-of-concern"],
    },
    supersedingId: { type: "string", maxLength: 8192 },
  },
  required: ["citationId", "noticeTarget", "noticeType", "supersedingId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetsCitation: { type: "boolean" },
    retracted: { type: "boolean" },
    corrected: { type: "boolean" },
    supersedingPresent: { type: "boolean" },
  },
  required: ["targetsCitation", "retracted", "corrected", "supersedingPresent"],
} as const;
/** Link explicit publication notices without retrieving or adjudicating them. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citationId, noticeTarget, noticeType, supersedingId } = request;
  const compute = (): Output => {
    H.domain(
      ["retraction", "correction", "expression-of-concern"].includes(
        noticeType,
      ),
      "noticeType",
    );
    const targetsCitation = citationId === noticeTarget;
    return {
      targetsCitation,
      retracted: targetsCitation && noticeType === "retraction",
      corrected: targetsCitation && noticeType === "correction",
      supersedingPresent: supersedingId.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    citationId: "C1",
    noticeTarget: "C1",
    noticeType: "retraction",
    supersedingId: "",
  },
  output: {
    targetsCitation: true,
    retracted: true,
    corrected: false,
    supersedingPresent: false,
  },
} satisfies ToolExample<Input, Output>;
export const osteopathicEvidenceRetractionParentPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "osteopathy/osteopathic-evidence-retraction-parent-pair",
      title: "Osteopathic Evidence Retraction Parent Pair Tool",
      description:
        "Link explicit publication notices without retrieving or adjudicating them.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          citationId: { type: "string", maxLength: 8192 },
          noticeTarget: { type: "string", maxLength: 8192 },
          noticeType: {
            type: "string",
            maxLength: 8192,
            enum: ["retraction", "correction", "expression-of-concern"],
          },
          supersedingId: { type: "string", maxLength: 8192 },
        },
        required: ["citationId", "noticeTarget", "noticeType", "supersedingId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetsCitation: { type: "boolean" },
          retracted: { type: "boolean" },
          corrected: { type: "boolean" },
          supersedingPresent: { type: "boolean" },
        },
        required: [
          "targetsCitation",
          "retracted",
          "corrected",
          "supersedingPresent",
        ],
      },
      ports: {
        inputs: [
          {
            id: "citationId",
            label: "Citation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "noticeTarget",
            label: "Notice Target",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "noticeType",
            label: "Notice Type",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "supersedingId",
            label: "Superseding Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "targetsCitation",
            label: "Targets Citation",
            valueType: { type: "boolean" },
          },
          {
            id: "retracted",
            label: "Retracted",
            valueType: { type: "boolean" },
          },
          {
            id: "corrected",
            label: "Corrected",
            valueType: { type: "boolean" },
          },
          {
            id: "supersedingPresent",
            label: "Superseding Present",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = osteopathicEvidenceRetractionParentPairTool.execute;
export default osteopathicEvidenceRetractionParentPairTool;
