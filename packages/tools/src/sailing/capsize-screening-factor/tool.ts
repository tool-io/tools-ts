import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapsizeScreeningFactorInput = {
  readonly beamFt: number;
  readonly displacementLb: number;
};

export type CapsizeScreeningFactorOutput = {
  readonly capsizeScreeningFactor: number;
};

/** Seawater weighs 64 lb per cubic foot. */
const LB_PER_CUBIC_FT_SEAWATER = 64;

export const capsizeScreeningFactorExample = {
  input: { beamFt: 11.5, displacementLb: 8000 },
} satisfies ToolExample<
  CapsizeScreeningFactorInput,
  CapsizeScreeningFactorOutput
>;

export const calculateCapsizeScreeningFactor = (
  input: CapsizeScreeningFactorInput,
): CapsizeScreeningFactorOutput => {
  if (input.beamFt <= 0 || input.displacementLb <= 0)
    simpleError(
      "beamFt",
      "Beam and displacement must be positive.",
      "invalid_input",
    );
  const cubeRootDisplacement =
    (input.displacementLb / LB_PER_CUBIC_FT_SEAWATER) ** (1 / 3);
  return {
    capsizeScreeningFactor: input.beamFt / cubeRootDisplacement,
  };
};

export const capsizeScreeningFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateCapsizeScreeningFactor(
      input as unknown as CapsizeScreeningFactorInput,
    ),
  description:
    "Compute the capsize screening factor; below two indicates better resistance to capsize.",
  id: "sailing/capsize-screening-factor",
  inputs: [
    {
      description: "Maximum beam of the hull.",
      format: "length-ft",
      id: "beamFt",
      kind: "number",
      label: "Beam",
      unit: "ft",
    },
    {
      description: "Displacement in pounds.",
      format: "weight-lb",
      id: "displacementLb",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description:
        "Capsize screening factor; under two is considered safer for offshore work.",
      format: "ratio",
      id: "capsizeScreeningFactor",
      kind: "number",
      label: "CSF",
    },
  ],
  title: "Capsize Screening Factor Calculator",
});
export const runCapsizeScreeningFactor = capsizeScreeningFactorTool.execute;
export default capsizeScreeningFactorTool;
