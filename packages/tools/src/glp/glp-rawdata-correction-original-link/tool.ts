import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly correctionParent: string;
  readonly actor: string;
  readonly reason: string;
  readonly originalValue: string;
  readonly correctedValue: string;
};
export type Output = {
  readonly linked: boolean;
  readonly attributed: boolean;
  readonly reasonPresent: boolean;
  readonly changed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    correctionParent: { type: "string", maxLength: 8192 },
    actor: { type: "string", maxLength: 8192 },
    reason: { type: "string", maxLength: 8192 },
    originalValue: { type: "string", maxLength: 8192 },
    correctedValue: { type: "string", maxLength: 8192 },
  },
  required: [
    "originalId",
    "correctionParent",
    "actor",
    "reason",
    "originalValue",
    "correctedValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    attributed: { type: "boolean" },
    reasonPresent: { type: "boolean" },
    changed: { type: "boolean" },
  },
  required: ["linked", "attributed", "reasonPresent", "changed"],
} as const;
/** Audit supplied correction links, attribution and reasons without modifying original data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalId,
    correctionParent,
    actor,
    reason,
    originalValue,
    correctedValue,
  } = request;
  const compute = (): Output => {
    return {
      linked: originalId === correctionParent,
      attributed: actor.length > 0,
      reasonPresent: reason.trim().length > 0,
      changed: originalValue !== correctedValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "R1",
    correctionParent: "R1",
    actor: "A",
    reason: "transcription",
    originalValue: "10",
    correctedValue: "11",
  },
  output: {
    linked: true,
    attributed: true,
    reasonPresent: true,
    changed: true,
  },
} satisfies ToolExample<Input, Output>;
export const glpRawdataCorrectionOriginalLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-rawdata-correction-original-link",
    title: "GLP Rawdata Correction Original Link Tool",
    description:
      "Audit supplied correction links, attribution and reasons without modifying original data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalId: { type: "string", maxLength: 8192 },
        correctionParent: { type: "string", maxLength: 8192 },
        actor: { type: "string", maxLength: 8192 },
        reason: { type: "string", maxLength: 8192 },
        originalValue: { type: "string", maxLength: 8192 },
        correctedValue: { type: "string", maxLength: 8192 },
      },
      required: [
        "originalId",
        "correctionParent",
        "actor",
        "reason",
        "originalValue",
        "correctedValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        attributed: { type: "boolean" },
        reasonPresent: { type: "boolean" },
        changed: { type: "boolean" },
      },
      required: ["linked", "attributed", "reasonPresent", "changed"],
    },
    ports: {
      inputs: [
        {
          id: "originalId",
          label: "Original Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionParent",
          label: "Correction Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actor",
          label: "Actor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reason",
          label: "Reason",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalValue",
          label: "Original Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctedValue",
          label: "Corrected Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "attributed",
          label: "Attributed",
          valueType: { type: "boolean" },
        },
        {
          id: "reasonPresent",
          label: "Reason Present",
          valueType: { type: "boolean" },
        },
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = glpRawdataCorrectionOriginalLinkTool.execute;
export default glpRawdataCorrectionOriginalLinkTool;
