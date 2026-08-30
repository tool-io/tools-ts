import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DragCoefficientFlatPlateInput = Readonly<{
  readonly reynoldsNumber: number;
}>;
export type DragCoefficientFlatPlateOutput = Readonly<{
  readonly averageSkinFrictionCoefficient: number;
}>;

export const calculateDragCoefficientFlatPlate = (
  x: DragCoefficientFlatPlateInput,
): DragCoefficientFlatPlateOutput => {
  if (!Number.isFinite(x.reynoldsNumber) || x.reynoldsNumber < 0)
    simpleError("reynoldsNumber", "Provide a finite number at least 0.");
  if (x.reynoldsNumber > 500000)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const averageSkinFrictionCoefficient = 1.328 / Math.sqrt(x.reynoldsNumber);
  if (!Number.isFinite(averageSkinFrictionCoefficient))
    simpleError(
      "averageSkinFrictionCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageSkinFrictionCoefficient: Object.is(
      averageSkinFrictionCoefficient,
      -0,
    )
      ? 0
      : averageSkinFrictionCoefficient,
  };
};

export const example = {
  input: { reynoldsNumber: 10000 },
  output: { averageSkinFrictionCoefficient: 0.01328 },
} satisfies ToolExample<
  DragCoefficientFlatPlateInput,
  DragCoefficientFlatPlateOutput
>;

export const tool = createSimpleTool({
  id: "engineering/drag-coefficient-flat-plate",
  title: "Drag Coefficient Flat Plate",
  description:
    "Average skin-friction coefficient over a smooth flat plate in laminar zero-pressure-gradient flow: Cf=1.328/√ReL.",
  inputs: [
    {
      id: "reynoldsNumber",
      kind: "number",
      label: "Reynolds Number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "averageSkinFrictionCoefficient",
      kind: "number",
      label: "Average Skin Friction Coefficient",
    },
  ],
  calculate: (input) =>
    calculateDragCoefficientFlatPlate({
      reynoldsNumber: input.reynoldsNumber as number,
    }),
});
export const dragCoefficientFlatPlateTool = tool;
export const runDragCoefficientFlatPlate = tool.execute;
export default tool;
