import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly itemId: string;
  readonly missingReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    missingReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "itemId", "missingReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly documented missing study-item reason without imputing a value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, itemId, missingReason } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(itemId.length > 0, "itemId");
    H.domain(missingReason.length > 0, "missingReason");
    return { token: JSON.stringify([studyId, itemId, missingReason]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", itemId: "Q3", missingReason: "not recorded" },
  output: { token: '["ST17","Q3","not recorded"]' },
} satisfies ToolExample<Input, Output>;
export const chiropracticStudyMissingItemLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/chiropractic-study-missing-item-label",
    title: "Chiropractic Study Missing Item Label",
    description:
      "Preserve an explicitly documented missing study-item reason without imputing a value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        missingReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "itemId", "missingReason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingReason",
          label: "Missing Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chiropracticStudyMissingItemLabelTool.execute;
export default chiropracticStudyMissingItemLabelTool;
