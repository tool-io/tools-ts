import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterDisplacementVolumeTestInput = Readonly<{
  readonly finalWaterMilliliters: number;
  readonly initialWaterMilliliters: number;
}>;
export type WaterDisplacementVolumeTestOutput = Readonly<{
  readonly displacedVolumeMilliliters: number;
}>;

export const calculateWaterDisplacementVolumeTest = (
  x: WaterDisplacementVolumeTestInput,
): WaterDisplacementVolumeTestOutput => {
  if (!Number.isFinite(x.finalWaterMilliliters) || x.finalWaterMilliliters < 0)
    simpleError(
      "finalWaterMilliliters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.initialWaterMilliliters) ||
    x.initialWaterMilliliters < 0
  )
    simpleError(
      "initialWaterMilliliters",
      "Provide a finite nonnegative number.",
    );
  if (x.finalWaterMilliliters < x.initialWaterMilliliters)
    simpleError(
      "finalWaterMilliliters",
      "Final water level must not be below the initial level.",
    );
  const displacedVolumeMilliliters =
    x.finalWaterMilliliters - x.initialWaterMilliliters;
  if (!Number.isFinite(displacedVolumeMilliliters))
    simpleError(
      "displacedVolumeMilliliters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displacedVolumeMilliliters: Object.is(displacedVolumeMilliliters, -0)
      ? 0
      : displacedVolumeMilliliters,
  };
};

export const example = {
  input: {
    finalWaterMilliliters: 54,
    initialWaterMilliliters: 50,
  },
  output: { displacedVolumeMilliliters: 4 },
} satisfies ToolExample<
  WaterDisplacementVolumeTestInput,
  WaterDisplacementVolumeTestOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/water-displacement-volume-test",
  title: "Water Displacement Volume Test",
  description:
    "Find coin volume by water displacement; avoid porous or moisture-sensitive pieces.",
  inputs: [
    {
      id: "finalWaterMilliliters",
      kind: "number",
      label: "Final Water Milliliters",
      unit: "mL",
    },
    {
      id: "initialWaterMilliliters",
      kind: "number",
      label: "Initial Water Milliliters",
      unit: "mL",
    },
  ],
  outputs: [
    {
      id: "displacedVolumeMilliliters",
      kind: "number",
      label: "Displaced Volume Milliliters",
      unit: "mL",
    },
  ],
  calculate: (input) =>
    calculateWaterDisplacementVolumeTest({
      finalWaterMilliliters: input.finalWaterMilliliters as number,
      initialWaterMilliliters: input.initialWaterMilliliters as number,
    }),
});
export const runWaterDisplacementVolumeTest = tool.execute;
export default tool;
