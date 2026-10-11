import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingEnergyJoules: number;
  readonly signedTransfersJoules: readonly number[];
};
export type Output = { readonly closingEnergyJoules: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingEnergyJoules: { type: "number" },
    signedTransfersJoules: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["openingEnergyJoules", "signedTransfersJoules"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingEnergyJoules: { type: "number" } },
  required: ["closingEnergyJoules"],
} as const;
/** Sum explicitly signed energy transfers into an opening energy on a caller-established system boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingEnergyJoules, signedTransfersJoules } = request;
  const compute = (): Output => {
    return {
      closingEnergyJoules: signedTransfersJoules.reduce(
        (total, transfer) => total + transfer,
        openingEnergyJoules,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingEnergyJoules: 100, signedTransfersJoules: [20, -35] },
  output: { closingEnergyJoules: 85 },
} satisfies ToolExample<Input, Output>;
export const energyBalanceSignedTransferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/energy-balance-signed-transfer",
    title: "Energy Balance Signed Transfer",
    description:
      "Sum explicitly signed energy transfers into an opening energy on a caller-established system boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingEnergyJoules: { type: "number" },
        signedTransfersJoules: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["openingEnergyJoules", "signedTransfersJoules"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingEnergyJoules: { type: "number" } },
      required: ["closingEnergyJoules"],
    },
    ports: {
      inputs: [
        {
          id: "openingEnergyJoules",
          label: "Opening Energy Joules",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedTransfersJoules",
          label: "Signed Transfers Joules",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "closingEnergyJoules",
          label: "Closing Energy Joules",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = energyBalanceSignedTransferTool.execute;
export default energyBalanceSignedTransferTool;
