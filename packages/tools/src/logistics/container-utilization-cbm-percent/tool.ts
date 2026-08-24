import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContainerUtilizationCbmPercentInput = {
  readonly usedVolumeCbm: number;
  readonly containerCapacityCbm: number;
};

export type ContainerUtilizationCbmPercentOutput = {
  readonly utilizationPercent: number;
  readonly freeVolumeCbm: number;
};

export const calculateContainerUtilizationCbmPercent = (
  input: ContainerUtilizationCbmPercentInput,
): ContainerUtilizationCbmPercentOutput => {
  if (!Number.isFinite(input.usedVolumeCbm) || input.usedVolumeCbm < 0)
    return simpleError(
      "usedVolumeCbm",
      "The used volume must be finite and non-negative.",
      "invalid_volume",
    );
  if (
    !Number.isFinite(input.containerCapacityCbm) ||
    input.containerCapacityCbm <= 0
  )
    return simpleError(
      "containerCapacityCbm",
      "The container capacity must be finite and greater than zero.",
      "invalid_capacity",
    );
  if (input.usedVolumeCbm > input.containerCapacityCbm)
    return simpleError(
      "usedVolumeCbm",
      "The used volume cannot exceed the container capacity.",
      "invalid_volume",
    );
  return {
    utilizationPercent:
      input.usedVolumeCbm === 0
        ? 0
        : (input.usedVolumeCbm / input.containerCapacityCbm) * 100,
    freeVolumeCbm: input.containerCapacityCbm - input.usedVolumeCbm,
  };
};

export const containerUtilizationCbmPercentExample = {
  input: { usedVolumeCbm: 28.4, containerCapacityCbm: 33.2 },
  output: {
    utilizationPercent: 85.54216867469879,
    freeVolumeCbm: 4.800000000000004,
  },
} satisfies ToolExample<
  ContainerUtilizationCbmPercentInput,
  ContainerUtilizationCbmPercentOutput
>;

export const containerUtilizationCbmPercentTool = createSimpleTool({
  id: "logistics/container-utilization-cbm-percent",
  title: "Container Utilization CBM Percent",
  description:
    "Report stowed cargo volume as a percentage of the container's cubic capacity and the remaining free space in cubic metres.",
  inputs: [
    {
      description: "Cargo volume already planned or stuffed, in cubic metres.",
      id: "usedVolumeCbm",
      kind: "number",
      label: "Used volume",
      minimum: 0,
      unit: "m³",
    },
    {
      description: "Usable capacity of the container in cubic metres.",
      id: "containerCapacityCbm",
      kind: "number",
      label: "Capacity",
      minimum: Number.MIN_VALUE,
      unit: "m³",
    },
  ],
  outputs: [
    {
      description: "Used volume as a percentage of capacity.",
      id: "utilizationPercent",
      kind: "number",
      label: "Utilization",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Remaining free volume in cubic metres.",
      id: "freeVolumeCbm",
      kind: "number",
      label: "Free volume",
      minimum: 0,
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateContainerUtilizationCbmPercent({
      containerCapacityCbm: input.containerCapacityCbm as number,
      usedVolumeCbm: input.usedVolumeCbm as number,
    }),
});

export const runContainerUtilizationCbmPercent =
  containerUtilizationCbmPercentTool.execute;
export default containerUtilizationCbmPercentTool;
