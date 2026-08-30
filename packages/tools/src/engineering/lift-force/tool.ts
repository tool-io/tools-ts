import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LiftForceInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
  readonly liftCoefficient: number;
  readonly referenceAreaSquareMeters: number;
}>;
export type LiftForceOutput = Readonly<{
  readonly liftNewtons: number;
}>;

export const calculateLiftForce = (x: LiftForceInput): LiftForceOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.liftCoefficient))
    simpleError("liftCoefficient", "Provide a finite number.");
  if (
    !Number.isFinite(x.referenceAreaSquareMeters) ||
    x.referenceAreaSquareMeters < 0
  )
    simpleError(
      "referenceAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  const liftNewtons =
    0.5 *
    x.densityKgPerM3 *
    x.speedMetersPerSecond ** 2 *
    x.liftCoefficient *
    x.referenceAreaSquareMeters;
  if (!Number.isFinite(liftNewtons))
    simpleError(
      "liftNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { liftNewtons: Object.is(liftNewtons, -0) ? 0 : liftNewtons };
};

export const example = {
  input: {
    densityKgPerM3: 1.225,
    speedMetersPerSecond: 20,
    liftCoefficient: 0.5,
    referenceAreaSquareMeters: 2,
  },
  output: { liftNewtons: 245.00000000000003 },
} satisfies ToolExample<LiftForceInput, LiftForceOutput>;

export const tool = createSimpleTool({
  id: "engineering/lift-force",
  title: "Lift Force",
  description:
    "Steady lift ½ρv²ClA using supplied signed lift coefficient and reference area.",
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
    { id: "liftCoefficient", kind: "number", label: "Lift Coefficient" },
    {
      id: "referenceAreaSquareMeters",
      kind: "number",
      label: "Reference Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "liftNewtons", kind: "number", label: "Lift Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateLiftForce({
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      liftCoefficient: input.liftCoefficient as number,
      referenceAreaSquareMeters: input.referenceAreaSquareMeters as number,
    }),
});
export const liftForceTool = tool;
export const runLiftForce = tool.execute;
export default tool;
