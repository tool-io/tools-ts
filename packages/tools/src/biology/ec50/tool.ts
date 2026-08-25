import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ec50Example = {
  input: { concentrationAtResponse: 10, hillSlope: 1, responseFraction: 0.8 },
} satisfies ToolExample<{
  readonly concentrationAtResponse: number;
  readonly hillSlope?: number;
  readonly responseFraction: number;
}>;

export const ec50Tool = createSimpleTool({
  id: "biology/ec50",
  title: "EC50 From Hill",
  description:
    "Estimate the half-maximal effective concentration by inverting the Hill equation.",
  inputs: [
    { id: "concentrationAtResponse", label: "Concentration", kind: "number" },
    { id: "responseFraction", label: "Effect fraction", kind: "number" },
    {
      default: 1,
      id: "hillSlope",
      label: "Hill slope",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "ec50Concentration",
      label: "EC50 concentration",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const concentrationAtResponse = input.concentrationAtResponse as number;
    const responseFraction = input.responseFraction as number;
    const hillSlope = input.hillSlope as number;
    if (concentrationAtResponse <= 0)
      simpleError(
        "concentrationAtResponse",
        "Concentration must be greater than zero.",
        "invalid_concentration",
      );
    if (responseFraction <= 0 || responseFraction >= 1)
      simpleError(
        "responseFraction",
        "Effect fraction must be strictly between zero and one.",
        "invalid_response",
      );
    if (hillSlope <= 0)
      simpleError(
        "hillSlope",
        "Hill slope must be greater than zero.",
        "invalid_slope",
      );
    return {
      ec50Concentration:
        concentrationAtResponse *
        Math.pow(1 / responseFraction - 1, 1 / hillSlope),
    };
  },
});
export const runEc50 = ec50Tool.execute;
export default ec50Tool;
