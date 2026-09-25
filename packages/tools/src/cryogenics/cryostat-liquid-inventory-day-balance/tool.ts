import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingVolume: number;
  readonly deliveries: readonly number[];
  readonly withdrawal: number;
  readonly boiloff: number;
};
export type Output = {
  readonly closingVolume: number;
  readonly accountedLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingVolume: { type: "number", minimum: 0 },
    deliveries: { type: "array", maxItems: 256, items: { type: "number" } },
    withdrawal: { type: "number", minimum: 0 },
    boiloff: { type: "number", minimum: 0 },
  },
  required: ["openingVolume", "deliveries", "withdrawal", "boiloff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingVolume: { type: "number" },
    accountedLoss: { type: "number" },
  },
  required: ["closingVolume", "accountedLoss"],
} as const;
/** Calculate cryostat liquid inventory day balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingVolume, deliveries, withdrawal, boiloff } = request;
  const compute = (): Output => {
    H.domain(
      openingVolume >= 0 &&
        deliveries.every((x) => x >= 0) &&
        withdrawal >= 0 &&
        boiloff >= 0 &&
        openingVolume + deliveries.reduce((a, b) => a + b, 0) >=
          withdrawal + boiloff,
    );
    return {
      closingVolume:
        openingVolume +
        deliveries.reduce((a, b) => a + b, 0) -
        withdrawal -
        boiloff,
      accountedLoss: withdrawal + boiloff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingVolume: 100,
    deliveries: [20, 10],
    withdrawal: 15,
    boiloff: 5,
  },
  output: { closingVolume: 110, accountedLoss: 20 },
} satisfies ToolExample<Input, Output>;
export const cryostatLiquidInventoryDayBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryostat-liquid-inventory-day-balance",
    title: "Cryostat Liquid Inventory Day Balance Tool",
    description:
      "Calculate cryostat liquid inventory day balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingVolume: { type: "number", minimum: 0 },
        deliveries: { type: "array", maxItems: 256, items: { type: "number" } },
        withdrawal: { type: "number", minimum: 0 },
        boiloff: { type: "number", minimum: 0 },
      },
      required: ["openingVolume", "deliveries", "withdrawal", "boiloff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingVolume: { type: "number" },
        accountedLoss: { type: "number" },
      },
      required: ["closingVolume", "accountedLoss"],
    },
    ports: {
      inputs: [
        {
          id: "openingVolume",
          label: "Opening Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveries",
          label: "Deliveries",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "withdrawal",
          label: "Withdrawal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boiloff",
          label: "Boiloff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingVolume",
          label: "Closing Volume",
          valueType: { type: "number" },
        },
        {
          id: "accountedLoss",
          label: "Accounted Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryostatLiquidInventoryDayBalanceTool.execute;
export default cryostatLiquidInventoryDayBalanceTool;
