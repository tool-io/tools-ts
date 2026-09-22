import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topArea: number;
  readonly bottomArea: number;
  readonly thickness: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topArea: { type: "number", minimum: 0 },
    bottomArea: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
  },
  required: ["topArea", "bottomArea", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Estimate one layer volume with a trapezoidal area-depth model, not an exact arbitrary-basin volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topArea, bottomArea, thickness } = request;
  const compute = (): Output => {
    H.domain(topArea >= 0 && bottomArea >= 0 && thickness >= 0);
    return { volume: (topArea / 2 + bottomArea / 2) * thickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topArea: 100, bottomArea: 60, thickness: 2 },
  output: { volume: 160 },
} satisfies ToolExample<Input, Output>;
export const waterbodyVolumeLayerContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/waterbody-volume-layer-contribution",
    title: "Waterbody Volume Layer Contribution Tool",
    description:
      "Estimate one layer volume with a trapezoidal area-depth model, not an exact arbitrary-basin volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topArea: { type: "number", minimum: 0 },
        bottomArea: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
      },
      required: ["topArea", "bottomArea", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "topArea",
          label: "Top Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomArea",
          label: "Bottom Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waterbodyVolumeLayerContributionTool.execute;
export default waterbodyVolumeLayerContributionTool;
