import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonAreaFactorInput = Readonly<{
  readonly allocatedCommonSquareFeet: number;
  readonly usableSquareFeet: number;
}>;
export type CommonAreaFactorOutput = Readonly<{
  readonly commonAreaFactorPercent: number;
}>;

export const calculateCommonAreaFactor = (
  x: CommonAreaFactorInput,
): CommonAreaFactorOutput => {
  if (
    !Number.isFinite(x.allocatedCommonSquareFeet) ||
    x.allocatedCommonSquareFeet < 0
  )
    simpleError(
      "allocatedCommonSquareFeet",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.usableSquareFeet) || x.usableSquareFeet <= 0)
    simpleError("usableSquareFeet", "Provide a finite positive number.");
  const commonAreaFactorPercent =
    (100 * x.allocatedCommonSquareFeet) / x.usableSquareFeet;
  if (!Number.isFinite(commonAreaFactorPercent))
    simpleError(
      "commonAreaFactorPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    commonAreaFactorPercent: Object.is(commonAreaFactorPercent, -0)
      ? 0
      : commonAreaFactorPercent,
  };
};

export const example = {
  input: {
    allocatedCommonSquareFeet: 1000,
    usableSquareFeet: 10000,
  },
  output: { commonAreaFactorPercent: 10 },
} satisfies ToolExample<CommonAreaFactorInput, CommonAreaFactorOutput>;

export const tool = createSimpleTool({
  id: "real-estate/common-area-factor",
  title: "Common Area Factor",
  description:
    "Common area as a percentage of usable tenant area under a stated measurement convention.",
  inputs: [
    {
      id: "allocatedCommonSquareFeet",
      kind: "number",
      label: "Allocated Common Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "usableSquareFeet",
      kind: "number",
      label: "Usable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "commonAreaFactorPercent",
      kind: "number",
      label: "Common Area Factor Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateCommonAreaFactor({
      allocatedCommonSquareFeet: input.allocatedCommonSquareFeet as number,
      usableSquareFeet: input.usableSquareFeet as number,
    }),
});
export const commonAreaFactorTool = tool;
export const runCommonAreaFactor = tool.execute;
export default tool;
