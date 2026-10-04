import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceIrradiance: number;
  readonly referenceDistance: number;
  readonly distance: number;
  readonly suppliedExponent: number;
};
export type Output = { readonly conditionalIrradiance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceIrradiance: { type: "number", minimum: 0 },
    referenceDistance: { type: "number", exclusiveMinimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
    suppliedExponent: { type: "number" },
  },
  required: [
    "referenceIrradiance",
    "referenceDistance",
    "distance",
    "suppliedExponent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conditionalIrradiance: { type: "number" } },
  required: ["conditionalIrradiance"],
} as const;
/** Conditional supplied power-law light scaling, not an extended-source lighting model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceIrradiance, referenceDistance, distance, suppliedExponent } =
    request;
  const compute = (): Output => {
    H.domain(referenceIrradiance >= 0);
    H.positive(referenceDistance);
    H.positive(distance);
    return {
      conditionalIrradiance:
        referenceIrradiance *
        (referenceDistance / distance) ** suppliedExponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceIrradiance: 100,
    referenceDistance: 1,
    distance: 2,
    suppliedExponent: 2,
  },
  output: { conditionalIrradiance: 25 },
} satisfies ToolExample<Input, Output>;
export const shelfLightDistanceSuppliedIrradianceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/shelf-light-distance-supplied-irradiance-factor",
      title: "Shelf Light Distance Supplied Irradiance Factor Tool",
      description:
        "Conditional supplied power-law light scaling, not an extended-source lighting model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceIrradiance: { type: "number", minimum: 0 },
          referenceDistance: { type: "number", exclusiveMinimum: 0 },
          distance: { type: "number", exclusiveMinimum: 0 },
          suppliedExponent: { type: "number" },
        },
        required: [
          "referenceIrradiance",
          "referenceDistance",
          "distance",
          "suppliedExponent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalIrradiance: { type: "number" } },
        required: ["conditionalIrradiance"],
      },
      ports: {
        inputs: [
          {
            id: "referenceIrradiance",
            label: "Reference Irradiance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceDistance",
            label: "Reference Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedExponent",
            label: "Supplied Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conditionalIrradiance",
            label: "Conditional Irradiance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = shelfLightDistanceSuppliedIrradianceFactorTool.execute;
export default shelfLightDistanceSuppliedIrradianceFactorTool;
