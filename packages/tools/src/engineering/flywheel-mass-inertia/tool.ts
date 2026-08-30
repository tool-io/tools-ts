import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlywheelMassInertiaInput = Readonly<{
  readonly massKilograms: number;
  readonly radiusMeters: number;
}>;
export type FlywheelMassInertiaOutput = Readonly<{
  readonly inertiaKgSquareMeters: number;
}>;

export const calculateFlywheelMassInertia = (
  x: FlywheelMassInertiaInput,
): FlywheelMassInertiaOutput => {
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters < 0)
    simpleError("radiusMeters", "Provide a finite number at least 0.");
  const inertiaKgSquareMeters = 0.5 * x.massKilograms * x.radiusMeters ** 2;
  if (!Number.isFinite(inertiaKgSquareMeters))
    simpleError(
      "inertiaKgSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    inertiaKgSquareMeters: Object.is(inertiaKgSquareMeters, -0)
      ? 0
      : inertiaKgSquareMeters,
  };
};

export const example = {
  input: { massKilograms: 10, radiusMeters: 0.2 },
  output: { inertiaKgSquareMeters: 0.20000000000000004 },
} satisfies ToolExample<FlywheelMassInertiaInput, FlywheelMassInertiaOutput>;

export const tool = createSimpleTool({
  id: "engineering/flywheel-mass-inertia",
  title: "Flywheel Mass Inertia",
  description:
    "Mass moment of inertia of a uniform solid disk flywheel about its center axis: I=½mr².",
  inputs: [
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "inertiaKgSquareMeters",
      kind: "number",
      label: "Inertia Kg Square Meters",
      unit: "kg·m²",
    },
  ],
  calculate: (input) =>
    calculateFlywheelMassInertia({
      massKilograms: input.massKilograms as number,
      radiusMeters: input.radiusMeters as number,
    }),
});
export const flywheelMassInertiaTool = tool;
export const runFlywheelMassInertia = tool.execute;
export default tool;
