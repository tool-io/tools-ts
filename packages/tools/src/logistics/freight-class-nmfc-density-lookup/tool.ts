import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FreightClassNmfcDensityLookupInput = {
  readonly weightLb: number;
  readonly lengthIn: number;
  readonly widthIn: number;
  readonly heightIn: number;
};

export type FreightClassNmfcDensityLookupOutput = {
  readonly densityPcf: number;
  readonly nmfcClass: string;
};

/**
 * NMFC density guidelines: class from average pounds per cubic foot,
 * half-open intervals [lower, upper).
 */
const nmfcDensityClass = (densityPcf: number): string =>
  densityPcf < 1
    ? "500"
    : densityPcf < 2
      ? "400"
      : densityPcf < 3
        ? "300"
        : densityPcf < 4
          ? "250"
          : densityPcf < 5
            ? "200"
            : densityPcf < 6
              ? "175"
              : densityPcf < 7
                ? "150"
                : densityPcf < 8
                  ? "125"
                  : densityPcf < 9
                    ? "110"
                    : densityPcf < 10.5
                      ? "100"
                      : densityPcf < 12
                        ? "92.5"
                        : densityPcf < 13.5
                          ? "85"
                          : densityPcf < 15
                            ? "77.5"
                            : densityPcf < 22.5
                              ? "70"
                              : densityPcf < 30
                                ? "65"
                                : densityPcf < 35
                                  ? "60"
                                  : densityPcf < 50
                                    ? "55"
                                    : "50";

export const calculateFreightClassNmfcDensityLookup = (
  input: FreightClassNmfcDensityLookupInput,
): FreightClassNmfcDensityLookupOutput => {
  for (const key of ["weightLb", "lengthIn", "widthIn", "heightIn"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Weight and dimensions must be finite and greater than zero.",
        "invalid_measure",
      );
  }
  const cubicFeet = (input.lengthIn * input.widthIn * input.heightIn) / 1728;
  if (!Number.isFinite(cubicFeet) || cubicFeet <= 0)
    return simpleError(
      "lengthIn",
      "Carton volume is outside the representable range.",
      "invalid_volume",
    );
  const densityPcf = input.weightLb / cubicFeet;
  if (!Number.isFinite(densityPcf) || densityPcf <= 0)
    return simpleError(
      "weightLb",
      "Freight density is outside the representable range.",
      "density_out_of_range",
    );
  return { densityPcf, nmfcClass: nmfcDensityClass(densityPcf) };
};

export const freightClassNmfcDensityLookupExample = {
  input: { weightLb: 400, lengthIn: 48, widthIn: 40, heightIn: 36 },
  output: { densityPcf: 10, nmfcClass: "100" },
} satisfies ToolExample<
  FreightClassNmfcDensityLookupInput,
  FreightClassNmfcDensityLookupOutput
>;

export const freightClassNmfcDensityLookupTool = createSimpleTool({
  id: "logistics/freight-class-nmfc-density-lookup",
  title: "Freight Class NMFC Density Lookup",
  description:
    "Compute pallet or carton density in pounds per cubic foot and map it to the NMFC density scale. This is a density-only estimate; the applicable NMFC item and other classification characteristics can produce a different class.",
  inputs: [
    {
      description: "Total shipping weight in pounds.",
      id: "weightLb",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
      unit: "lb",
    },
    {
      description: "Longest side in inches.",
      id: "lengthIn",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description: "Middle side in inches.",
      id: "widthIn",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description: "Shortest side in inches.",
      id: "heightIn",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
  ],
  outputs: [
    {
      description: "Average density in pounds per cubic foot.",
      id: "densityPcf",
      kind: "number",
      label: "Density",
    },
    {
      description: "NMFC density-guideline freight class.",
      id: "nmfcClass",
      kind: "string",
      label: "NMFC class",
    },
  ],
  calculate: (input) =>
    calculateFreightClassNmfcDensityLookup({
      heightIn: input.heightIn as number,
      lengthIn: input.lengthIn as number,
      weightLb: input.weightLb as number,
      widthIn: input.widthIn as number,
    }),
});

export const runFreightClassNmfcDensityLookup =
  freightClassNmfcDensityLookupTool.execute;
export default freightClassNmfcDensityLookupTool;
