import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DragForceInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
  readonly dragCoefficient: number;
  readonly referenceAreaSquareMeters: number;
}>;
export type DragForceOutput = Readonly<{
  readonly dragNewtons: number;
}>;

export const calculateDragForce = (x: DragForceInput): DragForceOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dragCoefficient) || x.dragCoefficient < 0)
    simpleError("dragCoefficient", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.referenceAreaSquareMeters) ||
    x.referenceAreaSquareMeters < 0
  )
    simpleError(
      "referenceAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  const dragNewtons =
    0.5 *
    x.densityKgPerM3 *
    x.speedMetersPerSecond ** 2 *
    x.dragCoefficient *
    x.referenceAreaSquareMeters;
  if (!Number.isFinite(dragNewtons))
    simpleError(
      "dragNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dragNewtons: Object.is(dragNewtons, -0) ? 0 : dragNewtons };
};

export const example = {
  input: {
    densityKgPerM3: 1.225,
    speedMetersPerSecond: 20,
    dragCoefficient: 0.3,
    referenceAreaSquareMeters: 2,
  },
  output: { dragNewtons: 147 },
} satisfies ToolExample<DragForceInput, DragForceOutput>;

export const tool = createSimpleTool({
  id: "engineering/drag-force",
  title: "Drag Force",
  description:
    "Steady aerodynamic or hydrodynamic drag ½ρv²CdA using supplied reference area and drag coefficient.",
  inputs: [
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "dragCoefficient",
      kind: "number",
      label: "Drag Coefficient",
      minimum: 0,
    },
    {
      id: "referenceAreaSquareMeters",
      kind: "number",
      label: "Reference Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dragNewtons", kind: "number", label: "Drag Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateDragForce({
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      dragCoefficient: input.dragCoefficient as number,
      referenceAreaSquareMeters: input.referenceAreaSquareMeters as number,
    }),
});
export const dragForceTool = tool;
export const runDragForce = tool.execute;
export default tool;
