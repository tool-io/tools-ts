import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccessoryValueRatioInput = {
  readonly maximumAllowedAccessoryValuePercent: number;
  readonly watchValueWithBoxAndPapers: number;
  readonly watchValueWithoutAccessories: number;
};

export type AccessoryValueRatioOutput = {
  readonly accessoryValueDifference: number;
  readonly accessoryValuePercentOfBase: number;
  readonly withinCallerPercentage: boolean;
  readonly valuationCaution: string;
};

export const screenBoxPapersValueRatio = (
  input: AccessoryValueRatioInput,
): AccessoryValueRatioOutput => {
  if (
    !Number.isFinite(input.watchValueWithoutAccessories) ||
    input.watchValueWithoutAccessories < 0
  )
    simpleError(
      "watchValueWithoutAccessories",
      "Base watch value must be finite and nonnegative.",
      "base_value_invalid",
    );
  if (
    !Number.isFinite(input.watchValueWithBoxAndPapers) ||
    input.watchValueWithBoxAndPapers < input.watchValueWithoutAccessories
  )
    simpleError(
      "watchValueWithBoxAndPapers",
      "With-accessories value must not be below the base value.",
      "with_accessories_value_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedAccessoryValuePercent) ||
    input.maximumAllowedAccessoryValuePercent < 0
  )
    simpleError(
      "maximumAllowedAccessoryValuePercent",
      "Accessory percentage limit must be finite and nonnegative.",
      "percentage_limit_invalid",
    );
  const accessoryValueDifference =
    input.watchValueWithBoxAndPapers - input.watchValueWithoutAccessories;
  const accessoryValuePercentOfBase =
    input.watchValueWithoutAccessories === 0
      ? 0
      : (100 * accessoryValueDifference) / input.watchValueWithoutAccessories;
  return {
    accessoryValueDifference,
    accessoryValuePercentOfBase,
    valuationCaution:
      "Originality, maker, reference, completeness, condition, provenance, and market demand determine accessory value; this ratio does not create a universal box-and-papers premium.",
    withinCallerPercentage:
      accessoryValuePercentOfBase <= input.maximumAllowedAccessoryValuePercent,
  };
};

export const accessoryValueRatioExample = {
  input: {
    maximumAllowedAccessoryValuePercent: 20,
    watchValueWithBoxAndPapers: 12_000,
    watchValueWithoutAccessories: 10_000,
  },
  output: {
    accessoryValueDifference: 2000,
    accessoryValuePercentOfBase: 20,
    valuationCaution:
      "Originality, maker, reference, completeness, condition, provenance, and market demand determine accessory value; this ratio does not create a universal box-and-papers premium.",
    withinCallerPercentage: true,
  },
} satisfies ToolExample<AccessoryValueRatioInput, AccessoryValueRatioOutput>;

export const accessoryValueRatioTool = createSimpleTool({
  calculate: (input) =>
    screenBoxPapersValueRatio({
      maximumAllowedAccessoryValuePercent:
        input.maximumAllowedAccessoryValuePercent as number,
      watchValueWithBoxAndPapers: input.watchValueWithBoxAndPapers as number,
      watchValueWithoutAccessories:
        input.watchValueWithoutAccessories as number,
    }),
  description:
    "Screen the value difference assigned to a box and papers against a caller-defined percentage limit without claiming a universal collector premium.",
  id: "horology/box-papers-accessory-value-ratio-screen",
  inputs: [
    {
      id: "maximumAllowedAccessoryValuePercent",
      kind: "number",
      label: "Maximum allowed accessory value percentage",
      minimum: 0,
      unit: "%",
    },
    {
      id: "watchValueWithBoxAndPapers",
      kind: "number",
      label: "Value with box and papers",
      minimum: 0,
    },
    {
      id: "watchValueWithoutAccessories",
      kind: "number",
      label: "Value without accessories",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "accessoryValueDifference",
      kind: "number",
      label: "Accessory value difference",
      minimum: 0,
    },
    {
      id: "accessoryValuePercentOfBase",
      kind: "number",
      label: "Accessory value as percent of base",
      minimum: 0,
      unit: "%",
    },
    { id: "valuationCaution", kind: "string", label: "Valuation caution" },
    {
      id: "withinCallerPercentage",
      kind: "boolean",
      label: "Within caller percentage",
    },
  ],
  title: "Box Papers Accessory Value Ratio Screen",
});

export const runAccessoryValueRatio = accessoryValueRatioTool.execute;
export default accessoryValueRatioTool;
