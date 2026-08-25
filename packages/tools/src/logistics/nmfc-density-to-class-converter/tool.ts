import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NmfcDensityToClassConverterInput = {
  readonly densityPcf: number;
};

export type NmfcDensityToClassConverterOutput = {
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

export const calculateNmfcDensityToClassConverter = (
  input: NmfcDensityToClassConverterInput,
): NmfcDensityToClassConverterOutput => {
  if (!Number.isFinite(input.densityPcf) || input.densityPcf <= 0)
    return simpleError(
      "densityPcf",
      "Density must be greater than zero pounds per cubic foot.",
      "invalid_density",
    );
  return { nmfcClass: nmfcDensityClass(input.densityPcf) };
};

export const nmfcDensityToClassConverterExample = {
  input: { densityPcf: 10 },
  output: { nmfcClass: "100" },
} satisfies ToolExample<
  NmfcDensityToClassConverterInput,
  NmfcDensityToClassConverterOutput
>;

export const nmfcDensityToClassConverterTool = createSimpleTool({
  id: "logistics/nmfc-density-to-class-converter",
  title: "NMFC Density to Class Converter",
  description:
    "Convert a known average density in pounds per cubic foot to the NMFC density-guideline freight class (50-500).",
  inputs: [
    {
      description: "Average density in pounds per cubic foot.",
      id: "densityPcf",
      kind: "number",
      label: "Density",
      minimum: Number.MIN_VALUE,
      unit: "lb/ft³",
    },
  ],
  outputs: [
    {
      description: "NMFC density-guideline freight class.",
      id: "nmfcClass",
      kind: "string",
      label: "NMFC class",
    },
  ],
  calculate: (input) =>
    calculateNmfcDensityToClassConverter({
      densityPcf: input.densityPcf as number,
    }),
});

export const runNmfcDensityToClassConverter =
  nmfcDensityToClassConverterTool.execute;
export default nmfcDensityToClassConverterTool;
