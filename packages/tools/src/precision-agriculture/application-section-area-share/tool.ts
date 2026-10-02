import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionWidth: number;
  readonly travelledDistance: number;
  readonly totalArea: number;
};
export type Output = { readonly sectionArea: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionWidth: { type: "number", minimum: 0 },
    travelledDistance: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sectionWidth", "travelledDistance", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sectionArea: { type: "number" }, share: { type: "number" } },
  required: ["sectionArea", "share"],
} as const;
/** Audit supplied section geometry relative to a declared area; no application rate is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionWidth, travelledDistance, totalArea } = request;
  const compute = (): Output => {
    H.domain(sectionWidth >= 0 && travelledDistance >= 0);
    H.positive(totalArea);
    return {
      sectionArea: sectionWidth * travelledDistance,
      share: (sectionWidth * travelledDistance) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectionWidth: 2, travelledDistance: 10, totalArea: 100 },
  output: { sectionArea: 20, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const applicationSectionAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/application-section-area-share",
    title: "Application Section Area Share Tool",
    description:
      "Audit supplied section geometry relative to a declared area; no application rate is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionWidth: { type: "number", minimum: 0 },
        travelledDistance: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sectionWidth", "travelledDistance", "totalArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionArea: { type: "number" },
        share: { type: "number" },
      },
      required: ["sectionArea", "share"],
    },
    ports: {
      inputs: [
        {
          id: "sectionWidth",
          label: "Section Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelledDistance",
          label: "Travelled Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sectionArea",
          label: "Section Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = applicationSectionAreaShareTool.execute;
export default applicationSectionAreaShareTool;
