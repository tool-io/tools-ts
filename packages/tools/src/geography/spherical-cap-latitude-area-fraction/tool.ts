import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitudeRadians: number;
  readonly northCap: boolean;
};
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeRadians: { type: "number" },
    northCap: { type: "boolean" },
  },
  required: ["latitudeRadians", "northCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Return spherical surface area fraction north or south of a latitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeRadians, northCap } = request;
  const compute = (): Output => {
    H.domain(Math.abs(latitudeRadians) <= Math.PI / 2);
    const north = (1 - Math.sin(latitudeRadians)) / 2;
    return { fraction: northCap ? north : 1 - north };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitudeRadians: 0, northCap: true },
  output: { fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sphericalCapLatitudeAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/spherical-cap-latitude-area-fraction",
    title: "Spherical Cap Latitude Area Fraction Tool",
    description:
      "Return spherical surface area fraction north or south of a latitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitudeRadians: { type: "number" },
        northCap: { type: "boolean" },
      },
      required: ["latitudeRadians", "northCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "northCap",
          label: "North Cap",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sphericalCapLatitudeAreaFractionTool.execute;
export default sphericalCapLatitudeAreaFractionTool;
