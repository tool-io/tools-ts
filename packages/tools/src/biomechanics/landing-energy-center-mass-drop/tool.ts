import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly gravity: number;
  readonly heightDrop: number;
  readonly incomingSpeed: number;
};
export type Output = {
  readonly potentialDrop: number;
  readonly initialKinetic: number;
  readonly totalMechanicalEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    heightDrop: { type: "number", minimum: 0 },
    incomingSpeed: { type: "number", minimum: 0 },
  },
  required: ["mass", "gravity", "heightDrop", "incomingSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialDrop: { type: "number" },
    initialKinetic: { type: "number" },
    totalMechanicalEnergy: { type: "number" },
  },
  required: ["potentialDrop", "initialKinetic", "totalMechanicalEnergy"],
} as const;
/** Point-mass mechanical energy budget without a landing-force, tissue-load or injury prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, gravity, heightDrop, incomingSpeed } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && heightDrop >= 0 && incomingSpeed >= 0);
    H.positive(gravity);
    return {
      potentialDrop: mass * gravity * heightDrop,
      initialKinetic: (mass * incomingSpeed ** 2) / 2,
      totalMechanicalEnergy:
        mass * gravity * heightDrop + (mass * incomingSpeed ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 60, gravity: 10, heightDrop: 0.5, incomingSpeed: 2 },
  output: {
    potentialDrop: 300,
    initialKinetic: 120,
    totalMechanicalEnergy: 420,
  },
} satisfies ToolExample<Input, Output>;
export const landingEnergyCenterMassDropTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/landing-energy-center-mass-drop",
    title: "Landing Energy Center Mass Drop Tool",
    description:
      "Point-mass mechanical energy budget without a landing-force, tissue-load or injury prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        heightDrop: { type: "number", minimum: 0 },
        incomingSpeed: { type: "number", minimum: 0 },
      },
      required: ["mass", "gravity", "heightDrop", "incomingSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        potentialDrop: { type: "number" },
        initialKinetic: { type: "number" },
        totalMechanicalEnergy: { type: "number" },
      },
      required: ["potentialDrop", "initialKinetic", "totalMechanicalEnergy"],
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
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heightDrop",
          label: "Height Drop",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomingSpeed",
          label: "Incoming Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "potentialDrop",
          label: "Potential Drop",
          valueType: { type: "number" },
        },
        {
          id: "initialKinetic",
          label: "Initial Kinetic",
          valueType: { type: "number" },
        },
        {
          id: "totalMechanicalEnergy",
          label: "Total Mechanical Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landingEnergyCenterMassDropTool.execute;
export default landingEnergyCenterMassDropTool;
