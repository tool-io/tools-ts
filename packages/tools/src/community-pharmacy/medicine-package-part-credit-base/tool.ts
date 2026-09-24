import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullPackages: number;
  readonly unitsPerPackage: number;
  readonly looseUnits: number;
  readonly creditLoose: boolean;
};
export type Output = {
  readonly creditedUnits: number;
  readonly looseCredited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPackages: { type: "integer", minimum: 0 },
    unitsPerPackage: { type: "integer", minimum: 1 },
    looseUnits: { type: "integer", minimum: 0 },
    creditLoose: { type: "boolean" },
  },
  required: ["fullPackages", "unitsPerPackage", "looseUnits", "creditLoose"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedUnits: { type: "integer" },
    looseCredited: { type: "integer" },
  },
  required: ["creditedUnits", "looseCredited"],
} as const;
/** Administrative stock-credit unit accounting under a supplied partial-package policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullPackages, unitsPerPackage, looseUnits, creditLoose } = request;
  const compute = (): Output => {
    H.integer(fullPackages, 0);
    H.integer(unitsPerPackage, 1);
    H.integer(looseUnits, 0);
    const looseCredited = creditLoose ? looseUnits : 0;
    return {
      creditedUnits: Number(
        BigInt(fullPackages) * BigInt(unitsPerPackage) + BigInt(looseCredited),
      ),
      looseCredited,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fullPackages: 3,
    unitsPerPackage: 10,
    looseUnits: 4,
    creditLoose: true,
  },
  output: { creditedUnits: 34, looseCredited: 4 },
} satisfies ToolExample<Input, Output>;
export const medicinePackagePartCreditBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/medicine-package-part-credit-base",
    title: "Medicine Package Part Credit Base Tool",
    description:
      "Administrative stock-credit unit accounting under a supplied partial-package policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPackages: { type: "integer", minimum: 0 },
        unitsPerPackage: { type: "integer", minimum: 1 },
        looseUnits: { type: "integer", minimum: 0 },
        creditLoose: { type: "boolean" },
      },
      required: [
        "fullPackages",
        "unitsPerPackage",
        "looseUnits",
        "creditLoose",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedUnits: { type: "integer" },
        looseCredited: { type: "integer" },
      },
      required: ["creditedUnits", "looseCredited"],
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
        {
          id: "creditLoose",
          label: "Credit Loose",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditedUnits",
          label: "Credited Units",
          valueType: { type: "integer" },
        },
        {
          id: "looseCredited",
          label: "Loose Credited",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicinePackagePartCreditBaseTool.execute;
export default medicinePackagePartCreditBaseTool;
