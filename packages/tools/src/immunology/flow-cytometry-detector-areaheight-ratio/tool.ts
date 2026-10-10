import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detectorArea: number;
  readonly detectorHeight: number;
};
export type Output = { readonly areaHeightRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectorArea: { type: "number", minimum: 0 },
    detectorHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["detectorArea", "detectorHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaHeightRatio: { type: "number" } },
  required: ["areaHeightRatio"],
} as const;
/** Divide supplied flow-detector pulse area by positive pulse height without classifying doublets or cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detectorArea, detectorHeight } = request;
  const compute = (): Output => {
    H.domain(detectorArea >= 0, "detectorArea");
    (H.domain(
      Number.isFinite(detectorHeight) && detectorHeight > 0,
      "detectorHeight",
    ),
      detectorHeight);
    return { areaHeightRatio: detectorArea / detectorHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detectorArea: 120, detectorHeight: 30 },
  output: { areaHeightRatio: 4 },
} satisfies ToolExample<Input, Output>;
export const flowCytometryDetectorAreaheightRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/flow-cytometry-detector-areaheight-ratio",
      title: "Flow Cytometry Detector Areaheight Ratio Tool",
      description:
        "Divide supplied flow-detector pulse area by positive pulse height without classifying doublets or cells.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          detectorArea: { type: "number", minimum: 0 },
          detectorHeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["detectorArea", "detectorHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { areaHeightRatio: { type: "number" } },
        required: ["areaHeightRatio"],
      },
      ports: {
        inputs: [
          {
            id: "detectorArea",
            label: "Detector Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "detectorHeight",
            label: "Detector Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "areaHeightRatio",
            label: "Area Height Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = flowCytometryDetectorAreaheightRatioTool.execute;
export default flowCytometryDetectorAreaheightRatioTool;
