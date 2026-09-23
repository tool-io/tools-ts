import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly mass: number;
  readonly gravity: number;
};
export type Output = {
  readonly bodyWeight: number;
  readonly normalizedForce: number;
  readonly percentBodyWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    mass: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "mass", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyWeight: { type: "number" },
    normalizedForce: { type: "number" },
    percentBodyWeight: { type: "number" },
  },
  required: ["bodyWeight", "normalizedForce", "percentBodyWeight"],
} as const;
/** Calculate normalized force body weight reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, mass, gravity } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.positive(gravity);
    return {
      bodyWeight: mass * gravity,
      normalizedForce: force / (mass * gravity),
      percentBodyWeight: (100 * force) / (mass * gravity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 1200, mass: 60, gravity: 10 },
  output: { bodyWeight: 600, normalizedForce: 2, percentBodyWeight: 200 },
} satisfies ToolExample<Input, Output>;
export const normalizedForceBodyWeightReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/normalized-force-body-weight-reference",
    title: "Normalized Force Body Weight Reference Tool",
    description:
      "Calculate normalized force body weight reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        mass: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "mass", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyWeight: { type: "number" },
        normalizedForce: { type: "number" },
        percentBodyWeight: { type: "number" },
      },
      required: ["bodyWeight", "normalizedForce", "percentBodyWeight"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
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
      ],
      outputs: [
        {
          id: "bodyWeight",
          label: "Body Weight",
          valueType: { type: "number" },
        },
        {
          id: "normalizedForce",
          label: "Normalized Force",
          valueType: { type: "number" },
        },
        {
          id: "percentBodyWeight",
          label: "Percent Body Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = normalizedForceBodyWeightReferenceTool.execute;
export default normalizedForceBodyWeightReferenceTool;
