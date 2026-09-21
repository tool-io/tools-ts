import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceTension: number;
  readonly contactAngleRadians: number;
  readonly radius: number;
  readonly liquidDensity: number;
  readonly gravity: number;
};
export type Output = { readonly head: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceTension: { type: "number", minimum: 0 },
    contactAngleRadians: { type: "number" },
    radius: { type: "number", exclusiveMinimum: 0 },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "surfaceTension",
    "contactAngleRadians",
    "radius",
    "liquidDensity",
    "gravity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { head: { type: "number" } },
  required: ["head"],
} as const;
/** Calculate capillary rise pore radius factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    surfaceTension,
    contactAngleRadians,
    radius,
    liquidDensity,
    gravity,
  } = request;
  const compute = (): Output => {
    H.domain(surfaceTension >= 0);
    H.positive(radius);
    H.positive(liquidDensity);
    H.positive(gravity);
    return {
      head:
        (2 * surfaceTension * Math.cos(contactAngleRadians)) /
        (radius * liquidDensity * gravity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surfaceTension: 0.072,
    contactAngleRadians: 0,
    radius: 0.001,
    liquidDensity: 1000,
    gravity: 10,
  },
  output: { head: 0.0144 },
} satisfies ToolExample<Input, Output>;
export const capillaryRisePoreRadiusFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/capillary-rise-pore-radius-factor",
    title: "Capillary Rise Pore Radius Factor Tool",
    description:
      "Calculate capillary rise pore radius factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceTension: { type: "number", minimum: 0 },
        contactAngleRadians: { type: "number" },
        radius: { type: "number", exclusiveMinimum: 0 },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "surfaceTension",
        "contactAngleRadians",
        "radius",
        "liquidDensity",
        "gravity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { head: { type: "number" } },
      required: ["head"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceTension",
          label: "Surface Tension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactAngleRadians",
          label: "Contact Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
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
      outputs: [{ id: "head", label: "Head", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = capillaryRisePoreRadiusFactorTool.execute;
export default capillaryRisePoreRadiusFactorTool;
