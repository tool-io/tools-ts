import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullPackages: number;
  readonly unitsPerPackage: number;
  readonly looseUnits: number;
};
export type Output = { readonly totalUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPackages: { type: "integer", minimum: 0 },
    unitsPerPackage: { type: "integer", minimum: 1 },
    looseUnits: { type: "integer", minimum: 0 },
  },
  required: ["fullPackages", "unitsPerPackage", "looseUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalUnits: { type: "integer" } },
  required: ["totalUnits"],
} as const;
/** Count a seed-lot package inventory from complete packages and a smaller loose remainder without inferring viable-seed counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullPackages, unitsPerPackage, looseUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(fullPackages) &&
        fullPackages >= 0 &&
        fullPackages <= Number.MAX_SAFE_INTEGER,
      "fullPackages",
    ),
      fullPackages);
    (H.domain(
      Number.isSafeInteger(unitsPerPackage) &&
        unitsPerPackage >= 1 &&
        unitsPerPackage <= Number.MAX_SAFE_INTEGER,
      "unitsPerPackage",
    ),
      unitsPerPackage);
    (H.domain(
      Number.isSafeInteger(looseUnits) &&
        looseUnits >= 0 &&
        looseUnits <= unitsPerPackage - 1,
      "looseUnits",
    ),
      looseUnits);
    return { totalUnits: fullPackages * unitsPerPackage + looseUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullPackages: 8, unitsPerPackage: 1000, looseUnits: 250 },
  output: { totalUnits: 8250 },
} satisfies ToolExample<Input, Output>;
export const seedLotPackageUnitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/seed-lot-package-unit-count",
    title: "Seed Lot Package Unit Count",
    description:
      "Count a seed-lot package inventory from complete packages and a smaller loose remainder without inferring viable-seed counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPackages: { type: "integer", minimum: 0 },
        unitsPerPackage: { type: "integer", minimum: 1 },
        looseUnits: { type: "integer", minimum: 0 },
      },
      required: ["fullPackages", "unitsPerPackage", "looseUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalUnits: { type: "integer" } },
      required: ["totalUnits"],
    },
    ports: {
      inputs: [
        {
          id: "fullPackages",
          label: "Full Packages",
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
      ],
      outputs: [
        {
          id: "totalUnits",
          label: "Total Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedLotPackageUnitCountTool.execute;
export default seedLotPackageUnitCountTool;
