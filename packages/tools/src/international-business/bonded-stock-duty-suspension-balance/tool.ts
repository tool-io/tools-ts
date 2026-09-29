import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingUnits: number;
  readonly importedUnits: number;
  readonly exportedUnits: number;
  readonly domesticReleased: number;
  readonly destroyedUnits: number;
  readonly dutyPerUnit: number;
};
export type Output = {
  readonly closingBonded: number;
  readonly dutyOnRelease: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingUnits: { type: "integer", minimum: 0 },
    importedUnits: { type: "integer", minimum: 0 },
    exportedUnits: { type: "integer", minimum: 0 },
    domesticReleased: { type: "integer", minimum: 0 },
    destroyedUnits: { type: "integer", minimum: 0 },
    dutyPerUnit: { type: "number", minimum: 0 },
  },
  required: [
    "openingUnits",
    "importedUnits",
    "exportedUnits",
    "domesticReleased",
    "destroyedUnits",
    "dutyPerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingBonded: { type: "integer" },
    dutyOnRelease: { type: "number" },
  },
  required: ["closingBonded", "dutyOnRelease"],
} as const;
/** Explicit bonded-inventory ledger with duty charged only to the caller-designated domestic release quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingUnits,
    importedUnits,
    exportedUnits,
    domesticReleased,
    destroyedUnits,
    dutyPerUnit,
  } = request;
  const compute = (): Output => {
    H.integer(openingUnits, 0);
    H.integer(importedUnits, 0);
    H.integer(exportedUnits, 0);
    H.integer(domesticReleased, 0);
    H.integer(destroyedUnits, 0);
    H.domain(
      exportedUnits + domesticReleased + destroyedUnits <=
        openingUnits + importedUnits && dutyPerUnit >= 0,
    );
    return {
      closingBonded:
        openingUnits +
        importedUnits -
        exportedUnits -
        domesticReleased -
        destroyedUnits,
      dutyOnRelease: domesticReleased * dutyPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingUnits: 100,
    importedUnits: 50,
    exportedUnits: 40,
    domesticReleased: 20,
    destroyedUnits: 5,
    dutyPerUnit: 3,
  },
  output: { closingBonded: 85, dutyOnRelease: 60 },
} satisfies ToolExample<Input, Output>;
export const bondedStockDutySuspensionBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/bonded-stock-duty-suspension-balance",
    title: "Bonded Stock Duty Suspension Balance Tool",
    description:
      "Explicit bonded-inventory ledger with duty charged only to the caller-designated domestic release quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingUnits: { type: "integer", minimum: 0 },
        importedUnits: { type: "integer", minimum: 0 },
        exportedUnits: { type: "integer", minimum: 0 },
        domesticReleased: { type: "integer", minimum: 0 },
        destroyedUnits: { type: "integer", minimum: 0 },
        dutyPerUnit: { type: "number", minimum: 0 },
      },
      required: [
        "openingUnits",
        "importedUnits",
        "exportedUnits",
        "domesticReleased",
        "destroyedUnits",
        "dutyPerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingBonded: { type: "integer" },
        dutyOnRelease: { type: "number" },
      },
      required: ["closingBonded", "dutyOnRelease"],
    },
    ports: {
      inputs: [
        {
          id: "openingUnits",
          label: "Opening Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "importedUnits",
          label: "Imported Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exportedUnits",
          label: "Exported Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "domesticReleased",
          label: "Domestic Released",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyedUnits",
          label: "Destroyed Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dutyPerUnit",
          label: "Duty Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingBonded",
          label: "Closing Bonded",
          valueType: { type: "integer" },
        },
        {
          id: "dutyOnRelease",
          label: "Duty On Release",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bondedStockDutySuspensionBalanceTool.execute;
export default bondedStockDutySuspensionBalanceTool;
