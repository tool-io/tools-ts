import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShroudTensionInput = {
  readonly forestayAngleDeg: number;
  readonly forestayTensionNewtons: number;
  readonly shroudAngleDeg: number;
};

export type ShroudTensionOutput = {
  readonly shroudTensionNewtons: number;
};

export const shroudTensionExample = {
  input: {
    forestayAngleDeg: 60,
    forestayTensionNewtons: 5000,
    shroudAngleDeg: 60,
  },
  output: { shroudTensionNewtons: 5000 },
} satisfies ToolExample<ShroudTensionInput, ShroudTensionOutput>;

export const calculateShroudTension = (
  input: ShroudTensionInput,
): ShroudTensionOutput => {
  if (input.forestayTensionNewtons <= 0)
    simpleError(
      "forestayTensionNewtons",
      "The forestay tension must be positive.",
      "invalid_tension",
    );
  if (input.forestayAngleDeg < 5 || input.forestayAngleDeg > 175)
    simpleError(
      "forestayAngleDeg",
      "The angle must be between 5 and 175 degrees.",
      "invalid_angle",
    );
  if (input.shroudAngleDeg < 5 || input.shroudAngleDeg > 175)
    simpleError(
      "shroudAngleDeg",
      "The angle must be between 5 and 175 degrees.",
      "invalid_angle",
    );
  return {
    shroudTensionNewtons:
      (input.forestayTensionNewtons *
        Math.sin((input.forestayAngleDeg * Math.PI) / 180)) /
      Math.sin((input.shroudAngleDeg * Math.PI) / 180),
  };
};

export const shroudTensionTool = createSimpleTool({
  calculate: (input) =>
    calculateShroudTension(input as unknown as ShroudTensionInput),
  description:
    "Compute the cap-shroud tension needed to balance a given forestay tension from the rigging head angles.",
  id: "sailing/shroud-tension",
  inputs: [
    {
      description: "Tension in the forestay.",
      id: "forestayTensionNewtons",
      kind: "number",
      label: "Forestay tension",
      unit: "N",
    },
    {
      description:
        "Angle between the forestay and the mast at the hounds, in degrees.",
      id: "forestayAngleDeg",
      kind: "number",
      label: "Forestay angle",
      maximum: 175,
      minimum: 5,
      unit: "deg",
    },
    {
      description:
        "Angle between the cap shroud and the mast at the hounds, in degrees.",
      id: "shroudAngleDeg",
      kind: "number",
      label: "Shroud angle",
      maximum: 175,
      minimum: 5,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Required cap shroud tension.",
      format: "force",
      id: "shroudTensionNewtons",
      kind: "number",
      label: "Shroud tension",
      unit: "N",
    },
  ],
  title: "Shroud Tension Calculator",
});
export const runShroudTension = shroudTensionTool.execute;
export default shroudTensionTool;
