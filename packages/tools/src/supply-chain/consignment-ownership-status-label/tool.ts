import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly ownerCode: string;
  readonly custodianCode: string;
};
export type Output = {
  readonly label: string;
  readonly heldByDifferentParty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192 },
    ownerCode: { type: "string", maxLength: 8192 },
    custodianCode: { type: "string", maxLength: 8192 },
  },
  required: ["itemId", "ownerCode", "custodianCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    heldByDifferentParty: { type: "boolean" },
  },
  required: ["label", "heldByDifferentParty"],
} as const;
/** Keep explicitly recorded ownership and custody fields distinct without making a legal title determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, ownerCode, custodianCode } = request;
  const compute = (): Output => {
    H.domain(
      itemId.length > 0 && ownerCode.length > 0 && custodianCode.length > 0,
      "itemId",
    );
    return {
      label: itemId + "; owner=" + ownerCode + "; custodian=" + custodianCode,
      heldByDifferentParty: ownerCode !== custodianCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "I17",
    ownerCode: "Supplier A",
    custodianCode: "Warehouse B",
  },
  output: {
    label: "I17; owner=Supplier A; custodian=Warehouse B",
    heldByDifferentParty: true,
  },
} satisfies ToolExample<Input, Output>;
export const consignmentOwnershipStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/consignment-ownership-status-label",
    title: "Consignment Ownership Status Label Tool",
    description:
      "Keep explicitly recorded ownership and custody fields distinct without making a legal title determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192 },
        ownerCode: { type: "string", maxLength: 8192 },
        custodianCode: { type: "string", maxLength: 8192 },
      },
      required: ["itemId", "ownerCode", "custodianCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        heldByDifferentParty: { type: "boolean" },
      },
      required: ["label", "heldByDifferentParty"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerCode",
          label: "Owner Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "custodianCode",
          label: "Custodian Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "heldByDifferentParty",
          label: "Held By Different Party",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = consignmentOwnershipStatusLabelTool.execute;
export default consignmentOwnershipStatusLabelTool;
