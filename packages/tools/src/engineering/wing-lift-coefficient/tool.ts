import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WingLiftCoefficientInput = Readonly<{
  readonly liftNewtons: number;
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
  readonly wingAreaSquareMeters: number;
}>;
export type WingLiftCoefficientOutput = Readonly<{
  readonly liftCoefficient: number;
}>;

export const calculateWingLiftCoefficient = (
  x: WingLiftCoefficientInput,
): WingLiftCoefficientOutput => {
  if (!Number.isFinite(x.liftNewtons))
    simpleError("liftNewtons", "Provide a finite number.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wingAreaSquareMeters) || x.wingAreaSquareMeters < 0)
    simpleError("wingAreaSquareMeters", "Provide a finite number at least 0.");
  const liftCoefficient =
    x.liftNewtons /
    (0.5 *
      x.densityKgPerM3 *
      x.speedMetersPerSecond ** 2 *
      x.wingAreaSquareMeters);
  if (!Number.isFinite(liftCoefficient))
    simpleError(
      "liftCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    liftCoefficient: Object.is(liftCoefficient, -0) ? 0 : liftCoefficient,
  };
};

export const example = {
  input: {
    liftNewtons: 1000,
    densityKgPerM3: 1.225,
    speedMetersPerSecond: 30,
    wingAreaSquareMeters: 10,
  },
  output: { liftCoefficient: 0.18140589569160998 },
} satisfies ToolExample<WingLiftCoefficientInput, WingLiftCoefficientOutput>;

export const tool = createSimpleTool({
  id: "engineering/wing-lift-coefficient",
  title: "Wing Lift Coefficient",
  description:
    "Aerodynamic lift coefficient from measured lift divided by dynamic pressure times wing reference area.",
  inputs: [
    { id: "liftNewtons", kind: "number", label: "Lift Newtons", unit: "N" },
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
      id: "wingAreaSquareMeters",
      kind: "number",
      label: "Wing Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "liftCoefficient", kind: "number", label: "Lift Coefficient" },
  ],
  calculate: (input) =>
    calculateWingLiftCoefficient({
      liftNewtons: input.liftNewtons as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      wingAreaSquareMeters: input.wingAreaSquareMeters as number,
    }),
});
export const wingLiftCoefficientTool = tool;
export const runWingLiftCoefficient = tool.execute;
export default tool;
