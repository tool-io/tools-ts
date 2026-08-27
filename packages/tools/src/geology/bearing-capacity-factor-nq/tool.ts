import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type BearingCapacityFactorNqInput = {
  readonly frictionAngleDeg: number;
};

export type BearingCapacityFactorNqOutput = {
  readonly nq: number;
};

export const calculateBearingCapacityFactorNq = (
  input: BearingCapacityFactorNqInput,
): BearingCapacityFactorNqOutput => {
  if (!(input.frictionAngleDeg >= 0 && input.frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must lie between 0 and 90 degrees.",
      "invalid_friction_angle",
    );
  const radian = input.frictionAngleDeg * DEG;
  if (radian === 0) return { nq: 1 };
  return {
    nq:
      Math.tan(Math.PI / 4 + radian / 2) ** 2 *
      Math.exp(Math.PI * Math.tan(radian)),
  };
};

export const bearingCapacityFactorNqExample = {
  input: { frictionAngleDeg: 30 },
  output: { nq: 18.401122218708668 },
} satisfies ToolExample<
  BearingCapacityFactorNqInput,
  BearingCapacityFactorNqOutput
>;

export const bearingCapacityFactorNqTool = createSimpleTool({
  id: "geology/bearing-capacity-factor-nq",
  title: "Bearing Capacity Factor Nq Calculator",
  description:
    "Surcharge bearing capacity factor Nq = tan^2(45 + phi/2) * exp(pi * tan(phi)), common to Terzaghi, Meyerhof and Vesic; equals 1 at phi = 0.",
  inputs: [
    {
      description: "Friction angle phi in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Surcharge bearing capacity factor Nq, dimensionless.",
      id: "nq",
      kind: "number",
      label: "Nq",
    },
  ],
  calculate: (input) =>
    calculateBearingCapacityFactorNq(
      input as unknown as BearingCapacityFactorNqInput,
    ),
});

export const runBearingCapacityFactorNq = bearingCapacityFactorNqTool.execute;
export default bearingCapacityFactorNqTool;
