import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PerovskiteToleranceFactorInput = Readonly<{
  readonly aRadiusPicometers: number;
  readonly bRadiusPicometers: number;
  readonly xRadiusPicometers: number;
}>;
export type PerovskiteToleranceFactorOutput = Readonly<{
  readonly toleranceFactor: number;
}>;

export const calculatePerovskiteToleranceFactor = (
  x: PerovskiteToleranceFactorInput,
): PerovskiteToleranceFactorOutput => {
  if (!Number.isFinite(x.aRadiusPicometers) || x.aRadiusPicometers < 0)
    simpleError("aRadiusPicometers", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bRadiusPicometers) || x.bRadiusPicometers < 0)
    simpleError("bRadiusPicometers", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.xRadiusPicometers) || x.xRadiusPicometers < 0)
    simpleError("xRadiusPicometers", "Provide a finite number at least 0.");
  const toleranceFactor =
    (x.aRadiusPicometers + x.xRadiusPicometers) /
    (Math.SQRT2 * (x.bRadiusPicometers + x.xRadiusPicometers));
  if (!Number.isFinite(toleranceFactor))
    simpleError(
      "toleranceFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    toleranceFactor: Object.is(toleranceFactor, -0) ? 0 : toleranceFactor,
  };
};

export const example = {
  input: {
    aRadiusPicometers: 140,
    bRadiusPicometers: 60,
    xRadiusPicometers: 140,
  },
  output: { toleranceFactor: 0.9899494936611665 },
} satisfies ToolExample<
  PerovskiteToleranceFactorInput,
  PerovskiteToleranceFactorOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/perovskite-tolerance-factor",
  title: "Perovskite Tolerance Factor",
  description:
    "Goldschmidt tolerance factor for an ABX₃ perovskite from effective A-, B- and X-site ionic radii measured in one unit.",
  inputs: [
    {
      id: "aRadiusPicometers",
      kind: "number",
      label: "A Radius Picometers",
      unit: "pm",
      minimum: 0,
    },
    {
      id: "bRadiusPicometers",
      kind: "number",
      label: "B Radius Picometers",
      unit: "pm",
      minimum: 0,
    },
    {
      id: "xRadiusPicometers",
      kind: "number",
      label: "X Radius Picometers",
      unit: "pm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "toleranceFactor", kind: "number", label: "Tolerance Factor" },
  ],
  calculate: (input) =>
    calculatePerovskiteToleranceFactor({
      aRadiusPicometers: input.aRadiusPicometers as number,
      bRadiusPicometers: input.bRadiusPicometers as number,
      xRadiusPicometers: input.xRadiusPicometers as number,
    }),
});
export const perovskiteToleranceFactorTool = tool;
export const runPerovskiteToleranceFactor = tool.execute;
export default tool;
