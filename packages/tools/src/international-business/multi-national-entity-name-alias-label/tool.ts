import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entityId: string;
  readonly preferredName: string;
  readonly recordedAlias: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entityId: { type: "string", maxLength: 8192, minLength: 1 },
    preferredName: { type: "string", maxLength: 8192, minLength: 1 },
    recordedAlias: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entityId", "preferredName", "recordedAlias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record explicit entity-name and alias wording without resolving legal entities or ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entityId, preferredName, recordedAlias } = request;
  const compute = (): Output => {
    H.domain(
      entityId.length > 0 &&
        preferredName.length > 0 &&
        recordedAlias.length > 0,
      "entityId",
    );
    return {
      label:
        entityId +
        ": " +
        preferredName +
        " [alias " +
        JSON.stringify(recordedAlias) +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entityId: "E17",
    preferredName: "Company A",
    recordedAlias: "A Trading",
  },
  output: { label: 'E17: Company A [alias "A Trading"]' },
} satisfies ToolExample<Input, Output>;
export const multiNationalEntityNameAliasLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/multi-national-entity-name-alias-label",
    title: "Multi National Entity Name Alias Label",
    description:
      "Record explicit entity-name and alias wording without resolving legal entities or ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entityId: { type: "string", maxLength: 8192, minLength: 1 },
        preferredName: { type: "string", maxLength: 8192, minLength: 1 },
        recordedAlias: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entityId", "preferredName", "recordedAlias"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "entityId",
          label: "Entity Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preferredName",
          label: "Preferred Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedAlias",
          label: "Recorded Alias",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = multiNationalEntityNameAliasLabelTool.execute;
export default multiNationalEntityNameAliasLabelTool;
