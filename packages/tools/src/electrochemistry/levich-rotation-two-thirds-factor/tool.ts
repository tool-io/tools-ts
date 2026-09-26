import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diffusivity: number;
  readonly kinematicViscosity: number;
  readonly angularSpeed: number;
  readonly coefficient: number;
};
export type Output = { readonly transportFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diffusivity: { type: "number", exclusiveMinimum: 0 },
    kinematicViscosity: { type: "number", exclusiveMinimum: 0 },
    angularSpeed: { type: "number", minimum: 0 },
    coefficient: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "diffusivity",
    "kinematicViscosity",
    "angularSpeed",
    "coefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transportFactor: { type: "number" } },
  required: ["transportFactor"],
} as const;
/** Levich transport factor D^(2/3) nu^(-1/6) omega^(1/2); rotation is radians per time unit, with a supplied convention-specific coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diffusivity, kinematicViscosity, angularSpeed, coefficient } =
    request;
  const compute = (): Output => {
    H.positive(diffusivity);
    H.positive(kinematicViscosity);
    H.domain(angularSpeed >= 0);
    H.positive(coefficient);
    return {
      transportFactor:
        coefficient *
        diffusivity ** (2 / 3) *
        kinematicViscosity ** (-1 / 6) *
        Math.sqrt(angularSpeed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    diffusivity: 1e-9,
    kinematicViscosity: 0.000001,
    angularSpeed: 100,
    coefficient: 0.62,
  },
  output: { transportFactor: 0.00006200000000000004 },
} satisfies ToolExample<Input, Output>;
export const levichRotationTwoThirdsFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/levich-rotation-two-thirds-factor",
    title: "Levich Rotation Two Thirds Factor Tool",
    description:
      "Levich transport factor D^(2/3) nu^(-1/6) omega^(1/2); rotation is radians per time unit, with a supplied convention-specific coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diffusivity: { type: "number", exclusiveMinimum: 0 },
        kinematicViscosity: { type: "number", exclusiveMinimum: 0 },
        angularSpeed: { type: "number", minimum: 0 },
        coefficient: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "diffusivity",
        "kinematicViscosity",
        "angularSpeed",
        "coefficient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transportFactor: { type: "number" } },
      required: ["transportFactor"],
    },
    ports: {
      inputs: [
        {
          id: "diffusivity",
          label: "Diffusivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "kinematicViscosity",
          label: "Kinematic Viscosity",
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
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transportFactor",
          label: "Transport Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = levichRotationTwoThirdsFactorTool.execute;
export default levichRotationTwoThirdsFactorTool;
