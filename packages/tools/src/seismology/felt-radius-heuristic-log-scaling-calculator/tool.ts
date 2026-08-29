import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const feltRadiusHeuristicLogScalingCalculatorExample = {
  input: { magnitudeMw: 5 },
  output: {
    feltRadiusKm: 0.1 * Math.pow(10, 0.5 * 5),
    feltAreaKm2: Math.PI * Math.pow(0.1 * Math.pow(10, 0.5 * 5), 2),
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const feltRadiusHeuristicLogScalingCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw, prefactorKm, baseExponent }) => {
      if (prefactorKm <= 0)
        simpleError("prefactorKm", "Radius prefactor must be positive.");
      const feltRadiusKm =
        prefactorKm * Math.pow(10, baseExponent * magnitudeMw);
      return { feltRadiusKm, feltAreaKm2: Math.PI * feltRadiusKm ** 2 };
    })(input as never) as Record<string, unknown>,
  description:
    "User-parameterized log-linear felt-radius screen R = R₀·10^(kM). The default R₀=0.1 km and k=0.5 are illustrative and must be calibrated for regional attenuation, depth, and reporting conditions.",
  id: "seismology/felt-radius-heuristic-log-scaling-calculator",
  inputs: [
    {
      description: "Event magnitude.",
      id: "magnitudeMw",
      kind: "number",
      label: "M",
    },
    {
      default: 0.1,
      minimum: 0,
      description: "Scaling prefactor at M=0.",
      id: "prefactorKm",
      kind: "number",
      label: "R₀",
    },
    {
      default: 0.5,
      minimum: 0,
      description: "Log10 exponent per magnitude unit.",
      id: "baseExponent",
      kind: "number",
      label: "k",
    },
  ],
  outputs: [
    {
      description: "Estimated felt radius.",
      id: "feltRadiusKm",
      kind: "number",
      label: "R_felt",
      unit: "km",
    },
    {
      description: "Equivalent circular area.",
      id: "feltAreaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
  ],
  title: "Felt Radius Heuristic Log Scaling Calculator",
});
export const runFeltRadiusHeuristicLogScalingCalculator =
  feltRadiusHeuristicLogScalingCalculatorTool.execute;
export { feltRadiusHeuristicLogScalingCalculatorExample as example };
export default feltRadiusHeuristicLogScalingCalculatorTool;
