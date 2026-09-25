import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialFat: number;
  readonly drainedFat: number;
  readonly fatEnergyFactor: number;
  readonly initialEnergy: number;
};
export type Output = {
  readonly remainingFat: number;
  readonly removedEnergy: number;
  readonly remainingEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialFat: { type: "number" },
    drainedFat: { type: "number", minimum: 0 },
    fatEnergyFactor: { type: "number", minimum: 0 },
    initialEnergy: { type: "number" },
  },
  required: ["initialFat", "drainedFat", "fatEnergyFactor", "initialEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingFat: { type: "number" },
    removedEnergy: { type: "number" },
    remainingEnergy: { type: "number" },
  },
  required: ["remainingFat", "removedEnergy", "remainingEnergy"],
} as const;
/** Calculate recipe fat drainage energy adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialFat, drainedFat, fatEnergyFactor, initialEnergy } = request;
  const compute = (): Output => {
    H.domain(
      drainedFat >= 0 &&
        initialFat >= drainedFat &&
        fatEnergyFactor >= 0 &&
        initialEnergy >= drainedFat * fatEnergyFactor,
    );
    return {
      remainingFat: initialFat - drainedFat,
      removedEnergy: drainedFat * fatEnergyFactor,
      remainingEnergy: initialEnergy - drainedFat * fatEnergyFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialFat: 30,
    drainedFat: 10,
    fatEnergyFactor: 9,
    initialEnergy: 500,
  },
  output: { remainingFat: 20, removedEnergy: 90, remainingEnergy: 410 },
} satisfies ToolExample<Input, Output>;
export const recipeFatDrainageEnergyAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/recipe-fat-drainage-energy-adjustment",
    title: "Recipe Fat Drainage Energy Adjustment Tool",
    description:
      "Calculate recipe fat drainage energy adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialFat: { type: "number" },
        drainedFat: { type: "number", minimum: 0 },
        fatEnergyFactor: { type: "number", minimum: 0 },
        initialEnergy: { type: "number" },
      },
      required: [
        "initialFat",
        "drainedFat",
        "fatEnergyFactor",
        "initialEnergy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingFat: { type: "number" },
        removedEnergy: { type: "number" },
        remainingEnergy: { type: "number" },
      },
      required: ["remainingFat", "removedEnergy", "remainingEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "initialFat",
          label: "Initial Fat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedFat",
          label: "Drained Fat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatEnergyFactor",
          label: "Fat Energy Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialEnergy",
          label: "Initial Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingFat",
          label: "Remaining Fat",
          valueType: { type: "number" },
        },
        {
          id: "removedEnergy",
          label: "Removed Energy",
          valueType: { type: "number" },
        },
        {
          id: "remainingEnergy",
          label: "Remaining Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipeFatDrainageEnergyAdjustmentTool.execute;
export default recipeFatDrainageEnergyAdjustmentTool;
