import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly units: number; readonly capacity: number };
export type Output = {
  readonly fullPallets: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "integer", minimum: 0 },
    capacity: { type: "integer", minimum: 1 },
  },
  required: ["units", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPallets: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["fullPallets", "remainder"],
} as const;
/** Calculate pallet capacity remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, capacity } = request;
  const compute = (): Output => {
    H.integer(units, 0);
    H.integer(capacity, 1);
    const n = BigInt(units),
      c = BigInt(capacity);
    return { fullPallets: Number(n / c), remainder: Number(n % c) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 103, capacity: 24 },
  output: { fullPallets: 4, remainder: 7 },
} satisfies ToolExample<Input, Output>;
export const palletCapacityRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/pallet-capacity-remainder",
    title: "Pallet Capacity Remainder Tool",
    description:
      "Calculate pallet capacity remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: { type: "integer", minimum: 0 },
        capacity: { type: "integer", minimum: 1 },
      },
      required: ["units", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPallets: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["fullPallets", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullPallets",
          label: "Full Pallets",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = palletCapacityRemainderTool.execute;
export default palletCapacityRemainderTool;
