import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CriticalDampingCoefficientInput = Readonly<{
  readonly stiffnessNewtonsPerMeter: number;
  readonly massKilograms: number;
}>;
export type CriticalDampingCoefficientOutput = Readonly<{
  readonly criticalDampingNewtonSecondsPerMeter: number;
}>;

export const calculateCriticalDampingCoefficient = (
  x: CriticalDampingCoefficientInput,
): CriticalDampingCoefficientOutput => {
  if (
    !Number.isFinite(x.stiffnessNewtonsPerMeter) ||
    x.stiffnessNewtonsPerMeter < 0
  )
    simpleError(
      "stiffnessNewtonsPerMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  const criticalDampingNewtonSecondsPerMeter =
    2 * Math.sqrt(x.stiffnessNewtonsPerMeter * x.massKilograms);
  if (!Number.isFinite(criticalDampingNewtonSecondsPerMeter))
    simpleError(
      "criticalDampingNewtonSecondsPerMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    criticalDampingNewtonSecondsPerMeter: Object.is(
      criticalDampingNewtonSecondsPerMeter,
      -0,
    )
      ? 0
      : criticalDampingNewtonSecondsPerMeter,
  };
};

export const example = {
  input: { stiffnessNewtonsPerMeter: 1000, massKilograms: 10 },
  output: { criticalDampingNewtonSecondsPerMeter: 200 },
} satisfies ToolExample<
  CriticalDampingCoefficientInput,
  CriticalDampingCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "engineering/critical-damping-coefficient",
  title: "Critical Damping Coefficient",
  description:
    "Critical viscous damping coefficient ccrit=2√(km) for a single-degree-of-freedom spring–mass system.",
  inputs: [
    {
      id: "stiffnessNewtonsPerMeter",
      kind: "number",
      label: "Stiffness Newtons Per Meter",
      unit: "N/m",
      minimum: 0,
    },
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "criticalDampingNewtonSecondsPerMeter",
      kind: "number",
      label: "Critical Damping Newton Seconds Per Meter",
      unit: "N·s/m",
    },
  ],
  calculate: (input) =>
    calculateCriticalDampingCoefficient({
      stiffnessNewtonsPerMeter: input.stiffnessNewtonsPerMeter as number,
      massKilograms: input.massKilograms as number,
    }),
});
export const criticalDampingCoefficientTool = tool;
export const runCriticalDampingCoefficient = tool.execute;
export default tool;
