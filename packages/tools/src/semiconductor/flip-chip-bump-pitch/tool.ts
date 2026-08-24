import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlipChipBumpPitchInput = {
  readonly bumpPitchUm: number;
};

export type FlipChipBumpPitchOutput = {
  readonly bumpsPerMm2: number;
};

export const flipChipBumpPitchExample = {
  input: { bumpPitchUm: 150 },
  output: { bumpsPerMm2: 44.44444444444444 },
} satisfies ToolExample<FlipChipBumpPitchInput, FlipChipBumpPitchOutput>;

export const calculateFlipChipBumpPitch = (
  input: FlipChipBumpPitchInput,
): FlipChipBumpPitchOutput => {
  if (!Number.isFinite(input.bumpPitchUm) || input.bumpPitchUm <= 0)
    simpleError(
      "bumpPitchUm",
      "Bump pitch must be finite and positive.",
      "invalid_pitch",
    );
  const direct = 1e6 / (input.bumpPitchUm * input.bumpPitchUm);
  const bumpsPerMm2 =
    Number.isFinite(direct) && direct > 0
      ? direct
      : Math.exp(2 * (Math.log(1000) - Math.log(input.bumpPitchUm)));
  if (!Number.isFinite(bumpsPerMm2) || bumpsPerMm2 <= 0)
    simpleError(
      "bumpPitchUm",
      "The bump density is not representable.",
      "numeric_range",
    );
  return { bumpsPerMm2 };
};

export const flipChipBumpPitchTool = createSimpleTool({
  calculate: (input) =>
    calculateFlipChipBumpPitch({ bumpPitchUm: input.bumpPitchUm as number }),
  description:
    "Compute the bump density of a square flip-chip bump array from its center-to-center pitch.",
  id: "semiconductor/flip-chip-bump-pitch",
  inputs: [
    {
      description: "Center-to-center spacing between adjacent bumps.",
      id: "bumpPitchUm",
      kind: "number",
      label: "Bump pitch",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Number of bumps per square millimeter.",
      id: "bumpsPerMm2",
      kind: "number",
      label: "Bump density",
      minimum: Number.MIN_VALUE,
      unit: "1/mm^2",
    },
  ],
  title: "Bump Density Calculator",
});
export const runFlipChipBumpPitch = flipChipBumpPitchTool.execute;
export default flipChipBumpPitchTool;
