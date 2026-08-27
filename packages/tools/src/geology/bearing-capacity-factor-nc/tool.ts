import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type BearingCapacityFactorNcInput = {
  readonly frictionAngleDeg: number;
};

export type BearingCapacityFactorNcOutput = {
  readonly nc: number;
};

export const calculateBearingCapacityFactorNc = (
  input: BearingCapacityFactorNcInput,
): BearingCapacityFactorNcOutput => {
  if (!(input.frictionAngleDeg >= 0 && input.frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must lie between 0 and 90 degrees.",
      "invalid_friction_angle",
    );
  const radian = input.frictionAngleDeg * DEG;
  if (radian === 0) return { nc: Math.PI + 2 };
  const nq =
    Math.tan(Math.PI / 4 + radian / 2) ** 2 *
    Math.exp(Math.PI * Math.tan(radian));
  return { nc: (nq - 1) / Math.tan(radian) };
};

export const bearingCapacityFactorNcExample = {
  input: { frictionAngleDeg: 30 },
  output: { nc: 30.139627791519086 },
} satisfies ToolExample<
  BearingCapacityFactorNcInput,
  BearingCapacityFactorNcOutput
>;

export const bearingCapacityFactorNcTool = createSimpleTool({
  id: "geology/bearing-capacity-factor-nc",
  title: "Bearing Capacity Factor Nc Calculator",
  description:
    "Terzaghi/Meyerhof/Vesic cohesion bearing capacity factor Nc = (Nq - 1)*cot(phi), with Nq = exp(pi*tan(phi))*tan^2(45 + phi/2); the exact limit Nc = pi + 2 applies at phi = 0.",
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
      description: "Cohesion bearing capacity factor Nc, dimensionless.",
      id: "nc",
      kind: "number",
      label: "Nc",
    },
  ],
  calculate: (input) =>
    calculateBearingCapacityFactorNc(
      input as unknown as BearingCapacityFactorNcInput,
    ),
});

export const runBearingCapacityFactorNc = bearingCapacityFactorNcTool.execute;
export default bearingCapacityFactorNcTool;
