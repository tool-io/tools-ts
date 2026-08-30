import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrakeTorqueDrumInput = Readonly<{
  readonly frictionForceNewtons: number;
  readonly effectiveRadiusMeters: number;
}>;
export type BrakeTorqueDrumOutput = Readonly<{
  readonly brakeTorqueNewtonMeters: number;
}>;

export const calculateBrakeTorqueDrum = (
  x: BrakeTorqueDrumInput,
): BrakeTorqueDrumOutput => {
  if (!Number.isFinite(x.frictionForceNewtons) || x.frictionForceNewtons < 0)
    simpleError("frictionForceNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.effectiveRadiusMeters) || x.effectiveRadiusMeters < 0)
    simpleError("effectiveRadiusMeters", "Provide a finite number at least 0.");
  const brakeTorqueNewtonMeters =
    x.frictionForceNewtons * x.effectiveRadiusMeters;
  if (!Number.isFinite(brakeTorqueNewtonMeters))
    simpleError(
      "brakeTorqueNewtonMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    brakeTorqueNewtonMeters: Object.is(brakeTorqueNewtonMeters, -0)
      ? 0
      : brakeTorqueNewtonMeters,
  };
};

export const example = {
  input: { frictionForceNewtons: 1000, effectiveRadiusMeters: 0.1 },
  output: { brakeTorqueNewtonMeters: 100 },
} satisfies ToolExample<BrakeTorqueDrumInput, BrakeTorqueDrumOutput>;

export const tool = createSimpleTool({
  id: "engineering/brake-torque-drum",
  title: "Brake Torque Drum",
  description:
    "Ideal drum braking torque from total tangential friction force at the effective friction radius.",
  inputs: [
    {
      id: "frictionForceNewtons",
      kind: "number",
      label: "Friction Force Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "effectiveRadiusMeters",
      kind: "number",
      label: "Effective Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "brakeTorqueNewtonMeters",
      kind: "number",
      label: "Brake Torque Newton Meters",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateBrakeTorqueDrum({
      frictionForceNewtons: input.frictionForceNewtons as number,
      effectiveRadiusMeters: input.effectiveRadiusMeters as number,
    }),
});
export const brakeTorqueDrumTool = tool;
export const runBrakeTorqueDrum = tool.execute;
export default tool;
