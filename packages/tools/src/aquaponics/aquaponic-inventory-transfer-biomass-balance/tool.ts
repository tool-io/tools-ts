import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMass: number;
  readonly receivedMass: number;
  readonly transferredMass: number;
  readonly harvestedMass: number;
  readonly measuredClosing: number;
};
export type Output = {
  readonly expectedClosing: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMass: { type: "number", minimum: 0 },
    receivedMass: { type: "number", minimum: 0 },
    transferredMass: { type: "number", minimum: 0 },
    harvestedMass: { type: "number", minimum: 0 },
    measuredClosing: { type: "number", minimum: 0 },
  },
  required: [
    "openingMass",
    "receivedMass",
    "transferredMass",
    "harvestedMass",
    "measuredClosing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosing: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedClosing", "residual"],
} as const;
/** Calculate aquaponic inventory transfer biomass balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingMass,
    receivedMass,
    transferredMass,
    harvestedMass,
    measuredClosing,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingMass >= 0 &&
        receivedMass >= 0 &&
        transferredMass >= 0 &&
        harvestedMass >= 0 &&
        measuredClosing >= 0,
    );
    return {
      expectedClosing:
        openingMass + receivedMass - transferredMass - harvestedMass,
      residual:
        measuredClosing -
        openingMass -
        receivedMass +
        transferredMass +
        harvestedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingMass: 100,
    receivedMass: 20,
    transferredMass: 30,
    harvestedMass: 10,
    measuredClosing: 85,
  },
  output: { expectedClosing: 80, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const aquaponicInventoryTransferBiomassBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-inventory-transfer-biomass-balance",
      title: "Aquaponic Inventory Transfer Biomass Balance Tool",
      description:
        "Calculate aquaponic inventory transfer biomass balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingMass: { type: "number", minimum: 0 },
          receivedMass: { type: "number", minimum: 0 },
          transferredMass: { type: "number", minimum: 0 },
          harvestedMass: { type: "number", minimum: 0 },
          measuredClosing: { type: "number", minimum: 0 },
        },
        required: [
          "openingMass",
          "receivedMass",
          "transferredMass",
          "harvestedMass",
          "measuredClosing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedClosing: { type: "number" },
          residual: { type: "number" },
        },
        required: ["expectedClosing", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "openingMass",
            label: "Opening Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receivedMass",
            label: "Received Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferredMass",
            label: "Transferred Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "harvestedMass",
            label: "Harvested Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredClosing",
            label: "Measured Closing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedClosing",
            label: "Expected Closing",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicInventoryTransferBiomassBalanceTool.execute;
export default aquaponicInventoryTransferBiomassBalanceTool;
