import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly envelopeText: string;
  readonly itemText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    envelopeText: { type: "string", maxLength: 8192, minLength: 1 },
    itemText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "envelopeText", "itemText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit archive envelope-item reference without accessing records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, envelopeText, itemText } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(envelopeText.length > 0, "envelopeText");
    H.domain(itemText.length > 0, "itemText");
    return { token: JSON.stringify([archiveId, envelopeText, itemText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archiveId: "AR17", envelopeText: "ENV2", itemText: "ITEM3" },
  output: { token: '["AR17","ENV2","ITEM3"]' },
} satisfies ToolExample<Input, Output>;
export const ottomanArchiveEnvelopeItemTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/ottoman-archive-envelope-item-token",
    title: "Ottoman Archive Envelope Item Token",
    description:
      "Build an unambiguous explicit archive envelope-item reference without accessing records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
        envelopeText: { type: "string", maxLength: 8192, minLength: 1 },
        itemText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveId", "envelopeText", "itemText"],
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
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "envelopeText",
          label: "Envelope Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemText",
          label: "Item Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ottomanArchiveEnvelopeItemTokenTool.execute;
export default ottomanArchiveEnvelopeItemTokenTool;
