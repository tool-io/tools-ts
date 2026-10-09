import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingPermits: number;
  readonly issued: number;
  readonly purchased: number;
  readonly sold: number;
  readonly surrendered: number;
};
export type Output = { readonly closingPermits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingPermits: { type: "number", minimum: 0 },
    issued: { type: "number", minimum: 0 },
    purchased: { type: "number", minimum: 0 },
    sold: { type: "number", minimum: 0 },
    surrendered: { type: "number", minimum: 0 },
  },
  required: ["openingPermits", "issued", "purchased", "sold", "surrendered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingPermits: { type: "number" } },
  required: ["closingPermits"],
} as const;
/** Reconcile supplied permit-bank movements on one compatible basis, retaining a signed deficit without inferring compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingPermits, issued, purchased, sold, surrendered } = request;
  const compute = (): Output => {
    H.domain(
      openingPermits >= 0 &&
        issued >= 0 &&
        purchased >= 0 &&
        sold >= 0 &&
        surrendered >= 0,
      "openingPermits",
    );
    return {
      closingPermits: openingPermits + issued + purchased - sold - surrendered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingPermits: 100,
    issued: 20,
    purchased: 10,
    sold: 5,
    surrendered: 80,
  },
  output: { closingPermits: 45 },
} satisfies ToolExample<Input, Output>;
export const emissionsPermitBankBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/emissions-permit-bank-balance",
    title: "Emissions Permit Bank Balance",
    description:
      "Reconcile supplied permit-bank movements on one compatible basis, retaining a signed deficit without inferring compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingPermits: { type: "number", minimum: 0 },
        issued: { type: "number", minimum: 0 },
        purchased: { type: "number", minimum: 0 },
        sold: { type: "number", minimum: 0 },
        surrendered: { type: "number", minimum: 0 },
      },
      required: [
        "openingPermits",
        "issued",
        "purchased",
        "sold",
        "surrendered",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingPermits: { type: "number" } },
      required: ["closingPermits"],
    },
    ports: {
      inputs: [
        {
          id: "openingPermits",
          label: "Opening Permits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purchased",
          label: "Purchased",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sold",
          label: "Sold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surrendered",
          label: "Surrendered",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingPermits",
          label: "Closing Permits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emissionsPermitBankBalanceTool.execute;
export default emissionsPermitBankBalanceTool;
