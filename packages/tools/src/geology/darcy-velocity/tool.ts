import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DarcyVelocityInput = {
  readonly hydraulicConductivityMS: number;
  readonly hydraulicGradient: number;
};

export type DarcyVelocityOutput = {
  readonly darcyVelocityMS: number;
};

export const calculateDarcyVelocity = (
  input: DarcyVelocityInput,
): DarcyVelocityOutput => {
  if (!(input.hydraulicConductivityMS >= 0))
    simpleError(
      "hydraulicConductivityMS",
      "Hydraulic conductivity must be non-negative.",
      "invalid_conductivity",
    );
  if (!(input.hydraulicGradient >= 0))
    simpleError(
      "hydraulicGradient",
      "Hydraulic gradient must be non-negative.",
      "invalid_gradient",
    );
  return {
    darcyVelocityMS: input.hydraulicConductivityMS * input.hydraulicGradient,
  };
};

export const darcyVelocityExample = {
  input: { hydraulicConductivityMS: 0.00024, hydraulicGradient: 0.05 },
  output: { darcyVelocityMS: 1.2e-5 },
} satisfies ToolExample<DarcyVelocityInput, DarcyVelocityOutput>;

export const darcyVelocityTool = createSimpleTool({
  id: "geology/darcy-velocity",
  title: "Darcy Velocity Calculator",
  description:
    "Compute the Darcian specific discharge velocity in meters per second as hydraulic conductivity times hydraulic gradient.",
  inputs: [
    {
      description: "Hydraulic conductivity in meters per second.",
      id: "hydraulicConductivityMS",
      kind: "number",
      label: "K",
      minimum: 0,
    },
    {
      description: "Hydraulic gradient (dimensionless).",
      id: "hydraulicGradient",
      kind: "number",
      label: "i",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Specific discharge (Darcy velocity) in meters per second.",
      id: "darcyVelocityMS",
      kind: "number",
      label: "v",
    },
  ],
  calculate: (input) =>
    calculateDarcyVelocity(input as unknown as DarcyVelocityInput),
});

export const runDarcyVelocity = darcyVelocityTool.execute;
export default darcyVelocityTool;
