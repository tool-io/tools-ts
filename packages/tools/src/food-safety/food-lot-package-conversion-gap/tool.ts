import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packages: number;
  readonly unitsPerPackage: number;
  readonly looseUnits: number;
  readonly recordedUnits: number;
};
export type Output = {
  readonly expandedUnits: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packages: { type: "integer", minimum: 0 },
    unitsPerPackage: { type: "integer", minimum: 1 },
    looseUnits: { type: "integer", minimum: 0 },
    recordedUnits: { type: "integer", minimum: 0 },
  },
  required: ["packages", "unitsPerPackage", "looseUnits", "recordedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedUnits: { type: "integer" },
    discrepancy: { type: "integer" },
  },
  required: ["expandedUnits", "discrepancy"],
} as const;
/** Calculate food lot package conversion gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packages, unitsPerPackage, looseUnits, recordedUnits } = request;
  const compute = (): Output => {
    H.integer(packages, 0);
    H.integer(unitsPerPackage, 1);
    H.integer(looseUnits, 0);
    H.integer(recordedUnits, 0);
    const expanded =
      BigInt(packages) * BigInt(unitsPerPackage) + BigInt(looseUnits);
    return {
      expandedUnits: Number(expanded),
      discrepancy: Number(BigInt(recordedUnits) - expanded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packages: 10,
    unitsPerPackage: 12,
    looseUnits: 5,
    recordedUnits: 120,
  },
  output: { expandedUnits: 125, discrepancy: -5 },
} satisfies ToolExample<Input, Output>;
export const foodLotPackageConversionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-lot-package-conversion-gap",
    title: "Food Lot Package Conversion Gap Tool",
    description:
      "Calculate food lot package conversion gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packages: { type: "integer", minimum: 0 },
        unitsPerPackage: { type: "integer", minimum: 1 },
        looseUnits: { type: "integer", minimum: 0 },
        recordedUnits: { type: "integer", minimum: 0 },
      },
      required: ["packages", "unitsPerPackage", "looseUnits", "recordedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedUnits: { type: "integer" },
        discrepancy: { type: "integer" },
      },
      required: ["expandedUnits", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "packages",
          label: "Packages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPackage",
          label: "Units Per Package",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedUnits",
          label: "Recorded Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expandedUnits",
          label: "Expanded Units",
          valueType: { type: "integer" },
        },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLotPackageConversionGapTool.execute;
export default foodLotPackageConversionGapTool;
