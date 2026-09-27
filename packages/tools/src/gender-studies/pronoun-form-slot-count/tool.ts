import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forms: readonly string[];
  readonly requiredSlots: number;
  readonly emptyIsMissing: boolean;
};
export type Output = {
  readonly recordedSlots: number;
  readonly missingRequired: number;
  readonly extraSlots: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredSlots: { type: "integer", minimum: 0 },
    emptyIsMissing: { type: "boolean" },
  },
  required: ["forms", "requiredSlots", "emptyIsMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSlots: { type: "integer" },
    missingRequired: { type: "integer" },
    extraSlots: { type: "integer" },
  },
  required: ["recordedSlots", "missingRequired", "extraSlots"],
} as const;
/** Count supplied form slots under an explicit empty-entry convention without assigning a pronoun paradigm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forms, requiredSlots, emptyIsMissing } = request;
  const compute = (): Output => {
    H.integer(requiredSlots, 0);
    const recordedSlots = emptyIsMissing
      ? forms.filter((x) => x.length > 0).length
      : forms.length;
    return {
      recordedSlots,
      missingRequired: Math.max(0, requiredSlots - recordedSlots),
      extraSlots: Math.max(0, recordedSlots - requiredSlots),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forms: ["they", "them", ""],
    requiredSlots: 3,
    emptyIsMissing: true,
  },
  output: { recordedSlots: 2, missingRequired: 1, extraSlots: 0 },
} satisfies ToolExample<Input, Output>;
export const pronounFormSlotCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/pronoun-form-slot-count",
    title: "Pronoun Form Slot Count Tool",
    description:
      "Count supplied form slots under an explicit empty-entry convention without assigning a pronoun paradigm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredSlots: { type: "integer", minimum: 0 },
        emptyIsMissing: { type: "boolean" },
      },
      required: ["forms", "requiredSlots", "emptyIsMissing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSlots: { type: "integer" },
        missingRequired: { type: "integer" },
        extraSlots: { type: "integer" },
      },
      required: ["recordedSlots", "missingRequired", "extraSlots"],
    },
    ports: {
      inputs: [
        {
          id: "forms",
          label: "Forms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredSlots",
          label: "Required Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "emptyIsMissing",
          label: "Empty Is Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedSlots",
          label: "Recorded Slots",
          valueType: { type: "integer" },
        },
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "integer" },
        },
        {
          id: "extraSlots",
          label: "Extra Slots",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pronounFormSlotCountTool.execute;
export default pronounFormSlotCountTool;
