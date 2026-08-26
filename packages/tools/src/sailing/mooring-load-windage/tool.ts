import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MooringLoadWindageInput = {
  readonly dragCoefficient?: number;
  readonly windSpeedMs: number;
  readonly windageAreaM2: number;
};

export type MooringLoadWindageOutput = {
  readonly windageLoadNewtons: number;
};

const AIR_DENSITY_KG_PER_M3 = 1.225;

export const mooringLoadWindageExample = {
  input: {
    dragCoefficient: 1.2,
    windSpeedMs: 25,
    windageAreaM2: 10,
  },
  output: { windageLoadNewtons: 4593.75 },
} satisfies ToolExample<MooringLoadWindageInput, MooringLoadWindageOutput>;

export const calculateMooringLoadWindage = (
  input: MooringLoadWindageInput,
): MooringLoadWindageOutput => {
  const dragCoefficient = input.dragCoefficient ?? 1;
  if (input.windSpeedMs <= 0)
    simpleError(
      "windSpeedMs",
      "The wind speed must be positive.",
      "invalid_speed",
    );
  if (input.windageAreaM2 <= 0)
    simpleError(
      "windageAreaM2",
      "The windage area must be positive.",
      "invalid_area",
    );
  if (dragCoefficient < 0.1 || dragCoefficient > 2)
    simpleError(
      "dragCoefficient",
      "The drag coefficient must be between 0.1 and 2.",
      "invalid_coefficient",
    );
  return {
    windageLoadNewtons:
      0.5 *
      AIR_DENSITY_KG_PER_M3 *
      input.windSpeedMs ** 2 *
      input.windageAreaM2 *
      dragCoefficient,
  };
};

export const mooringLoadWindageTool = createSimpleTool({
  calculate: (input) =>
    calculateMooringLoadWindage(input as unknown as MooringLoadWindageInput),
  description:
    "Compute the wind load on a moored vessel from wind speed, windage area, and drag coefficient.",
  id: "sailing/mooring-load-windage",
  inputs: [
    {
      description: "Sustained wind speed at the mooring.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      unit: "m/s",
    },
    {
      description:
        "Exposed lateral area of hull and superstructure above the waterline.",
      id: "windageAreaM2",
      kind: "number",
      label: "Windage area",
      unit: "m²",
    },
    {
      default: 1,
      description:
        "Shape drag coefficient; one is typical for a hull and superstructure silhouette.",
      id: "dragCoefficient",
      kind: "number",
      label: "Drag coefficient",
      maximum: 2,
      minimum: 0.1,
    },
  ],
  outputs: [
    {
      description: "Static wind load on the mooring.",
      format: "force",
      id: "windageLoadNewtons",
      kind: "number",
      label: "Windage load",
      unit: "N",
    },
  ],
  title: "Mooring Windage Load Calculator",
});
export const runMooringLoadWindage = mooringLoadWindageTool.execute;
export default mooringLoadWindageTool;
