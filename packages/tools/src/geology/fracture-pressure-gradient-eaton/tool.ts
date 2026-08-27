import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FracturePressureGradientEatonInput = {
  readonly overburdenStressGradientPaPerMetre: number;
  readonly poissonRatio: number;
  readonly porePressureGradientPaPerMetre: number;
};

export type FracturePressureGradientEatonOutput = {
  readonly fracturePressureGradientPaPerMetre: number;
};

export const calculateFracturePressureGradientEaton = (
  input: FracturePressureGradientEatonInput,
): FracturePressureGradientEatonOutput => {
  if (!(input.poissonRatio > 0 && input.poissonRatio < 1))
    return simpleError(
      "poissonRatio",
      "Poisson ratio must lie strictly between zero and one.",
      "invalid_poisson_ratio",
    );
  if (!(input.overburdenStressGradientPaPerMetre > 0))
    return simpleError(
      "overburdenStressGradientPaPerMetre",
      "Overburden stress gradient must be positive.",
      "invalid_gradient",
    );
  if (!(input.porePressureGradientPaPerMetre > 0))
    return simpleError(
      "porePressureGradientPaPerMetre",
      "Pore pressure gradient must be positive.",
      "invalid_gradient",
    );
  if (
    input.porePressureGradientPaPerMetre >
    input.overburdenStressGradientPaPerMetre
  )
    return simpleError(
      "porePressureGradientPaPerMetre",
      "Pore pressure gradient cannot exceed the overburden stress gradient.",
      "invalid_gradient",
    );
  const {
    overburdenStressGradientPaPerMetre,
    poissonRatio,
    porePressureGradientPaPerMetre,
  } = input;
  return {
    fracturePressureGradientPaPerMetre:
      porePressureGradientPaPerMetre +
      (poissonRatio / (1 - poissonRatio)) *
        (overburdenStressGradientPaPerMetre - porePressureGradientPaPerMetre),
  };
};

export const fracturePressureGradientEatonExample = {
  input: {
    overburdenStressGradientPaPerMetre: 22620,
    poissonRatio: 0.4,
    porePressureGradientPaPerMetre: 9810,
  },
  output: { fracturePressureGradientPaPerMetre: 18350 },
} satisfies ToolExample<
  FracturePressureGradientEatonInput,
  FracturePressureGradientEatonOutput
>;

export const fracturePressureGradientEatonTool = createSimpleTool({
  id: "geology/fracture-pressure-gradient-eaton",
  title: "Fracture Pressure Gradient Eaton Calculator",
  description:
    "Estimate the fracture pressure gradient with the Eaton (1969) relation FG = Pp + nu/(1-nu) * (Sv - Pp).",
  inputs: [
    {
      description: "Vertical overburden stress gradient in pascals per metre.",
      id: "overburdenStressGradientPaPerMetre",
      kind: "number",
      label: "Overburden gradient",
    },
    {
      description: "Formation Poisson ratio, dimensionless.",
      id: "poissonRatio",
      kind: "number",
      label: "Poisson ratio",
    },
    {
      description: "Pore pressure gradient in pascals per metre.",
      id: "porePressureGradientPaPerMetre",
      kind: "number",
      label: "Pore gradient",
    },
  ],
  outputs: [
    {
      description: "Fracture pressure gradient in pascals per metre.",
      id: "fracturePressureGradientPaPerMetre",
      kind: "number",
      label: "Fracture gradient",
    },
  ],
  calculate: (input) =>
    calculateFracturePressureGradientEaton(
      input as unknown as FracturePressureGradientEatonInput,
    ),
});

export const runFracturePressureGradientEaton =
  fracturePressureGradientEatonTool.execute;
export default fracturePressureGradientEatonTool;
