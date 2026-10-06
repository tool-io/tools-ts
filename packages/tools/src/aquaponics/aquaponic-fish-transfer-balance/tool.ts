import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingFish: number;
  readonly transferredIn: number;
  readonly transferredOut: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingFish: { type: "integer", minimum: 0 },
    transferredIn: { type: "integer", minimum: 0 },
    transferredOut: { type: "integer", minimum: 0 },
  },
  required: ["openingFish", "transferredIn", "transferredOut"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit fish transfer counts with exact integer arithmetic without inferring mortality or stocking requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingFish, transferredIn, transferredOut } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingFish) &&
        openingFish >= 0 &&
        openingFish <= Number.MAX_SAFE_INTEGER,
      "openingFish",
    ),
      openingFish);
    (H.domain(
      Number.isSafeInteger(transferredIn) &&
        transferredIn >= 0 &&
        transferredIn <= Number.MAX_SAFE_INTEGER,
      "transferredIn",
    ),
      transferredIn);
    (H.domain(
      Number.isSafeInteger(transferredOut) &&
        transferredOut >= 0 &&
        transferredOut <= Number.MAX_SAFE_INTEGER,
      "transferredOut",
    ),
      transferredOut);
    return {
      closingBalance: Number(
        BigInt(openingFish) + BigInt(transferredIn) - BigInt(transferredOut),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingFish: 20, transferredIn: 8, transferredOut: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const aquaponicFishTransferBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-fish-transfer-balance",
    title: "Aquaponic Fish Transfer Balance",
    description:
      "Reconcile explicit fish transfer counts with exact integer arithmetic without inferring mortality or stocking requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingFish: { type: "integer", minimum: 0 },
        transferredIn: { type: "integer", minimum: 0 },
        transferredOut: { type: "integer", minimum: 0 },
      },
      required: ["openingFish", "transferredIn", "transferredOut"],
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
          id: "openingFish",
          label: "Opening Fish",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferredIn",
          label: "Transferred In",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferredOut",
          label: "Transferred Out",
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
export const run = aquaponicFishTransferBalanceTool.execute;
export default aquaponicFishTransferBalanceTool;
