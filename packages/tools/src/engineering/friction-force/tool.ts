import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrictionForceInput = Readonly<{
  readonly normalNewtons: number;
  readonly kineticCoefficient: number;
}>;
export type FrictionForceOutput = Readonly<{
  readonly frictionNewtons: number;
}>;

export const calculateFrictionForce = (
  x: FrictionForceInput,
): FrictionForceOutput => {
  if (!Number.isFinite(x.normalNewtons) || x.normalNewtons < 0)
    simpleError("normalNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.kineticCoefficient) || x.kineticCoefficient < 0)
    simpleError("kineticCoefficient", "Provide a finite number at least 0.");
  const frictionNewtons = x.normalNewtons * x.kineticCoefficient;
  if (!Number.isFinite(frictionNewtons))
    simpleError(
      "frictionNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    frictionNewtons: Object.is(frictionNewtons, -0) ? 0 : frictionNewtons,
  };
};

export const example = {
  input: { normalNewtons: 100, kineticCoefficient: 0.3 },
  output: { frictionNewtons: 30 },
} satisfies ToolExample<FrictionForceInput, FrictionForceOutput>;

export const tool = createSimpleTool({
  id: "engineering/friction-force",
  title: "Friction Force",
  description:
    "Coulomb sliding-friction force magnitude from normal force and kinetic friction coefficient; not static breakaway force.",
  inputs: [
    {
      id: "normalNewtons",
      kind: "number",
      label: "Normal Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "kineticCoefficient",
      kind: "number",
      label: "Kinetic Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frictionNewtons",
      kind: "number",
      label: "Friction Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateFrictionForce({
      normalNewtons: input.normalNewtons as number,
      kineticCoefficient: input.kineticCoefficient as number,
    }),
});
export const frictionForceTool = tool;
export const runFrictionForce = tool.execute;
export default tool;
