import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly fromLocation: string;
  readonly toLocation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    fromLocation: { type: "string", maxLength: 8192, minLength: 1 },
    toLocation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "fromLocation", "toLocation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit origin and destination storage locations for an artwork inventory relocation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, fromLocation, toLocation } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(fromLocation.length > 0, "fromLocation");
    H.domain(toLocation.length > 0, "toLocation");
    return { token: JSON.stringify([objectId, fromLocation, toLocation]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectId: "O17",
    fromLocation: "Cabinet A",
    toLocation: "Cabinet B",
  },
  output: { token: '["O17","Cabinet A","Cabinet B"]' },
} satisfies ToolExample<Input, Output>;
export const objectStorageInventoryRelocationCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-conservation", "art conservation", "arts and design"],
        keywords: ["art conservation", "arts and design"],
      },
      id: "art-conservation/object-storage-inventory-relocation-code",
      title: "Object Storage Inventory Relocation Code",
      description:
        "Record explicit origin and destination storage locations for an artwork inventory relocation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectId: { type: "string", maxLength: 8192, minLength: 1 },
          fromLocation: { type: "string", maxLength: 8192, minLength: 1 },
          toLocation: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["objectId", "fromLocation", "toLocation"],
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
            id: "fromLocation",
            label: "From Location",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "toLocation",
            label: "To Location",
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
export const run = objectStorageInventoryRelocationCodeTool.execute;
export default objectStorageInventoryRelocationCodeTool;
