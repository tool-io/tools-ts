import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentAmperes: number;
  readonly referenceAreaSquareCentimeters: number;
};
export type Output = { readonly amperesPerSquareCentimeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentAmperes: { type: "number" },
    referenceAreaSquareCentimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentAmperes", "referenceAreaSquareCentimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amperesPerSquareCentimeter: { type: "number" } },
  required: ["amperesPerSquareCentimeter"],
} as const;
/** Normalize signed measured electrochemical current to an explicitly defined positive reference area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentAmperes, referenceAreaSquareCentimeters } = request;
  const compute = (): Output => {
    (H.domain(
      referenceAreaSquareCentimeters > 0,
      "referenceAreaSquareCentimeters",
    ),
      referenceAreaSquareCentimeters);
    return {
      amperesPerSquareCentimeter:
        currentAmperes / referenceAreaSquareCentimeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentAmperes: 0.02, referenceAreaSquareCentimeters: 2 },
  output: { amperesPerSquareCentimeter: 0.01 },
} satisfies ToolExample<Input, Output>;
export const currentDensityAreaReferenceTool = H.defineSchemaCalculation<
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
    id: "electrochemistry/current-density-area-reference",
    title: "Current Density Area Reference",
    description:
      "Normalize signed measured electrochemical current to an explicitly defined positive reference area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentAmperes: { type: "number" },
        referenceAreaSquareCentimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["currentAmperes", "referenceAreaSquareCentimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { amperesPerSquareCentimeter: { type: "number" } },
      required: ["amperesPerSquareCentimeter"],
    },
    ports: {
      inputs: [
        {
          id: "currentAmperes",
          label: "Current Amperes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAreaSquareCentimeters",
          label: "Reference Area Square Centimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "amperesPerSquareCentimeter",
          label: "Amperes Per Square Centimeter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = currentDensityAreaReferenceTool.execute;
export default currentDensityAreaReferenceTool;
