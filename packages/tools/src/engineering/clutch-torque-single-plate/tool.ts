import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClutchTorqueSinglePlateInput = Readonly<{
  readonly frictionCoefficient: number;
  readonly clampForceNewtons: number;
  readonly effectiveRadiusMeters: number;
  readonly frictionSurfaces: number;
}>;
export type ClutchTorqueSinglePlateOutput = Readonly<{
  readonly torqueNewtonMeters: number;
}>;

export const calculateClutchTorqueSinglePlate = (
  x: ClutchTorqueSinglePlateInput,
): ClutchTorqueSinglePlateOutput => {
  if (!Number.isFinite(x.frictionCoefficient) || x.frictionCoefficient < 0)
    simpleError("frictionCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.clampForceNewtons) || x.clampForceNewtons < 0)
    simpleError("clampForceNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.effectiveRadiusMeters) || x.effectiveRadiusMeters < 0)
    simpleError("effectiveRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.frictionSurfaces) || x.frictionSurfaces < 1)
    simpleError("frictionSurfaces", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.frictionSurfaces))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const torqueNewtonMeters =
    x.frictionCoefficient *
    x.clampForceNewtons *
    x.effectiveRadiusMeters *
    x.frictionSurfaces;
  if (!Number.isFinite(torqueNewtonMeters))
    simpleError(
      "torqueNewtonMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    torqueNewtonMeters: Object.is(torqueNewtonMeters, -0)
      ? 0
      : torqueNewtonMeters,
  };
};

export const example = {
  input: {
    frictionCoefficient: 0.3,
    clampForceNewtons: 1000,
    effectiveRadiusMeters: 0.1,
    frictionSurfaces: 2,
  },
  output: { torqueNewtonMeters: 60 },
} satisfies ToolExample<
  ClutchTorqueSinglePlateInput,
  ClutchTorqueSinglePlateOutput
>;

export const tool = createSimpleTool({
  id: "engineering/clutch-torque-single-plate",
  title: "Clutch Torque Single Plate",
  description:
    "Ideal single-plate clutch torque from friction coefficient, axial normal force, effective radius and active friction surfaces.",
  inputs: [
    {
      id: "frictionCoefficient",
      kind: "number",
      label: "Friction Coefficient",
      minimum: 0,
    },
    {
      id: "clampForceNewtons",
      kind: "number",
      label: "Clamp Force Newtons",
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
    {
      id: "frictionSurfaces",
      kind: "integer",
      label: "Friction Surfaces",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "torqueNewtonMeters",
      kind: "number",
      label: "Torque Newton Meters",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateClutchTorqueSinglePlate({
      frictionCoefficient: input.frictionCoefficient as number,
      clampForceNewtons: input.clampForceNewtons as number,
      effectiveRadiusMeters: input.effectiveRadiusMeters as number,
      frictionSurfaces: input.frictionSurfaces as number,
    }),
});
export const clutchTorqueSinglePlateTool = tool;
export const runClutchTorqueSinglePlate = tool.execute;
export default tool;
