import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingPacks: number;
  readonly receivedPacks: number;
  readonly dispensedPacks: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingPacks: { type: "integer", minimum: 0 },
    receivedPacks: { type: "integer", minimum: 0 },
    dispensedPacks: { type: "integer", minimum: 0 },
  },
  required: ["openingPacks", "receivedPacks", "dispensedPacks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit pharmacy pack movements with exact integer arithmetic and a signed closing balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingPacks, receivedPacks, dispensedPacks } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingPacks) &&
        openingPacks >= 0 &&
        openingPacks <= Number.MAX_SAFE_INTEGER,
      "openingPacks",
    ),
      openingPacks);
    (H.domain(
      Number.isSafeInteger(receivedPacks) &&
        receivedPacks >= 0 &&
        receivedPacks <= Number.MAX_SAFE_INTEGER,
      "receivedPacks",
    ),
      receivedPacks);
    (H.domain(
      Number.isSafeInteger(dispensedPacks) &&
        dispensedPacks >= 0 &&
        dispensedPacks <= Number.MAX_SAFE_INTEGER,
      "dispensedPacks",
    ),
      dispensedPacks);
    return {
      closingBalance: Number(
        BigInt(openingPacks) + BigInt(receivedPacks) - BigInt(dispensedPacks),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingPacks: 20, receivedPacks: 8, dispensedPacks: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const communitypharmacyPackBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/community-pharmacy-pack-balance",
    title: "Community Pharmacy Pack Balance",
    description:
      "Reconcile explicit pharmacy pack movements with exact integer arithmetic and a signed closing balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingPacks: { type: "integer", minimum: 0 },
        receivedPacks: { type: "integer", minimum: 0 },
        dispensedPacks: { type: "integer", minimum: 0 },
      },
      required: ["openingPacks", "receivedPacks", "dispensedPacks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "integer" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "openingPacks",
          label: "Opening Packs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedPacks",
          label: "Received Packs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dispensedPacks",
          label: "Dispensed Packs",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = communitypharmacyPackBalanceTool.execute;
export default communitypharmacyPackBalanceTool;
