import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personRecordId: string;
  readonly nameVariant: string;
  readonly sourceId: string;
};
export type Output = { readonly linkToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personRecordId: { type: "string", maxLength: 8192 },
    nameVariant: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["personRecordId", "nameVariant", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linkToken: { type: "string", maxLength: 8192 } },
  required: ["linkToken"],
} as const;
/** Encode a supplied person-record/name-variant/source association without resolving identity from a name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personRecordId, nameVariant, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      personRecordId.length > 0 &&
        nameVariant.length > 0 &&
        sourceId.length > 0,
      "personRecordId",
    );
    return {
      linkToken: JSON.stringify([personRecordId, nameVariant, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personRecordId: "P12", nameVariant: "Johannes", sourceId: "S7" },
  output: { linkToken: '["P12","Johannes","S7"]' },
} satisfies ToolExample<Input, Output>;
export const historicalPersonNameVariantLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-person-name-variant-link",
    title: "Historical Person Name Variant Link Tool",
    description:
      "Encode a supplied person-record/name-variant/source association without resolving identity from a name.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personRecordId: { type: "string", maxLength: 8192 },
        nameVariant: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
      },
      required: ["personRecordId", "nameVariant", "sourceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linkToken: { type: "string", maxLength: 8192 } },
      required: ["linkToken"],
    },
    ports: {
      inputs: [
        {
          id: "personRecordId",
          label: "Person Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nameVariant",
          label: "Name Variant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linkToken", label: "Link Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = historicalPersonNameVariantLinkTool.execute;
export default historicalPersonNameVariantLinkTool;
