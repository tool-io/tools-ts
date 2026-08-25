import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OversizePackageThresholdCheckerInput = {
  readonly lengthIn: number;
  readonly widthIn: number;
  readonly heightIn: number;
  readonly maximumLengthIn?: number;
  readonly maximumLengthPlusGirthIn?: number;
};

export type OversizePackageThresholdCheckerOutput = {
  readonly girthIn: number;
  readonly lengthPlusGirthIn: number;
  readonly exceedsLengthLimit: boolean;
  readonly exceedsLengthPlusGirthLimit: boolean;
  readonly isOversizePackage: boolean;
};

export const calculateOversizePackageThresholdChecker = (
  input: OversizePackageThresholdCheckerInput,
): OversizePackageThresholdCheckerOutput => {
  for (const key of ["lengthIn", "widthIn", "heightIn"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Package dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const maximumLengthIn = input.maximumLengthIn ?? 108;
  const maximumLengthPlusGirthIn = input.maximumLengthPlusGirthIn ?? 165;
  if (!Number.isFinite(maximumLengthIn) || maximumLengthIn <= 0)
    return simpleError(
      "maximumLengthIn",
      "The length threshold must be greater than zero.",
      "invalid_threshold",
    );
  if (
    !Number.isFinite(maximumLengthPlusGirthIn) ||
    maximumLengthPlusGirthIn <= 0
  )
    return simpleError(
      "maximumLengthPlusGirthIn",
      "The length-plus-girth threshold must be greater than zero.",
      "invalid_threshold",
    );
  const [longestIn = 0, sideAIn = 0, sideBIn = 0] = [
    input.lengthIn,
    input.widthIn,
    input.heightIn,
  ].sort((a, b) => b - a);
  const girthIn = 2 * (sideAIn + sideBIn);
  const lengthPlusGirthIn = longestIn + girthIn;
  if (!Number.isFinite(girthIn) || !Number.isFinite(lengthPlusGirthIn))
    return simpleError(
      "lengthIn",
      "The package size is outside the representable range.",
      "size_out_of_range",
    );
  const exceedsLengthLimit = longestIn > maximumLengthIn;
  const exceedsLengthPlusGirthLimit =
    lengthPlusGirthIn > maximumLengthPlusGirthIn;
  return {
    girthIn,
    lengthPlusGirthIn,
    exceedsLengthLimit,
    exceedsLengthPlusGirthLimit,
    isOversizePackage: exceedsLengthLimit || exceedsLengthPlusGirthLimit,
  };
};

export const oversizePackageThresholdCheckerExample = {
  input: { lengthIn: 96, widthIn: 30, heightIn: 24 },
  output: {
    girthIn: 108,
    lengthPlusGirthIn: 204,
    exceedsLengthLimit: false,
    exceedsLengthPlusGirthLimit: true,
    isOversizePackage: true,
  },
} satisfies ToolExample<
  OversizePackageThresholdCheckerInput,
  OversizePackageThresholdCheckerOutput
>;

export const oversizePackageThresholdCheckerTool = createSimpleTool({
  id: "logistics/oversize-package-threshold-checker",
  title: "Oversize Package Threshold Checker",
  description:
    "Test a parcel against oversize thresholds using the longest side as length and twice the sum of the other sides as girth. Defaults are 108 in length and 165 in length-plus-girth; override them to match your carrier.",
  inputs: [
    {
      description:
        "One package dimension in inches; dimensions are sorted automatically.",
      id: "lengthIn",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description: "Second package dimension in inches.",
      id: "widthIn",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      description: "Third package dimension in inches.",
      id: "heightIn",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "in",
    },
    {
      default: 108,
      description:
        "Maximum single-side length in inches from your carrier tariff.",
      id: "maximumLengthIn",
      kind: "number",
      label: "Max length",
    },
    {
      default: 165,
      description:
        "Maximum length plus girth in inches from your carrier tariff.",
      id: "maximumLengthPlusGirthIn",
      kind: "number",
      label: "Max L+girth",
    },
  ],
  outputs: [
    {
      description: "Girth, twice the sum of the two shorter sides, in inches.",
      id: "girthIn",
      kind: "number",
      label: "Girth",
    },
    {
      description: "Length plus girth in inches.",
      id: "lengthPlusGirthIn",
      kind: "number",
      label: "L+girth",
    },
    {
      description: "Whether the longest side alone breaches the limit.",
      id: "exceedsLengthLimit",
      kind: "boolean",
      label: "Over length",
    },
    {
      description: "Whether length plus girth breaches the limit.",
      id: "exceedsLengthPlusGirthLimit",
      kind: "boolean",
      label: "Over L+girth",
    },
    {
      description: "Whether the package is oversize under either limit.",
      id: "isOversizePackage",
      kind: "boolean",
      label: "Oversize",
    },
  ],
  calculate: (input) =>
    calculateOversizePackageThresholdChecker({
      heightIn: input.heightIn as number,
      lengthIn: input.lengthIn as number,
      maximumLengthIn: input.maximumLengthIn as number | undefined,
      maximumLengthPlusGirthIn: input.maximumLengthPlusGirthIn as
        number | undefined,
      widthIn: input.widthIn as number,
    }),
});

export const runOversizePackageThresholdChecker =
  oversizePackageThresholdCheckerTool.execute;
export default oversizePackageThresholdCheckerTool;
