import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly suppliedTransferDate: string;
  readonly transferReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTransferDate: { type: "string", maxLength: 8192, minLength: 1 },
    transferReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "suppliedTransferDate", "transferReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit object return or transfer date field and reference without asserting title or legal ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, suppliedTransferDate, transferReference } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(suppliedTransferDate.length > 0, "suppliedTransferDate");
    H.domain(transferReference.length > 0, "transferReference");
    return {
      token: JSON.stringify([
        objectId,
        suppliedTransferDate,
        transferReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "OBJ17",
    suppliedTransferDate: "2026-11-01",
    transferReference: "TR2",
  },
  output: { token: '["OBJ17","2026-11-01","TR2"]' },
} satisfies ToolExample<Input, Output>;
export const africanObjectReturnTransferDateFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-object-return-transfer-date-field",
      title: "African Object Return Transfer Date Field",
      description:
        "Preserve an explicit object return or transfer date field and reference without asserting title or legal ownership.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTransferDate: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          transferReference: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["objectId", "suppliedTransferDate", "transferReference"],
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
            id: "objectId",
            label: "Object Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTransferDate",
            label: "Supplied Transfer Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "transferReference",
            label: "Transfer Reference",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanObjectReturnTransferDateFieldTool.execute;
export default africanObjectReturnTransferDateFieldTool;
