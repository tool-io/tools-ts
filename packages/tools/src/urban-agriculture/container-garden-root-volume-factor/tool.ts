import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossVolume: number;
  readonly drainageVolume: number;
  readonly occupiedVolume: number;
  readonly plants: number;
};
export type Output = {
  readonly usableVolume: number;
  readonly volumePerPlant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolume: { type: "number" },
    drainageVolume: { type: "number", minimum: 0 },
    occupiedVolume: { type: "number", minimum: 0 },
    plants: { type: "integer", minimum: 1 },
  },
  required: ["grossVolume", "drainageVolume", "occupiedVolume", "plants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableVolume: { type: "number" },
    volumePerPlant: { type: "number" },
  },
  required: ["usableVolume", "volumePerPlant"],
} as const;
/** Calculate container garden root volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossVolume, drainageVolume, occupiedVolume, plants } = request;
  const compute = (): Output => {
    H.integer(plants, 1);
    H.domain(
      grossVolume >= drainageVolume + occupiedVolume &&
        drainageVolume >= 0 &&
        occupiedVolume >= 0,
    );
    return {
      usableVolume: grossVolume - drainageVolume - occupiedVolume,
      volumePerPlant: (grossVolume - drainageVolume - occupiedVolume) / plants,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossVolume: 100,
    drainageVolume: 10,
    occupiedVolume: 20,
    plants: 5,
  },
  output: { usableVolume: 70, volumePerPlant: 14 },
} satisfies ToolExample<Input, Output>;
export const containerGardenRootVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/container-garden-root-volume-factor",
    title: "Container Garden Root Volume Factor Tool",
    description:
      "Calculate container garden root volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossVolume: { type: "number" },
        drainageVolume: { type: "number", minimum: 0 },
        occupiedVolume: { type: "number", minimum: 0 },
        plants: { type: "integer", minimum: 1 },
      },
      required: ["grossVolume", "drainageVolume", "occupiedVolume", "plants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableVolume: { type: "number" },
        volumePerPlant: { type: "number" },
      },
      required: ["usableVolume", "volumePerPlant"],
    },
    ports: {
      inputs: [
        {
          id: "grossVolume",
          label: "Gross Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainageVolume",
          label: "Drainage Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedVolume",
          label: "Occupied Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plants",
          label: "Plants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usableVolume",
          label: "Usable Volume",
          valueType: { type: "number" },
        },
        {
          id: "volumePerPlant",
          label: "Volume Per Plant",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = containerGardenRootVolumeFactorTool.execute;
export default containerGardenRootVolumeFactorTool;
