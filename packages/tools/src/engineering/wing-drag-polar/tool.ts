import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WingDragPolarInput = Readonly<{
  readonly zeroLiftDragCoefficient: number;
  readonly inducedDragFactor: number;
  readonly liftCoefficient: number;
}>;
export type WingDragPolarOutput = Readonly<{
  readonly dragCoefficient: number;
}>;

export const calculateWingDragPolar = (
  x: WingDragPolarInput,
): WingDragPolarOutput => {
  if (
    !Number.isFinite(x.zeroLiftDragCoefficient) ||
    x.zeroLiftDragCoefficient < 0
  )
    simpleError(
      "zeroLiftDragCoefficient",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.inducedDragFactor) || x.inducedDragFactor < 0)
    simpleError("inducedDragFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.liftCoefficient))
    simpleError("liftCoefficient", "Provide a finite number.");
  const dragCoefficient =
    x.zeroLiftDragCoefficient + x.inducedDragFactor * x.liftCoefficient ** 2;
  if (!Number.isFinite(dragCoefficient))
    simpleError(
      "dragCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dragCoefficient: Object.is(dragCoefficient, -0) ? 0 : dragCoefficient,
  };
};

export const example = {
  input: {
    zeroLiftDragCoefficient: 0.02,
    inducedDragFactor: 0.05,
    liftCoefficient: 0.5,
  },
  output: { dragCoefficient: 0.0325 },
} satisfies ToolExample<WingDragPolarInput, WingDragPolarOutput>;

export const tool = createSimpleTool({
  id: "engineering/wing-drag-polar",
  title: "Wing Drag Polar",
  description:
    "Parabolic wing drag-polar estimate Cd=Cd0+kCl² using supplied zero-lift drag and induced-drag factor.",
  inputs: [
    {
      id: "zeroLiftDragCoefficient",
      kind: "number",
      label: "Zero Lift Drag Coefficient",
      minimum: 0,
    },
    {
      id: "inducedDragFactor",
      kind: "number",
      label: "Induced Drag Factor",
      minimum: 0,
    },
    { id: "liftCoefficient", kind: "number", label: "Lift Coefficient" },
  ],
  outputs: [
    { id: "dragCoefficient", kind: "number", label: "Drag Coefficient" },
  ],
  calculate: (input) =>
    calculateWingDragPolar({
      zeroLiftDragCoefficient: input.zeroLiftDragCoefficient as number,
      inducedDragFactor: input.inducedDragFactor as number,
      liftCoefficient: input.liftCoefficient as number,
    }),
});
export const wingDragPolarTool = tool;
export const runWingDragPolar = tool.execute;
export default tool;
