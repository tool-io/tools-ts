import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingHeads: number;
  readonly closingHeads: number;
  readonly openingMeanMass: number;
  readonly closingMeanMass: number;
  readonly pricePerMass: number;
};
export type Output = {
  readonly openingValue: number;
  readonly closingValue: number;
  readonly inventoryChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingHeads: { type: "integer", minimum: 0 },
    closingHeads: { type: "integer", minimum: 0 },
    openingMeanMass: { type: "number", minimum: 0 },
    closingMeanMass: { type: "number", minimum: 0 },
    pricePerMass: { type: "number", minimum: 0 },
  },
  required: [
    "openingHeads",
    "closingHeads",
    "openingMeanMass",
    "closingMeanMass",
    "pricePerMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingValue: { type: "number" },
    closingValue: { type: "number" },
    inventoryChange: { type: "number" },
  },
  required: ["openingValue", "closingValue", "inventoryChange"],
} as const;
/** Calculate livestock inventory liveweight value term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingHeads,
    closingHeads,
    openingMeanMass,
    closingMeanMass,
    pricePerMass,
  } = request;
  const compute = (): Output => {
    H.integer(openingHeads, 0);
    H.integer(closingHeads, 0);
    H.domain(openingMeanMass >= 0 && closingMeanMass >= 0 && pricePerMass >= 0);
    return {
      openingValue: openingHeads * openingMeanMass * pricePerMass,
      closingValue: closingHeads * closingMeanMass * pricePerMass,
      inventoryChange:
        (closingHeads * closingMeanMass - openingHeads * openingMeanMass) *
        pricePerMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingHeads: 10,
    closingHeads: 12,
    openingMeanMass: 100,
    closingMeanMass: 110,
    pricePerMass: 2,
  },
  output: { openingValue: 2000, closingValue: 2640, inventoryChange: 640 },
} satisfies ToolExample<Input, Output>;
export const livestockInventoryLiveweightValueTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-economics/livestock-inventory-liveweight-value-term",
      title: "Livestock Inventory Liveweight Value Term Tool",
      description:
        "Calculate livestock inventory liveweight value term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingHeads: { type: "integer", minimum: 0 },
          closingHeads: { type: "integer", minimum: 0 },
          openingMeanMass: { type: "number", minimum: 0 },
          closingMeanMass: { type: "number", minimum: 0 },
          pricePerMass: { type: "number", minimum: 0 },
        },
        required: [
          "openingHeads",
          "closingHeads",
          "openingMeanMass",
          "closingMeanMass",
          "pricePerMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingValue: { type: "number" },
          closingValue: { type: "number" },
          inventoryChange: { type: "number" },
        },
        required: ["openingValue", "closingValue", "inventoryChange"],
      },
      ports: {
        inputs: [
          {
            id: "openingHeads",
            label: "Opening Heads",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "closingHeads",
            label: "Closing Heads",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "openingMeanMass",
            label: "Opening Mean Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "closingMeanMass",
            label: "Closing Mean Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pricePerMass",
            label: "Price Per Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "openingValue",
            label: "Opening Value",
            valueType: { type: "number" },
          },
          {
            id: "closingValue",
            label: "Closing Value",
            valueType: { type: "number" },
          },
          {
            id: "inventoryChange",
            label: "Inventory Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = livestockInventoryLiveweightValueTermTool.execute;
export default livestockInventoryLiveweightValueTermTool;
