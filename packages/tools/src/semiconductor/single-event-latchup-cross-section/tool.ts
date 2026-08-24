import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SingleEventLatchupCrossSectionInput = {
  readonly letPerCm2Mg: number;
  readonly saturationCrossSectionUm2: number;
  readonly shapeExponent?: number;
  readonly thresholdLETPerCm2Mg: number;
  readonly widthParameterPerCm2Mg: number;
};

export type SingleEventLatchupCrossSectionOutput = {
  readonly crossSectionUm2: number;
};

export const singleEventLatchupCrossSectionExample = {
  input: {
    letPerCm2Mg: 20,
    saturationCrossSectionUm2: 1,
    thresholdLETPerCm2Mg: 10,
    widthParameterPerCm2Mg: 5,
  },
  output: { crossSectionUm2: 0.8646647167633873 },
} satisfies ToolExample<
  SingleEventLatchupCrossSectionInput,
  SingleEventLatchupCrossSectionOutput
>;

export const singleEventLatchupCrossSectionTool = createSimpleTool({
  id: "semiconductor/single-event-latchup-cross-section",
  title: "SEL Cross Section Calculator",
  description:
    "Compute the single-event latchup cross section from LET using a Weibull-style saturation curve.",
  inputs: [
    {
      description: "Linear energy transfer of the incident ion.",
      id: "letPerCm2Mg",
      kind: "number",
      label: "LET",
      minimum: 0,
      unit: "MeV·cm²/mg",
    },
    {
      description: "Saturation cross section reached at high LET.",
      id: "saturationCrossSectionUm2",
      kind: "number",
      label: "Saturation cross section",
      unit: "um^2",
    },
    {
      description: "Threshold LET where latchup becomes possible.",
      id: "thresholdLETPerCm2Mg",
      kind: "number",
      label: "Threshold LET",
      minimum: 0,
      unit: "MeV·cm²/mg",
    },
    {
      default: 1,
      description: "Dimensionless Weibull shape exponent.",
      id: "shapeExponent",
      kind: "number",
      label: "Shape exponent",
    },
    {
      description: "Width parameter controlling the rise of the curve.",
      id: "widthParameterPerCm2Mg",
      kind: "number",
      label: "Width parameter",
      unit: "MeV·cm²/mg",
    },
  ],
  outputs: [
    {
      description: "Latchup cross section at the given LET.",
      format: "cross-section-um2",
      id: "crossSectionUm2",
      kind: "number",
      label: "Cross section",
      unit: "um^2",
    },
  ],
  calculate: (input) => {
    const saturationCrossSectionUm2 = input.saturationCrossSectionUm2 as number;
    const widthParameterPerCm2Mg = input.widthParameterPerCm2Mg as number;
    const shapeExponent = input.shapeExponent as number;
    if (!(saturationCrossSectionUm2 > 0))
      simpleError(
        "saturationCrossSectionUm2",
        "Saturation cross section must be greater than zero.",
      );
    if (!(widthParameterPerCm2Mg > 0))
      simpleError(
        "widthParameterPerCm2Mg",
        "Width parameter must be greater than zero.",
      );
    if (!(shapeExponent > 0))
      simpleError("shapeExponent", "Shape exponent must be greater than zero.");
    const letPerCm2Mg = input.letPerCm2Mg as number;
    const thresholdLETPerCm2Mg = input.thresholdLETPerCm2Mg as number;
    if (letPerCm2Mg <= thresholdLETPerCm2Mg) return { crossSectionUm2: 0 };
    const normalizedLet =
      (letPerCm2Mg - thresholdLETPerCm2Mg) / widthParameterPerCm2Mg;
    const weibullPower = normalizedLet ** shapeExponent;
    return {
      crossSectionUm2: saturationCrossSectionUm2 * -Math.expm1(-weibullPower),
    };
  },
});
export const runSingleEventLatchupCrossSection =
  singleEventLatchupCrossSectionTool.execute;
export default singleEventLatchupCrossSectionTool;
