import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDistance: number;
  readonly newDistance: number;
};
export type Output = { readonly newToReferenceIrradianceRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDistance: { type: "number", exclusiveMinimum: 0 },
    newDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceDistance", "newDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newToReferenceIrradianceRatio: { type: "number" } },
  required: ["newToReferenceIrradianceRatio"],
} as const;
/** Calculate an ideal point-source inverse-square irradiance ratio for two positive distances, excluding extended-source and reflection effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDistance, newDistance } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(referenceDistance) && referenceDistance > 0,
      "referenceDistance",
    ),
      referenceDistance);
    (H.domain(Number.isFinite(newDistance) && newDistance > 0, "newDistance"),
      newDistance);
    return {
      newToReferenceIrradianceRatio: Math.pow(
        referenceDistance / newDistance,
        2,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDistance: 1, newDistance: 2 },
  output: { newToReferenceIrradianceRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const conservationLightDistanceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/conservation-light-distance-ratio",
    title: "Conservation Light Distance Ratio",
    description:
      "Calculate an ideal point-source inverse-square irradiance ratio for two positive distances, excluding extended-source and reflection effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDistance: { type: "number", exclusiveMinimum: 0 },
        newDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["referenceDistance", "newDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newToReferenceIrradianceRatio: { type: "number" } },
      required: ["newToReferenceIrradianceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDistance",
          label: "Reference Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newDistance",
          label: "New Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newToReferenceIrradianceRatio",
          label: "New To Reference Irradiance Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = conservationLightDistanceRatioTool.execute;
export default conservationLightDistanceRatioTool;
