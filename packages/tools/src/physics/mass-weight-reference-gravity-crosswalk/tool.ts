import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massKilograms: number;
  readonly suppliedGravityMetersPerSecondSquared: number;
};
export type Output = { readonly weightMagnitudeNewtons: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massKilograms: { type: "number", minimum: 0 },
    suppliedGravityMetersPerSecondSquared: { type: "number", minimum: 0 },
  },
  required: ["massKilograms", "suppliedGravityMetersPerSecondSquared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightMagnitudeNewtons: { type: "number" } },
  required: ["weightMagnitudeNewtons"],
} as const;
/** Calculate weight magnitude from explicit mass and supplied local gravitational acceleration without assuming standard gravity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massKilograms, suppliedGravityMetersPerSecondSquared } = request;
  const compute = (): Output => {
    H.domain(
      massKilograms >= 0 && suppliedGravityMetersPerSecondSquared >= 0,
      "massKilograms",
    );
    return {
      weightMagnitudeNewtons:
        massKilograms * suppliedGravityMetersPerSecondSquared,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massKilograms: 2, suppliedGravityMetersPerSecondSquared: 9.8 },
  output: { weightMagnitudeNewtons: 19.6 },
} satisfies ToolExample<Input, Output>;
export const massWeightReferenceGravityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["physics"],
        keywords: ["physics"],
      },
      id: "physics/mass-weight-reference-gravity-crosswalk",
      title: "Mass Weight Reference Gravity Crosswalk",
      description:
        "Calculate weight magnitude from explicit mass and supplied local gravitational acceleration without assuming standard gravity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          massKilograms: { type: "number", minimum: 0 },
          suppliedGravityMetersPerSecondSquared: { type: "number", minimum: 0 },
        },
        required: ["massKilograms", "suppliedGravityMetersPerSecondSquared"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { weightMagnitudeNewtons: { type: "number" } },
        required: ["weightMagnitudeNewtons"],
      },
      ports: {
        inputs: [
          {
            id: "massKilograms",
            label: "Mass Kilograms",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedGravityMetersPerSecondSquared",
            label: "Supplied Gravity Meters Per Second Squared",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightMagnitudeNewtons",
            label: "Weight Magnitude Newtons",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = massWeightReferenceGravityCrosswalkTool.execute;
export default massWeightReferenceGravityCrosswalkTool;
