import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly velocity: readonly number[];
  readonly impulse: readonly number[];
};
export type Output = { readonly velocity: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", exclusiveMinimum: 0 },
    velocity: { type: "array", maxItems: 256, items: { type: "number" } },
    impulse: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["mass", "velocity", "impulse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["velocity"],
} as const;
/** Calculate rigidbody center mass impulse speed step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, velocity, impulse } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.sameLength(velocity, impulse);
    return { velocity: velocity.map((x, i) => x + impulse[i] / mass) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 2, velocity: [1, 2], impulse: [4, -2] },
  output: { velocity: [3, 1] },
} satisfies ToolExample<Input, Output>;
export const rigidbodyCenterMassImpulseSpeedStepTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/rigidbody-center-mass-impulse-speed-step",
      title: "Rigidbody Center Mass Impulse Speed Step Tool",
      description:
        "Calculate rigidbody center mass impulse speed step from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", exclusiveMinimum: 0 },
          velocity: { type: "array", maxItems: 256, items: { type: "number" } },
          impulse: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["mass", "velocity", "impulse"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          velocity: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["velocity"],
      },
      ports: {
        inputs: [
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "velocity",
            label: "Velocity",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "impulse",
            label: "Impulse",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "velocity",
            label: "Velocity",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = rigidbodyCenterMassImpulseSpeedStepTool.execute;
export default rigidbodyCenterMassImpulseSpeedStepTool;
