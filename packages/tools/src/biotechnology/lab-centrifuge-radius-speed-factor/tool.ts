import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radiusMetres: number;
  readonly rpm: number;
  readonly gravity: number;
};
export type Output = { readonly relativeForce: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiusMetres: { type: "number", minimum: 0 },
    rpm: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radiusMetres", "rpm", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeForce: { type: "number" } },
  required: ["relativeForce"],
} as const;
/** Calculate lab centrifuge radius speed factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radiusMetres, rpm, gravity } = request;
  const compute = (): Output => {
    H.domain(radiusMetres >= 0 && rpm >= 0);
    H.positive(gravity);
    return {
      relativeForce: (radiusMetres * ((rpm * Math.PI) / 30) ** 2) / gravity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radiusMetres: 0.1, rpm: 3000, gravity: 10 },
  output: { relativeForce: 986.960440108936 },
} satisfies ToolExample<Input, Output>;
export const labCentrifugeRadiusSpeedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/lab-centrifuge-radius-speed-factor",
    title: "Lab Centrifuge Radius Speed Factor Tool",
    description:
      "Calculate lab centrifuge radius speed factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiusMetres: { type: "number", minimum: 0 },
        rpm: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radiusMetres", "rpm", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeForce: { type: "number" } },
      required: ["relativeForce"],
    },
    ports: {
      inputs: [
        {
          id: "radiusMetres",
          label: "Radius Metres",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rpm",
          label: "Rpm",
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
          id: "relativeForce",
          label: "Relative Force",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = labCentrifugeRadiusSpeedFactorTool.execute;
export default labCentrifugeRadiusSpeedFactorTool;
