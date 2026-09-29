import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly precipitation: number;
  readonly potentialEt: number;
  readonly openingStorage: number;
  readonly storageCapacity: number;
};
export type Output = {
  readonly climaticBalance: number;
  readonly closingStorage: number;
  readonly unmetPotentialEt: number;
  readonly overflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    precipitation: { type: "number", minimum: 0 },
    potentialEt: { type: "number", minimum: 0 },
    openingStorage: { type: "number", minimum: 0 },
    storageCapacity: { type: "number" },
  },
  required: [
    "precipitation",
    "potentialEt",
    "openingStorage",
    "storageCapacity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    climaticBalance: { type: "number" },
    closingStorage: { type: "number" },
    unmetPotentialEt: { type: "number" },
    overflow: { type: "number" },
  },
  required: [
    "climaticBalance",
    "closingStorage",
    "unmetPotentialEt",
    "overflow",
  ],
} as const;
/** One ideal bucket month with water available to ET before overflow; no runoff/infiltration timing or actual ET model is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { precipitation, potentialEt, openingStorage, storageCapacity } =
    request;
  const compute = (): Output => {
    H.domain(
      precipitation >= 0 &&
        potentialEt >= 0 &&
        openingStorage >= 0 &&
        openingStorage <= storageCapacity,
    );
    return {
      climaticBalance: precipitation - potentialEt,
      closingStorage: Math.min(
        storageCapacity,
        Math.max(0, openingStorage + precipitation - potentialEt),
      ),
      unmetPotentialEt: Math.max(
        0,
        potentialEt - openingStorage - precipitation,
      ),
      overflow: Math.max(
        0,
        openingStorage + precipitation - potentialEt - storageCapacity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    precipitation: 20,
    potentialEt: 50,
    openingStorage: 40,
    storageCapacity: 100,
  },
  output: {
    climaticBalance: -30,
    closingStorage: 10,
    unmetPotentialEt: 0,
    overflow: 0,
  },
} satisfies ToolExample<Input, Output>;
export const hydroclimaticWaterDeficitOneMonthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/hydroclimatic-water-deficit-one-month-term",
      title: "Hydroclimatic Water Deficit One Month Term Tool",
      description:
        "One ideal bucket month with water available to ET before overflow; no runoff/infiltration timing or actual ET model is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          precipitation: { type: "number", minimum: 0 },
          potentialEt: { type: "number", minimum: 0 },
          openingStorage: { type: "number", minimum: 0 },
          storageCapacity: { type: "number" },
        },
        required: [
          "precipitation",
          "potentialEt",
          "openingStorage",
          "storageCapacity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          climaticBalance: { type: "number" },
          closingStorage: { type: "number" },
          unmetPotentialEt: { type: "number" },
          overflow: { type: "number" },
        },
        required: [
          "climaticBalance",
          "closingStorage",
          "unmetPotentialEt",
          "overflow",
        ],
      },
      ports: {
        inputs: [
          {
            id: "precipitation",
            label: "Precipitation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "potentialEt",
            label: "Potential Et",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "openingStorage",
            label: "Opening Storage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "storageCapacity",
            label: "Storage Capacity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "climaticBalance",
            label: "Climatic Balance",
            valueType: { type: "number" },
          },
          {
            id: "closingStorage",
            label: "Closing Storage",
            valueType: { type: "number" },
          },
          {
            id: "unmetPotentialEt",
            label: "Unmet Potential Et",
            valueType: { type: "number" },
          },
          { id: "overflow", label: "Overflow", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = hydroclimaticWaterDeficitOneMonthTermTool.execute;
export default hydroclimaticWaterDeficitOneMonthTermTool;
