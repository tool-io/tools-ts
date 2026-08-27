import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlexuralRigidityInput = {
  readonly elasticThicknessM: number;
  readonly youngsModulusPa?: number;
  readonly poissonsRatio?: number;
};

export type FlexuralRigidityOutput = {
  readonly flexuralRigidityNm: number;
};

export const calculateFlexuralRigidity = (
  input: FlexuralRigidityInput,
): FlexuralRigidityOutput => {
  const elasticThickness = input.elasticThicknessM;
  const youngsModulus = input.youngsModulusPa ?? 7e10;
  const poissonsRatio = input.poissonsRatio ?? 0.25;
  if (!(elasticThickness > 0))
    simpleError(
      "elasticThicknessM",
      "Elastic plate thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(youngsModulus > 0))
    simpleError(
      "youngsModulusPa",
      "Young's modulus must be positive.",
      "invalid_modulus",
    );
  if (!(poissonsRatio >= 0 && poissonsRatio < 1))
    simpleError(
      "poissonsRatio",
      "Poisson's ratio must be at least 0 and below 1.",
      "invalid_ratio",
    );
  return {
    flexuralRigidityNm:
      (youngsModulus * elasticThickness ** 3) / (12 * (1 - poissonsRatio ** 2)),
  };
};

export const flexuralRigidityExample = {
  input: {
    elasticThicknessM: 25000,
    youngsModulusPa: 7e10,
    poissonsRatio: 0.25,
  },
  output: { flexuralRigidityNm: 9.722222222222222e22 },
} satisfies ToolExample<FlexuralRigidityInput, FlexuralRigidityOutput>;

export const flexuralRigidityTool = createSimpleTool({
  id: "geology/flexural-rigidity",
  title: "Flexural Rigidity Calculator",
  description:
    "Flexural rigidity of an elastic lithospheric plate: D = E * Te^3 / (12 * (1 - nu^2)).",
  inputs: [
    {
      description: "Effective elastic thickness of the lithosphere in metres.",
      id: "elasticThicknessM",
      kind: "number",
      label: "Elastic thickness",
      unit: "m",
    },
    {
      description:
        "Young's modulus in pascals; default 7e10 (typical lithospheric value).",
      default: 7e10,
      id: "youngsModulusPa",
      kind: "number",
      label: "Young's modulus",
      unit: "Pa",
    },
    {
      description:
        "Poisson's ratio; default 0.25 (typical lithospheric value).",
      default: 0.25,
      id: "poissonsRatio",
      kind: "number",
      label: "Poisson's ratio",
    },
  ],
  outputs: [
    {
      description: "Flexural rigidity in newton-metres.",
      id: "flexuralRigidityNm",
      kind: "number",
      label: "Flexural rigidity",
      unit: "N*m",
    },
  ],
  calculate: (input) =>
    calculateFlexuralRigidity(input as unknown as FlexuralRigidityInput),
});

export const runFlexuralRigidity = flexuralRigidityTool.execute;
export default flexuralRigidityTool;
