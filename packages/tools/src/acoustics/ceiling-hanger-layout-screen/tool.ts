import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ceilingLengthMeters: number;
  readonly ceilingLoadKilonewtons: number;
  readonly ceilingWidthMeters: number;
  readonly hangerCapacityKilonewtons: number;
  readonly maximumSpacingXMeters: number;
  readonly maximumSpacingYMeters: number;
}>;
export type Output = Readonly<{
  readonly capacityMarginKilonewtons: number;
  readonly estimatedHangerCount: number;
  readonly ratedCapacitySufficient: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "Dimensions, loads, spacing, and capacity must be finite and positive.",
        "invalid_value",
      );
  const columns =
    Math.ceil(input.ceilingLengthMeters / input.maximumSpacingXMeters) + 1;
  const rows =
    Math.ceil(input.ceilingWidthMeters / input.maximumSpacingYMeters) + 1;
  const estimatedHangerCount = columns * rows;
  if (!Number.isSafeInteger(estimatedHangerCount))
    simpleError(
      "maximumSpacingXMeters",
      "Grid dimensions produce too many hangers to represent safely.",
      "numeric_overflow",
    );
  const capacityMarginKilonewtons =
    estimatedHangerCount * input.hangerCapacityKilonewtons -
    input.ceilingLoadKilonewtons;
  if (!Number.isFinite(capacityMarginKilonewtons))
    simpleError(
      "hangerCapacityKilonewtons",
      "Rated capacity margin is out of range.",
      "numeric_overflow",
    );
  return {
    capacityMarginKilonewtons,
    estimatedHangerCount,
    ratedCapacitySufficient: capacityMarginKilonewtons >= 0,
  };
};

export const example = {
  input: {
    ceilingLengthMeters: 6,
    ceilingLoadKilonewtons: 20,
    ceilingWidthMeters: 4,
    hangerCapacityKilonewtons: 2,
    maximumSpacingXMeters: 2,
    maximumSpacingYMeters: 2,
  },
  output: {
    capacityMarginKilonewtons: 4,
    estimatedHangerCount: 12,
    ratedCapacitySufficient: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    ceilingLengthMeters: 2,
    ceilingLoadKilonewtons: 10,
    ceilingWidthMeters: 2,
    hangerCapacityKilonewtons: 1,
    maximumSpacingXMeters: 2,
    maximumSpacingYMeters: 2,
  },
  output: {
    capacityMarginKilonewtons: -6,
    estimatedHangerCount: 4,
    ratedCapacitySufficient: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ceilingLengthMeters: input.ceilingLengthMeters as number,
      ceilingLoadKilonewtons: input.ceilingLoadKilonewtons as number,
      ceilingWidthMeters: input.ceilingWidthMeters as number,
      hangerCapacityKilonewtons: input.hangerCapacityKilonewtons as number,
      maximumSpacingXMeters: input.maximumSpacingXMeters as number,
      maximumSpacingYMeters: input.maximumSpacingYMeters as number,
    }),
  description:
    "Estimate a rectangular hanger grid and compare total rated capacity with a caller-supplied ceiling load; structural design remains outside this screening calculation.",
  id: "acoustics/ceiling-hanger-layout-screen",
  inputs: [
    {
      id: "ceilingLengthMeters",
      kind: "number",
      label: "Ceiling length",
      minimum: 0,
      unit: "m",
    },
    {
      id: "ceilingLoadKilonewtons",
      kind: "number",
      label: "Ceiling load",
      minimum: 0,
      unit: "kN",
    },
    {
      id: "ceilingWidthMeters",
      kind: "number",
      label: "Ceiling width",
      minimum: 0,
      unit: "m",
    },
    {
      id: "hangerCapacityKilonewtons",
      kind: "number",
      label: "Rated capacity per hanger",
      minimum: 0,
      unit: "kN",
    },
    {
      id: "maximumSpacingXMeters",
      kind: "number",
      label: "Maximum X spacing",
      minimum: 0,
      unit: "m",
    },
    {
      id: "maximumSpacingYMeters",
      kind: "number",
      label: "Maximum Y spacing",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "capacityMarginKilonewtons",
      kind: "number",
      label: "Rated capacity margin",
      unit: "kN",
    },
    {
      id: "estimatedHangerCount",
      kind: "integer",
      label: "Estimated hanger count",
      minimum: 1,
    },
    {
      id: "ratedCapacitySufficient",
      kind: "boolean",
      label: "Rated capacity sufficient",
    },
  ],
  title: "Ceiling Hanger Layout Screen",
});

export const run = tool.execute;
export default tool;
