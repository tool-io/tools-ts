import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElasticThicknessInput = {
  readonly thicknessM: number;
  readonly youngsModulusPa: number;
  readonly poissonsRatio: number;
};

export type ElasticThicknessOutput = {
  readonly flexuralRigidityNewtonMeter: number;
};

export const calculateElasticThickness = (
  input: ElasticThicknessInput,
): ElasticThicknessOutput => {
  if (!(input.thicknessM > 0))
    return simpleError(
      "thicknessM",
      "Elastic thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(input.youngsModulusPa > 0))
    return simpleError(
      "youngsModulusPa",
      "Young's modulus must be greater than zero.",
      "invalid_modulus",
    );
  if (!(input.poissonsRatio > 0 && input.poissonsRatio < 0.5))
    return simpleError(
      "poissonsRatio",
      "Poisson's ratio must lie between zero and one half.",
      "invalid_ratio",
    );
  return {
    flexuralRigidityNewtonMeter:
      (input.youngsModulusPa * input.thicknessM ** 3) /
      (12 * (1 - input.poissonsRatio ** 2)),
  };
};

export const elasticThicknessExample = {
  input: { thicknessM: 30000, youngsModulusPa: 70e9, poissonsRatio: 0.25 },
  output: { flexuralRigidityNewtonMeter: 1.6800000000000002e23 },
} satisfies ToolExample<ElasticThicknessInput, ElasticThicknessOutput>;

export const elasticThicknessTool = createSimpleTool({
  id: "geology/elastic-thickness",
  title: "Elastic Thickness Calculator",
  description:
    "Convert lithospheric elastic thickness to flexural rigidity D = E Te^3 / (12 (1 - nu^2)) with Te in meters, Young's modulus in pascals and rigidity in newton meters.",
  inputs: [
    {
      description: "Effective elastic thickness of the lithosphere in meters.",
      id: "thicknessM",
      kind: "number",
      label: "Te",
      minimum: 0,
    },
    {
      description: "Young's modulus in pascals.",
      id: "youngsModulusPa",
      kind: "number",
      label: "E",
      minimum: 0,
    },
    {
      description: "Poisson's ratio, dimensionless, between 0 and 0.5.",
      id: "poissonsRatio",
      kind: "number",
      label: "nu",
    },
  ],
  outputs: [
    {
      description: "Flexural rigidity in newton meters.",
      id: "flexuralRigidityNewtonMeter",
      kind: "number",
      label: "D",
    },
  ],
  calculate: (input) =>
    calculateElasticThickness(input as unknown as ElasticThicknessInput),
});

export const runElasticThickness = elasticThicknessTool.execute;
export default elasticThicknessTool;
