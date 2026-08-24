import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RackCubeUtilizationPercentInput = {
  readonly occupiedStoragePositions: number;
  readonly totalStoragePositions: number;
  readonly storedVolumeCbm: number;
  readonly rackVolumeCapacityCbm: number;
};

export type RackCubeUtilizationPercentOutput = {
  readonly positionUtilizationPercent: number;
  readonly cubeUtilizationPercent: number;
};

export const calculateRackCubeUtilizationPercent = (
  input: RackCubeUtilizationPercentInput,
): RackCubeUtilizationPercentOutput => {
  for (const key of [
    "occupiedStoragePositions",
    "totalStoragePositions",
  ] as const) {
    const value = input[key];
    if (!(Number.isSafeInteger(value) && value >= 0))
      return simpleError(
        key,
        "Storage position counts must be whole numbers of zero or more.",
        "invalid_positions",
      );
  }
  if (input.occupiedStoragePositions > input.totalStoragePositions)
    return simpleError(
      "occupiedStoragePositions",
      "Occupied positions cannot exceed total positions.",
      "invalid_positions",
    );
  if (!(input.totalStoragePositions > 0))
    return simpleError(
      "totalStoragePositions",
      "The total position count must be greater than zero.",
      "invalid_positions",
    );
  if (
    !Number.isFinite(input.rackVolumeCapacityCbm) ||
    input.rackVolumeCapacityCbm <= 0
  )
    return simpleError(
      "rackVolumeCapacityCbm",
      "The rack capacity must be finite and greater than zero.",
      "invalid_capacity",
    );
  if (!Number.isFinite(input.storedVolumeCbm) || input.storedVolumeCbm < 0)
    return simpleError(
      "storedVolumeCbm",
      "The stored volume must be finite and non-negative.",
      "invalid_volume",
    );
  if (input.storedVolumeCbm > input.rackVolumeCapacityCbm)
    return simpleError(
      "storedVolumeCbm",
      "The stored volume cannot exceed the rack capacity.",
      "invalid_volume",
    );
  const positionUtilizationPercent =
    (input.occupiedStoragePositions / input.totalStoragePositions) * 100;
  let cubeUtilizationPercent =
    (input.storedVolumeCbm / input.rackVolumeCapacityCbm) * 100;
  if (cubeUtilizationPercent === 0 && input.storedVolumeCbm > 0)
    cubeUtilizationPercent =
      (input.storedVolumeCbm * 100) / input.rackVolumeCapacityCbm;
  if (input.storedVolumeCbm > 0 && cubeUtilizationPercent <= 0)
    return simpleError(
      "storedVolumeCbm",
      "Cube utilization is outside the representable range.",
      "utilization_out_of_range",
    );
  return { positionUtilizationPercent, cubeUtilizationPercent };
};

export const rackCubeUtilizationPercentExample = {
  input: {
    occupiedStoragePositions: 148,
    totalStoragePositions: 160,
    storedVolumeCbm: 310.4,
    rackVolumeCapacityCbm: 340,
  },
  output: {
    positionUtilizationPercent: 92.5,
    cubeUtilizationPercent: 91.29411764705881,
  },
} satisfies ToolExample<
  RackCubeUtilizationPercentInput,
  RackCubeUtilizationPercentOutput
>;

export const rackCubeUtilizationPercentTool = createSimpleTool({
  id: "logistics/rack-cube-utilization-percent",
  title: "Rack Cube Utilization Percent",
  description:
    "Report warehouse racking utilization both by storage positions occupied and by cubic volume stored against capacity.",
  inputs: [
    {
      description: "Rack positions currently holding pallets or totes.",
      id: "occupiedStoragePositions",
      kind: "integer",
      label: "Occupied",
      minimum: 0,
    },
    {
      description: "Total rack positions in the area.",
      id: "totalStoragePositions",
      kind: "integer",
      label: "Total positions",
      minimum: 1,
    },
    {
      description: "Volume currently stored in cubic metres.",
      id: "storedVolumeCbm",
      kind: "number",
      label: "Stored CBM",
      minimum: 0,
      unit: "m³",
    },
    {
      description: "Usable rack volume capacity in cubic metres.",
      id: "rackVolumeCapacityCbm",
      kind: "number",
      label: "Capacity CBM",
      minimum: Number.MIN_VALUE,
      unit: "m³",
    },
  ],
  outputs: [
    {
      description: "Occupied positions as a percentage of total positions.",
      id: "positionUtilizationPercent",
      kind: "number",
      label: "Position %",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      description: "Stored volume as a percentage of rack capacity.",
      id: "cubeUtilizationPercent",
      kind: "number",
      label: "Cube %",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateRackCubeUtilizationPercent({
      occupiedStoragePositions: input.occupiedStoragePositions as number,
      rackVolumeCapacityCbm: input.rackVolumeCapacityCbm as number,
      storedVolumeCbm: input.storedVolumeCbm as number,
      totalStoragePositions: input.totalStoragePositions as number,
    }),
});

export const runRackCubeUtilizationPercent =
  rackCubeUtilizationPercentTool.execute;
export default rackCubeUtilizationPercentTool;
