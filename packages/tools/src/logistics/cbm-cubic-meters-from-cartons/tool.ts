import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CbmCubicMetersFromCartonsInput = {
  readonly cartonLengthCm: number;
  readonly cartonWidthCm: number;
  readonly cartonHeightCm: number;
  readonly cartonCount?: number;
};

export type CbmCubicMetersFromCartonsOutput = {
  readonly volumePerCartonCbm: number;
  readonly totalVolumeCbm: number;
};

export const calculateCbmCubicMetersFromCartons = (
  input: CbmCubicMetersFromCartonsInput,
): CbmCubicMetersFromCartonsOutput => {
  for (const key of [
    "cartonLengthCm",
    "cartonWidthCm",
    "cartonHeightCm",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Carton dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  const cartonCount = input.cartonCount === undefined ? 1 : input.cartonCount;
  if (!(Number.isSafeInteger(cartonCount) && cartonCount >= 1))
    return simpleError(
      "cartonCount",
      "The carton count must be a safe integer of at least one.",
      "invalid_quantity",
    );
  const cubicCentimetres =
    input.cartonLengthCm * input.cartonWidthCm * input.cartonHeightCm;
  let volumePerCartonCbm = cubicCentimetres / 1_000_000;
  if (!Number.isFinite(volumePerCartonCbm) || volumePerCartonCbm <= 0)
    volumePerCartonCbm = Math.exp(
      Math.log(input.cartonLengthCm) +
        Math.log(input.cartonWidthCm) +
        Math.log(input.cartonHeightCm) -
        Math.log(1_000_000),
    );
  if (!Number.isFinite(volumePerCartonCbm) || volumePerCartonCbm <= 0)
    return simpleError(
      "cartonLengthCm",
      "The carton volume is outside the representable range.",
      "volume_out_of_range",
    );
  const totalVolumeCbm = volumePerCartonCbm * cartonCount;
  if (!Number.isFinite(totalVolumeCbm) || totalVolumeCbm <= 0)
    return simpleError(
      "cartonCount",
      "The total carton volume is outside the representable range.",
      "volume_out_of_range",
    );
  return { volumePerCartonCbm, totalVolumeCbm };
};

export const cbmCubicMetersFromCartonsExample = {
  input: {
    cartonLengthCm: 60,
    cartonWidthCm: 40,
    cartonHeightCm: 40,
    cartonCount: 25,
  },
  output: { volumePerCartonCbm: 0.096, totalVolumeCbm: 2.4 },
} satisfies ToolExample<
  CbmCubicMetersFromCartonsInput,
  CbmCubicMetersFromCartonsOutput
>;

export const cbmCubicMetersFromCartonsTool = createSimpleTool({
  id: "logistics/cbm-cubic-meters-from-cartons",
  title: "CBM Cubic Meters from Cartons",
  description:
    "Convert centimetre carton dimensions into cubic metres per carton and the shipment total for a carton count.",
  inputs: [
    {
      description: "Carton length in centimetres.",
      id: "cartonLengthCm",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton width in centimetres.",
      id: "cartonWidthCm",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton height in centimetres.",
      id: "cartonHeightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 1,
      description: "Number of identical cartons.",
      id: "cartonCount",
      kind: "integer",
      label: "Cartons",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Volume of one carton in cubic metres.",
      id: "volumePerCartonCbm",
      kind: "number",
      label: "Per carton",
      minimum: Number.MIN_VALUE,
      unit: "m³",
    },
    {
      description: "Total shipment volume in cubic metres.",
      id: "totalVolumeCbm",
      kind: "number",
      label: "Total CBM",
      minimum: Number.MIN_VALUE,
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateCbmCubicMetersFromCartons({
      cartonCount: input.cartonCount as number,
      cartonHeightCm: input.cartonHeightCm as number,
      cartonLengthCm: input.cartonLengthCm as number,
      cartonWidthCm: input.cartonWidthCm as number,
    }),
});

export const runCbmCubicMetersFromCartons =
  cbmCubicMetersFromCartonsTool.execute;
export default cbmCubicMetersFromCartonsTool;
