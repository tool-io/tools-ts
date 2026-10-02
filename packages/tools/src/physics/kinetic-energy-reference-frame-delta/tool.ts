import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  mass: number;
  velocity: number;
  frameVelocity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mass", label: "Mass", kind: "number" },
  { id: "velocity", label: "Velocity", kind: "number" },
  { id: "frameVelocity", label: "Frame velocity", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.mass >= 0);
  return H.finish({
    originalKineticEnergy: 0.5 * i.mass * i.velocity ** 2,
    transformedKineticEnergy:
      0.5 * i.mass * (i.velocity - i.frameVelocity) ** 2,
    energyDelta:
      0.5 * i.mass * (i.frameVelocity ** 2 - 2 * i.velocity * i.frameVelocity),
  });
};
export const example = {
  input: { mass: 2, velocity: 3, frameVelocity: 1 },
  output: {
    result: {
      originalKineticEnergy: 9,
      transformedKineticEnergy: 4,
      energyDelta: -5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "physics/kinetic-energy-reference-frame-delta",
  title: "Physics: Kinetic Energy Reference Frame Delta Tool",
  description:
    "Compare nonrelativistic one-axis kinetic energies across a Galilean frame shift, including the signed energy change; no relativistic speeds or energy conservation claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          energyDelta: { type: "number" },
          originalKineticEnergy: { type: "number" },
          transformedKineticEnergy: { type: "number" },
        },
        required: [
          "energyDelta",
          "originalKineticEnergy",
          "transformedKineticEnergy",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
