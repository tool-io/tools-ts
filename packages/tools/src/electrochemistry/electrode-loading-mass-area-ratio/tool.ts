import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeMaterialMassMilligrams: number;
  readonly geometricAreaSquareCentimeters: number;
};
export type Output = { readonly loadingMilligramsPerSquareCentimeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMaterialMassMilligrams: { type: "number", minimum: 0 },
    geometricAreaSquareCentimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeMaterialMassMilligrams", "geometricAreaSquareCentimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loadingMilligramsPerSquareCentimeter: { type: "number" } },
  required: ["loadingMilligramsPerSquareCentimeter"],
} as const;
/** Describe a measured active-material electrode loading per explicitly supplied geometric area without selecting a loading target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeMaterialMassMilligrams, geometricAreaSquareCentimeters } =
    request;
  const compute = (): Output => {
    H.domain(activeMaterialMassMilligrams >= 0, "activeMaterialMassMilligrams");
    (H.domain(
      geometricAreaSquareCentimeters > 0,
      "geometricAreaSquareCentimeters",
    ),
      geometricAreaSquareCentimeters);
    return {
      loadingMilligramsPerSquareCentimeter:
        activeMaterialMassMilligrams / geometricAreaSquareCentimeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activeMaterialMassMilligrams: 5, geometricAreaSquareCentimeters: 2 },
  output: { loadingMilligramsPerSquareCentimeter: 2.5 },
} satisfies ToolExample<Input, Output>;
export const electrodeLoadingMassAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/electrode-loading-mass-area-ratio",
    title: "Electrode Loading Mass Area Ratio",
    description:
      "Describe a measured active-material electrode loading per explicitly supplied geometric area without selecting a loading target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMaterialMassMilligrams: { type: "number", minimum: 0 },
        geometricAreaSquareCentimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "activeMaterialMassMilligrams",
        "geometricAreaSquareCentimeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loadingMilligramsPerSquareCentimeter: { type: "number" } },
      required: ["loadingMilligramsPerSquareCentimeter"],
    },
    ports: {
      inputs: [
        {
          id: "activeMaterialMassMilligrams",
          label: "Active Material Mass Milligrams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "geometricAreaSquareCentimeters",
          label: "Geometric Area Square Centimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loadingMilligramsPerSquareCentimeter",
          label: "Loading Milligrams Per Square Centimeter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrodeLoadingMassAreaRatioTool.execute;
export default electrodeLoadingMassAreaRatioTool;
