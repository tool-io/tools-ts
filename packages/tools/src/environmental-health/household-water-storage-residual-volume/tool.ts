import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly incoming: number;
  readonly drawn: number;
  readonly evaporation: number;
  readonly unusableReserve: number;
};
export type Output = {
  readonly physicalVolume: number;
  readonly usableVolume: number;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    incoming: { type: "number", minimum: 0 },
    drawn: { type: "number", minimum: 0 },
    evaporation: { type: "number", minimum: 0 },
    unusableReserve: { type: "number", minimum: 0 },
  },
  required: ["opening", "incoming", "drawn", "evaporation", "unusableReserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalVolume: { type: "number" },
    usableVolume: { type: "number" },
    shortfall: { type: "number" },
  },
  required: ["physicalVolume", "usableVolume", "shortfall"],
} as const;
/** Calculate household water storage residual volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, incoming, drawn, evaporation, unusableReserve } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        incoming >= 0 &&
        drawn >= 0 &&
        evaporation >= 0 &&
        unusableReserve >= 0 &&
        drawn + evaporation <= opening + incoming,
    );
    return {
      physicalVolume: opening + incoming - drawn - evaporation,
      usableVolume: Math.max(
        0,
        opening + incoming - drawn - evaporation - unusableReserve,
      ),
      shortfall: Math.max(
        0,
        unusableReserve - opening - incoming + drawn + evaporation,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    incoming: 20,
    drawn: 60,
    evaporation: 5,
    unusableReserve: 10,
  },
  output: { physicalVolume: 55, usableVolume: 45, shortfall: 0 },
} satisfies ToolExample<Input, Output>;
export const householdWaterStorageResidualVolumeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/household-water-storage-residual-volume",
      title: "Household Water Storage Residual Volume Tool",
      description:
        "Calculate household water storage residual volume from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "number", minimum: 0 },
          incoming: { type: "number", minimum: 0 },
          drawn: { type: "number", minimum: 0 },
          evaporation: { type: "number", minimum: 0 },
          unusableReserve: { type: "number", minimum: 0 },
        },
        required: [
          "opening",
          "incoming",
          "drawn",
          "evaporation",
          "unusableReserve",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physicalVolume: { type: "number" },
          usableVolume: { type: "number" },
          shortfall: { type: "number" },
        },
        required: ["physicalVolume", "usableVolume", "shortfall"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incoming",
            label: "Incoming",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "drawn",
            label: "Drawn",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporation",
            label: "Evaporation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unusableReserve",
            label: "Unusable Reserve",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "physicalVolume",
            label: "Physical Volume",
            valueType: { type: "number" },
          },
          {
            id: "usableVolume",
            label: "Usable Volume",
            valueType: { type: "number" },
          },
          {
            id: "shortfall",
            label: "Shortfall",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdWaterStorageResidualVolumeTool.execute;
export default householdWaterStorageResidualVolumeTool;
