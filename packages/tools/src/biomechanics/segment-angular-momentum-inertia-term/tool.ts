import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inertia: number;
  readonly angularSpeed: number;
  readonly centerMass: number;
  readonly centerPosition: number;
  readonly centerVelocity: number;
};
export type Output = {
  readonly spinMomentum: number;
  readonly planarOrbitalMomentum: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inertia: { type: "number", minimum: 0 },
    angularSpeed: { type: "number" },
    centerMass: { type: "number", minimum: 0 },
    centerPosition: { type: "number" },
    centerVelocity: { type: "number" },
  },
  required: [
    "inertia",
    "angularSpeed",
    "centerMass",
    "centerPosition",
    "centerVelocity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spinMomentum: { type: "number" },
    planarOrbitalMomentum: { type: "number" },
    total: { type: "number" },
  },
  required: ["spinMomentum", "planarOrbitalMomentum", "total"],
} as const;
/** Planar angular momentum with centerVelocity interpreted as the signed tangential component perpendicular to the radial centerPosition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inertia, angularSpeed, centerMass, centerPosition, centerVelocity } =
    request;
  const compute = (): Output => {
    H.domain(inertia >= 0 && centerMass >= 0);
    return {
      spinMomentum: inertia * angularSpeed,
      planarOrbitalMomentum: centerMass * centerPosition * centerVelocity,
      total:
        inertia * angularSpeed + centerMass * centerPosition * centerVelocity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inertia: 2,
    angularSpeed: 3,
    centerMass: 4,
    centerPosition: 2,
    centerVelocity: 1,
  },
  output: { spinMomentum: 6, planarOrbitalMomentum: 8, total: 14 },
} satisfies ToolExample<Input, Output>;
export const segmentAngularMomentumInertiaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/segment-angular-momentum-inertia-term",
    title: "Segment Angular Momentum Inertia Term Tool",
    description:
      "Planar angular momentum with centerVelocity interpreted as the signed tangential component perpendicular to the radial centerPosition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inertia: { type: "number", minimum: 0 },
        angularSpeed: { type: "number" },
        centerMass: { type: "number", minimum: 0 },
        centerPosition: { type: "number" },
        centerVelocity: { type: "number" },
      },
      required: [
        "inertia",
        "angularSpeed",
        "centerMass",
        "centerPosition",
        "centerVelocity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spinMomentum: { type: "number" },
        planarOrbitalMomentum: { type: "number" },
        total: { type: "number" },
      },
      required: ["spinMomentum", "planarOrbitalMomentum", "total"],
    },
    ports: {
      inputs: [
        {
          id: "inertia",
          label: "Inertia",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularSpeed",
          label: "Angular Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerMass",
          label: "Center Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerPosition",
          label: "Center Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerVelocity",
          label: "Center Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spinMomentum",
          label: "Spin Momentum",
          valueType: { type: "number" },
        },
        {
          id: "planarOrbitalMomentum",
          label: "Planar Orbital Momentum",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = segmentAngularMomentumInertiaTermTool.execute;
export default segmentAngularMomentumInertiaTermTool;
