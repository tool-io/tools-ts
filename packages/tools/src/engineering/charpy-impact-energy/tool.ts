import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CharpyImpactEnergyInput = Readonly<{
  readonly massKilograms: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly beforeHeightMeters: number;
  readonly afterHeightMeters: number;
}>;
export type CharpyImpactEnergyOutput = Readonly<{
  readonly absorbedJoules: number;
}>;

export const calculateCharpyImpactEnergy = (
  x: CharpyImpactEnergyInput,
): CharpyImpactEnergyOutput => {
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.beforeHeightMeters) || x.beforeHeightMeters < 0)
    simpleError("beforeHeightMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.afterHeightMeters) || x.afterHeightMeters < 0)
    simpleError("afterHeightMeters", "Provide a finite number at least 0.");
  if (x.afterHeightMeters > x.beforeHeightMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const absorbedJoules =
    x.massKilograms *
    x.gravityMetersPerSecondSquared *
    (x.beforeHeightMeters - x.afterHeightMeters);
  if (!Number.isFinite(absorbedJoules))
    simpleError(
      "absorbedJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { absorbedJoules: Object.is(absorbedJoules, -0) ? 0 : absorbedJoules };
};

export const example = {
  input: {
    massKilograms: 2,
    gravityMetersPerSecondSquared: 9.81,
    beforeHeightMeters: 1,
    afterHeightMeters: 0.5,
  },
  output: { absorbedJoules: 9.81 },
} satisfies ToolExample<CharpyImpactEnergyInput, CharpyImpactEnergyOutput>;

export const tool = createSimpleTool({
  id: "engineering/charpy-impact-energy",
  title: "Charpy Impact Energy",
  description:
    "Absorbed impact energy from pendulum potential-energy loss m g (hbefore−hafter); not a material toughness conversion.",
  inputs: [
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
    {
      id: "beforeHeightMeters",
      kind: "number",
      label: "Before Height Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "afterHeightMeters",
      kind: "number",
      label: "After Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "absorbedJoules",
      kind: "number",
      label: "Absorbed Joules",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculateCharpyImpactEnergy({
      massKilograms: input.massKilograms as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      beforeHeightMeters: input.beforeHeightMeters as number,
      afterHeightMeters: input.afterHeightMeters as number,
    }),
});
export const charpyImpactEnergyTool = tool;
export const runCharpyImpactEnergy = tool.execute;
export default tool;
