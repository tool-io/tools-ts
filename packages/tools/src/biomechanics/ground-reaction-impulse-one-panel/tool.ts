import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstForce: number;
  readonly secondForce: number;
  readonly seconds: number;
  readonly bodyMass: number;
  readonly gravity: number;
};
export type Output = {
  readonly grossImpulse: number;
  readonly netVerticalImpulse: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstForce: { type: "number" },
    secondForce: { type: "number" },
    seconds: { type: "number", minimum: 0 },
    bodyMass: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstForce", "secondForce", "seconds", "bodyMass", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossImpulse: { type: "number" },
    netVerticalImpulse: { type: "number" },
  },
  required: ["grossImpulse", "netVerticalImpulse"],
} as const;
/** Trapezoidal vertical force impulse, subtracting body weight once for net impulse; forces are signed on an upward-positive axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstForce, secondForce, seconds, bodyMass, gravity } = request;
  const compute = (): Output => {
    H.domain(seconds >= 0 && bodyMass >= 0);
    H.positive(gravity);
    return {
      grossImpulse: ((firstForce + secondForce) * seconds) / 2,
      netVerticalImpulse:
        ((firstForce + secondForce) / 2 - bodyMass * gravity) * seconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstForce: 800,
    secondForce: 1000,
    seconds: 0.1,
    bodyMass: 80,
    gravity: 10,
  },
  output: { grossImpulse: 90, netVerticalImpulse: 10 },
} satisfies ToolExample<Input, Output>;
export const groundReactionImpulseOnePanelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/ground-reaction-impulse-one-panel",
    title: "Ground Reaction Impulse One Panel Tool",
    description:
      "Trapezoidal vertical force impulse, subtracting body weight once for net impulse; forces are signed on an upward-positive axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstForce: { type: "number" },
        secondForce: { type: "number" },
        seconds: { type: "number", minimum: 0 },
        bodyMass: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstForce", "secondForce", "seconds", "bodyMass", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossImpulse: { type: "number" },
        netVerticalImpulse: { type: "number" },
      },
      required: ["grossImpulse", "netVerticalImpulse"],
    },
    ports: {
      inputs: [
        {
          id: "firstForce",
          label: "First Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondForce",
          label: "Second Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seconds",
          label: "Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyMass",
          label: "Body Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossImpulse",
          label: "Gross Impulse",
          valueType: { type: "number" },
        },
        {
          id: "netVerticalImpulse",
          label: "Net Vertical Impulse",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groundReactionImpulseOnePanelTool.execute;
export default groundReactionImpulseOnePanelTool;
