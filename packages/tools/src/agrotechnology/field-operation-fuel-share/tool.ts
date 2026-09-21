import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operationFuel: number;
  readonly totalFuel: number;
  readonly excludedFuel: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominatorFuel: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operationFuel: { type: "number", minimum: 0 },
    totalFuel: { type: "number" },
    excludedFuel: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["operationFuel", "totalFuel", "excludedFuel", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorFuel: { type: "number" },
    share: { type: "number" },
  },
  required: ["denominatorFuel", "share"],
} as const;
/** Calculate field operation fuel share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { operationFuel, totalFuel, excludedFuel, excludeMarked } = request;
  const compute = (): Output => {
    H.domain(
      totalFuel > excludedFuel &&
        excludedFuel >= 0 &&
        operationFuel >= 0 &&
        operationFuel <= totalFuel - excludedFuel,
    );
    return {
      denominatorFuel: totalFuel - (excludeMarked ? excludedFuel : 0),
      share: operationFuel / (totalFuel - (excludeMarked ? excludedFuel : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    operationFuel: 20,
    totalFuel: 100,
    excludedFuel: 20,
    excludeMarked: true,
  },
  output: { denominatorFuel: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const fieldOperationFuelShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/field-operation-fuel-share",
    title: "Field Operation Fuel Share Tool",
    description:
      "Calculate field operation fuel share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operationFuel: { type: "number", minimum: 0 },
        totalFuel: { type: "number" },
        excludedFuel: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: ["operationFuel", "totalFuel", "excludedFuel", "excludeMarked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorFuel: { type: "number" },
        share: { type: "number" },
      },
      required: ["denominatorFuel", "share"],
    },
    ports: {
      inputs: [
        {
          id: "operationFuel",
          label: "Operation Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFuel",
          label: "Total Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFuel",
          label: "Excluded Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorFuel",
          label: "Denominator Fuel",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fieldOperationFuelShareTool.execute;
export default fieldOperationFuelShareTool;
