import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly firstLitersPerArea: number;
  readonly secondLitersPerArea: number;
  readonly fuelPrice: number;
};
export type Output = {
  readonly litersSaved: number;
  readonly costDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    firstLitersPerArea: { type: "number", minimum: 0 },
    secondLitersPerArea: { type: "number", minimum: 0 },
    fuelPrice: { type: "number", minimum: 0 },
  },
  required: ["area", "firstLitersPerArea", "secondLitersPerArea", "fuelPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    litersSaved: { type: "number" },
    costDifference: { type: "number" },
  },
  required: ["litersSaved", "costDifference"],
} as const;
/** Calculate fuel saving reduced pass one field from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, firstLitersPerArea, secondLitersPerArea, fuelPrice } = request;
  const compute = (): Output => {
    H.domain(
      area >= 0 &&
        firstLitersPerArea >= 0 &&
        secondLitersPerArea >= 0 &&
        fuelPrice >= 0,
    );
    return {
      litersSaved: area * (firstLitersPerArea - secondLitersPerArea),
      costDifference:
        area * (firstLitersPerArea - secondLitersPerArea) * fuelPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 10,
    firstLitersPerArea: 8,
    secondLitersPerArea: 5,
    fuelPrice: 2,
  },
  output: { litersSaved: 30, costDifference: 60 },
} satisfies ToolExample<Input, Output>;
export const fuelSavingReducedPassOneFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/fuel-saving-reduced-pass-one-field",
    title: "Fuel Saving Reduced Pass One Field Tool",
    description:
      "Calculate fuel saving reduced pass one field from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        firstLitersPerArea: { type: "number", minimum: 0 },
        secondLitersPerArea: { type: "number", minimum: 0 },
        fuelPrice: { type: "number", minimum: 0 },
      },
      required: [
        "area",
        "firstLitersPerArea",
        "secondLitersPerArea",
        "fuelPrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        litersSaved: { type: "number" },
        costDifference: { type: "number" },
      },
      required: ["litersSaved", "costDifference"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstLitersPerArea",
          label: "First Liters Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLitersPerArea",
          label: "Second Liters Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fuelPrice",
          label: "Fuel Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "litersSaved",
          label: "Liters Saved",
          valueType: { type: "number" },
        },
        {
          id: "costDifference",
          label: "Cost Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelSavingReducedPassOneFieldTool.execute;
export default fuelSavingReducedPassOneFieldTool;
