import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fiberForce: number;
  readonly pennationRadians: number;
  readonly fiberLength: number;
};
export type Output = {
  readonly tendonComponent: number;
  readonly transverseComponent: number;
  readonly projectedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiberForce: { type: "number", minimum: 0 },
    pennationRadians: { type: "number" },
    fiberLength: { type: "number", minimum: 0 },
  },
  required: ["fiberForce", "pennationRadians", "fiberLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tendonComponent: { type: "number" },
    transverseComponent: { type: "number" },
    projectedLength: { type: "number" },
  },
  required: ["tendonComponent", "transverseComponent", "projectedLength"],
} as const;
/** Ideal force and length projection relative to a supplied tendon axis, excluding force transmission through a full muscle architecture. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fiberForce, pennationRadians, fiberLength } = request;
  const compute = (): Output => {
    H.domain(
      fiberForce >= 0 &&
        fiberLength >= 0 &&
        pennationRadians >= -Math.PI / 2 &&
        pennationRadians <= Math.PI / 2,
    );
    return {
      tendonComponent: fiberForce * Math.cos(pennationRadians),
      transverseComponent: fiberForce * Math.sin(pennationRadians),
      projectedLength: fiberLength * Math.cos(pennationRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fiberForce: 100,
    pennationRadians: 1.0471975511965976,
    fiberLength: 10,
  },
  output: {
    tendonComponent: 50.000000000000014,
    transverseComponent: 86.60254037844386,
    projectedLength: 5.000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const musclePennationForceProjectionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/muscle-pennation-force-projection-term",
    title: "Muscle Pennation Force Projection Term Tool",
    description:
      "Ideal force and length projection relative to a supplied tendon axis, excluding force transmission through a full muscle architecture.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fiberForce: { type: "number", minimum: 0 },
        pennationRadians: { type: "number" },
        fiberLength: { type: "number", minimum: 0 },
      },
      required: ["fiberForce", "pennationRadians", "fiberLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tendonComponent: { type: "number" },
        transverseComponent: { type: "number" },
        projectedLength: { type: "number" },
      },
      required: ["tendonComponent", "transverseComponent", "projectedLength"],
    },
    ports: {
      inputs: [
        {
          id: "fiberForce",
          label: "Fiber Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pennationRadians",
          label: "Pennation Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "fiberLength",
          label: "Fiber Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tendonComponent",
          label: "Tendon Component",
          valueType: { type: "number" },
        },
        {
          id: "transverseComponent",
          label: "Transverse Component",
          valueType: { type: "number" },
        },
        {
          id: "projectedLength",
          label: "Projected Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = musclePennationForceProjectionTermTool.execute;
export default musclePennationForceProjectionTermTool;
