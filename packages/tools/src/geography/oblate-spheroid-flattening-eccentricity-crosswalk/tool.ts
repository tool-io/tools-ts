import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flattening: number };
export type Output = {
  readonly eccentricitySquared: number;
  readonly eccentricity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flattening: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["flattening"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eccentricitySquared: { type: "number" },
    eccentricity: { type: "number" },
  },
  required: ["eccentricitySquared", "eccentricity"],
} as const;
/** Calculate oblate spheroid flattening eccentricity crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flattening } = request;
  const compute = (): Output => {
    H.domain(flattening >= 0 && flattening < 1);
    const eccentricitySquared = flattening * (2 - flattening);
    return {
      eccentricitySquared,
      eccentricity: Math.sqrt(eccentricitySquared),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flattening: 0.2 },
  output: {
    eccentricitySquared: 0.36000000000000004,
    eccentricity: 0.6000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const oblateSpheroidFlatteningEccentricityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/oblate-spheroid-flattening-eccentricity-crosswalk",
      title: "Oblate Spheroid Flattening Eccentricity Crosswalk Tool",
      description:
        "Calculate oblate spheroid flattening eccentricity crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flattening: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        },
        required: ["flattening"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eccentricitySquared: { type: "number" },
          eccentricity: { type: "number" },
        },
        required: ["eccentricitySquared", "eccentricity"],
      },
      ports: {
        inputs: [
          {
            id: "flattening",
            label: "Flattening",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eccentricitySquared",
            label: "Eccentricity Squared",
            valueType: { type: "number" },
          },
          {
            id: "eccentricity",
            label: "Eccentricity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oblateSpheroidFlatteningEccentricityCrosswalkTool.execute;
export default oblateSpheroidFlatteningEccentricityCrosswalkTool;
