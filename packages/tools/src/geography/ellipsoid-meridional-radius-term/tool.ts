import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly semimajor: number;
  readonly eccentricitySquared: number;
  readonly latitudeRadians: number;
};
export type Output = { readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semimajor: { type: "number", exclusiveMinimum: 0 },
    eccentricitySquared: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    latitudeRadians: { type: "number" },
  },
  required: ["semimajor", "eccentricitySquared", "latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" } },
  required: ["radius"],
} as const;
/** Calculate ellipsoid meridional radius term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { semimajor, eccentricitySquared, latitudeRadians } = request;
  const compute = (): Output => {
    H.positive(semimajor);
    H.domain(
      eccentricitySquared >= 0 &&
        eccentricitySquared < 1 &&
        Math.abs(latitudeRadians) <= Math.PI / 2,
    );
    return {
      radius:
        (semimajor * (1 - eccentricitySquared)) /
        (1 - eccentricitySquared * Math.sin(latitudeRadians) ** 2) ** 1.5,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { semimajor: 10, eccentricitySquared: 0.36, latitudeRadians: 0 },
  output: { radius: 6.4 },
} satisfies ToolExample<Input, Output>;
export const ellipsoidMeridionalRadiusTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/ellipsoid-meridional-radius-term",
    title: "Ellipsoid Meridional Radius Term Tool",
    description:
      "Calculate ellipsoid meridional radius term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        semimajor: { type: "number", exclusiveMinimum: 0 },
        eccentricitySquared: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
        latitudeRadians: { type: "number" },
      },
      required: ["semimajor", "eccentricitySquared", "latitudeRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" } },
      required: ["radius"],
    },
    ports: {
      inputs: [
        {
          id: "semimajor",
          label: "Semimajor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eccentricitySquared",
          label: "Eccentricity Squared",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ellipsoidMeridionalRadiusTermTool.execute;
export default ellipsoidMeridionalRadiusTermTool;
