import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerArea: number;
  readonly holeAreas: readonly number[];
  readonly sharedHoleArea: number;
  readonly pixelArea: number;
};
export type Output = {
  readonly netPixelArea: number;
  readonly physicalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerArea: { type: "number", minimum: 0 },
    holeAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    sharedHoleArea: { type: "number", minimum: 0 },
    pixelArea: { type: "number", minimum: 0 },
  },
  required: ["outerArea", "holeAreas", "sharedHoleArea", "pixelArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPixelArea: { type: "number" },
    physicalArea: { type: "number" },
  },
  required: ["netPixelArea", "physicalArea"],
} as const;
/** Supplied annotation geometry only; no lesion classification or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerArea, holeAreas, sharedHoleArea, pixelArea } = request;
  const compute = (): Output => {
    H.domain(
      outerArea >= 0 &&
        holeAreas.every((x) => x >= 0) &&
        sharedHoleArea >= 0 &&
        sharedHoleArea <= holeAreas.reduce((a, b) => a + b, 0) &&
        holeAreas.reduce((a, b) => a + b, 0) - sharedHoleArea <= outerArea &&
        pixelArea >= 0,
    );
    return {
      netPixelArea:
        outerArea - holeAreas.reduce((a, b) => a + b, 0) + sharedHoleArea,
      physicalArea:
        (outerArea - holeAreas.reduce((a, b) => a + b, 0) + sharedHoleArea) *
        pixelArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outerArea: 100,
    holeAreas: [10, 5],
    sharedHoleArea: 0,
    pixelArea: 0.2,
  },
  output: { netPixelArea: 85, physicalArea: 17 },
} satisfies ToolExample<Input, Output>;
export const lesionAnnotationHolesAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/lesion-annotation-holes-area-term",
    title: "Lesion Annotation Holes Area Term Tool",
    description:
      "Supplied annotation geometry only; no lesion classification or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerArea: { type: "number", minimum: 0 },
        holeAreas: { type: "array", maxItems: 256, items: { type: "number" } },
        sharedHoleArea: { type: "number", minimum: 0 },
        pixelArea: { type: "number", minimum: 0 },
      },
      required: ["outerArea", "holeAreas", "sharedHoleArea", "pixelArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netPixelArea: { type: "number" },
        physicalArea: { type: "number" },
      },
      required: ["netPixelArea", "physicalArea"],
    },
    ports: {
      inputs: [
        {
          id: "outerArea",
          label: "Outer Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "holeAreas",
          label: "Hole Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sharedHoleArea",
          label: "Shared Hole Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pixelArea",
          label: "Pixel Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netPixelArea",
          label: "Net Pixel Area",
          valueType: { type: "number" },
        },
        {
          id: "physicalArea",
          label: "Physical Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lesionAnnotationHolesAreaTermTool.execute;
export default lesionAnnotationHolesAreaTermTool;
