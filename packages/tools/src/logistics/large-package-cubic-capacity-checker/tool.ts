import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LargePackageCubicCapacityCheckerInput = {
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly cartonQuantity?: number;
  readonly maximumVolumeCm3: number;
};

export type LargePackageCubicCapacityCheckerOutput = {
  readonly totalVolumeCm3: number;
  readonly capacityUtilizationPercent: number;
  readonly withinCapacity: boolean;
};

export const calculateLargePackageCubicCapacityChecker = (
  input: LargePackageCubicCapacityCheckerInput,
): LargePackageCubicCapacityCheckerOutput => {
  for (const key of [
    "lengthCm",
    "widthCm",
    "heightCm",
    "maximumVolumeCm3",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Dimensions and the capacity limit must be finite and greater than zero.",
        "invalid_measure",
      );
  }
  const cartonQuantity = input.cartonQuantity ?? 1;
  if (!(Number.isSafeInteger(cartonQuantity) && cartonQuantity >= 1))
    return simpleError(
      "cartonQuantity",
      "The carton quantity must be a positive whole number.",
      "invalid_quantity",
    );
  const totalVolumeCm3 =
    input.lengthCm * input.widthCm * input.heightCm * cartonQuantity;
  const capacityUtilizationPercent =
    (totalVolumeCm3 / input.maximumVolumeCm3) * 100;
  if (
    !Number.isFinite(totalVolumeCm3) ||
    totalVolumeCm3 <= 0 ||
    !Number.isFinite(capacityUtilizationPercent) ||
    capacityUtilizationPercent <= 0
  )
    return simpleError(
      "lengthCm",
      "The shipment volume is outside the representable range.",
      "volume_out_of_range",
    );
  return {
    totalVolumeCm3,
    capacityUtilizationPercent,
    withinCapacity: totalVolumeCm3 <= input.maximumVolumeCm3,
  };
};

export const largePackageCubicCapacityCheckerExample = {
  input: { lengthCm: 60, widthCm: 40, heightCm: 40, maximumVolumeCm3: 120000 },
  output: {
    totalVolumeCm3: 96000,
    capacityUtilizationPercent: 80,
    withinCapacity: true,
  },
} satisfies ToolExample<
  LargePackageCubicCapacityCheckerInput,
  LargePackageCubicCapacityCheckerOutput
>;

export const largePackageCubicCapacityCheckerTool = createSimpleTool({
  id: "logistics/large-package-cubic-capacity-checker",
  title: "Large Package Cubic Capacity Checker",
  description:
    "Total the cubic volume of a carton quantity and report utilization against a shipment-level cubic capacity limit.",
  inputs: [
    {
      description: "Longest carton side in centimetres.",
      id: "lengthCm",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Middle carton side in centimetres.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Shortest carton side in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 1,
      description: "Number of identical cartons.",
      id: "cartonQuantity",
      kind: "integer",
      label: "Cartons",
      minimum: 1,
    },
    {
      description:
        "Maximum allowed volume for the shipment in cubic centimetres.",
      id: "maximumVolumeCm3",
      kind: "number",
      label: "Max volume",
      minimum: Number.MIN_VALUE,
      unit: "cm³",
    },
  ],
  outputs: [
    {
      description: "Total shipped volume in cubic centimetres.",
      id: "totalVolumeCm3",
      kind: "number",
      label: "Total volume",
    },
    {
      description: "Shipped volume as a percentage of the capacity limit.",
      id: "capacityUtilizationPercent",
      kind: "number",
      label: "Utilization %",
    },
    {
      description: "Whether the shipment fits within the capacity limit.",
      id: "withinCapacity",
      kind: "boolean",
      label: "Within capacity",
    },
  ],
  calculate: (input) =>
    calculateLargePackageCubicCapacityChecker({
      cartonQuantity: input.cartonQuantity as number | undefined,
      heightCm: input.heightCm as number,
      lengthCm: input.lengthCm as number,
      maximumVolumeCm3: input.maximumVolumeCm3 as number,
      widthCm: input.widthCm as number,
    }),
});

export const runLargePackageCubicCapacityChecker =
  largePackageCubicCapacityCheckerTool.execute;
export default largePackageCubicCapacityCheckerTool;
