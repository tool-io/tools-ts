import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const apparentDipAlongSectionLineCalculatorExample = {
  input: { trueDipDeg: 30, sectionToStrikeAngleDeg: 30 },
  output: {
    apparentDipDeg:
      (Math.atan(
        Math.tan((30 * Math.PI) / 180) *
          Math.abs(Math.sin((30 * Math.PI) / 180)),
      ) *
        180) /
      Math.PI,
    flatteningFactor: Math.abs(Math.sin((30 * Math.PI) / 180)),
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const apparentDipAlongSectionLineCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ trueDipDeg, sectionToStrikeAngleDeg }) => {
      const factor = Math.abs(
        Math.sin((sectionToStrikeAngleDeg * Math.PI) / 180),
      );
      if (factor < 1e-12)
        simpleError(
          "sectionToStrikeAngleDeg",
          "Section parallel to strike has no dip.",
        );
      return {
        apparentDipDeg:
          (Math.atan(Math.tan((trueDipDeg * Math.PI) / 180) * factor) * 180) /
          Math.PI,
        flatteningFactor: factor,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Apparent dip on a section making angle α with the strike: tan(δ_app) = tan(δ)·|sin α|.",
  id: "seismology/apparent-dip-along-section-line-calculator",
  inputs: [
    {
      minimum: 0,
      maximum: 90,
      description: "True dip.",
      id: "trueDipDeg",
      kind: "number",
      label: "δ",
      unit: "°",
    },
    {
      minimum: 0,
      maximum: 180,
      description: "Angle between section line and strike.",
      id: "sectionToStrikeAngleDeg",
      kind: "number",
      label: "α",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Apparent dip seen on the section.",
      id: "apparentDipDeg",
      kind: "number",
      label: "δ_app",
      unit: "°",
    },
    {
      description: "Ratio of apparent to true tan-dip.",
      id: "flatteningFactor",
      kind: "number",
      label: "factor",
    },
  ],
  title: "Apparent Dip Along Section Line Calculator",
});
export const runApparentDipAlongSectionLineCalculator =
  apparentDipAlongSectionLineCalculatorTool.execute;
export { apparentDipAlongSectionLineCalculatorExample as example };
export default apparentDipAlongSectionLineCalculatorTool;
