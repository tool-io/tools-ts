import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radiusMeters: number;
  readonly suppliedKeratometricIndex: number;
};
export type Output = { readonly referenceDiopters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiusMeters: { type: "number", exclusiveMinimum: 0 },
    suppliedKeratometricIndex: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["radiusMeters", "suppliedKeratometricIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceDiopters: { type: "number" } },
  required: ["referenceDiopters"],
} as const;
/** Conventional index-minus-one over radius power using a caller-supplied keratometric index, not true two-surface corneal power. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radiusMeters, suppliedKeratometricIndex } = request;
  const compute = (): Output => {
    H.positive(radiusMeters);
    H.domain(suppliedKeratometricIndex > 1);
    return {
      referenceDiopters: (suppliedKeratometricIndex - 1) / radiusMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radiusMeters: 0.008, suppliedKeratometricIndex: 1.3375 },
  output: { referenceDiopters: 42.187499999999986 },
} satisfies ToolExample<Input, Output>;
export const cornealCurvatureRadiusDiopterReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ophthalmology/corneal-curvature-radius-diopter-reference",
      title: "Corneal Curvature Radius Diopter Reference Tool",
      description:
        "Conventional index-minus-one over radius power using a caller-supplied keratometric index, not true two-surface corneal power.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radiusMeters: { type: "number", exclusiveMinimum: 0 },
          suppliedKeratometricIndex: { type: "number", exclusiveMinimum: 1 },
        },
        required: ["radiusMeters", "suppliedKeratometricIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { referenceDiopters: { type: "number" } },
        required: ["referenceDiopters"],
      },
      ports: {
        inputs: [
          {
            id: "radiusMeters",
            label: "Radius Meters",
            required: true,
            valueType: { type: "number", unit: "m" },
          },
          {
            id: "suppliedKeratometricIndex",
            label: "Supplied Keratometric Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referenceDiopters",
            label: "Reference Diopters",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cornealCurvatureRadiusDiopterReferenceTool.execute;
export default cornealCurvatureRadiusDiopterReferenceTool;
