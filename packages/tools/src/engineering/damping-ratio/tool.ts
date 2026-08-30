import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DampingRatioInput = Readonly<{
  readonly dampingNewtonsSecondPerMeter: number;
  readonly stiffnessNewtonsPerMeter: number;
  readonly massKilograms: number;
}>;
export type DampingRatioOutput = Readonly<{
  readonly dampingRatio: number;
}>;

export const calculateDampingRatio = (
  x: DampingRatioInput,
): DampingRatioOutput => {
  if (
    !Number.isFinite(x.dampingNewtonsSecondPerMeter) ||
    x.dampingNewtonsSecondPerMeter < 0
  )
    simpleError(
      "dampingNewtonsSecondPerMeter",
      "Provide a finite number at least 0.",
    );
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
  const dampingRatio =
    x.dampingNewtonsSecondPerMeter /
    (2 * Math.sqrt(x.stiffnessNewtonsPerMeter * x.massKilograms));
  if (!Number.isFinite(dampingRatio))
    simpleError(
      "dampingRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dampingRatio: Object.is(dampingRatio, -0) ? 0 : dampingRatio };
};

export const example = {
  input: {
    dampingNewtonsSecondPerMeter: 20,
    stiffnessNewtonsPerMeter: 1000,
    massKilograms: 10,
  },
  output: { dampingRatio: 0.1 },
} satisfies ToolExample<DampingRatioInput, DampingRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/damping-ratio",
  title: "Damping Ratio",
  description:
    "Viscous damping ratio c/(2√km) for an ideal mass–spring–damper system.",
  inputs: [
    {
      id: "dampingNewtonsSecondPerMeter",
      kind: "number",
      label: "Damping Newtons Second Per Meter",
      unit: "N·s/m",
      minimum: 0,
    },
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
  outputs: [{ id: "dampingRatio", kind: "number", label: "Damping Ratio" }],
  calculate: (input) =>
    calculateDampingRatio({
      dampingNewtonsSecondPerMeter:
        input.dampingNewtonsSecondPerMeter as number,
      stiffnessNewtonsPerMeter: input.stiffnessNewtonsPerMeter as number,
      massKilograms: input.massKilograms as number,
    }),
});
export const dampingRatioTool = tool;
export const runDampingRatio = tool.execute;
export default tool;
