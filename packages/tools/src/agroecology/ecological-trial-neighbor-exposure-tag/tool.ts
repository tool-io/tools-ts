import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotId: string;
  readonly neighborPlotId: string;
  readonly exposureCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotId: { type: "string", maxLength: 8192, minLength: 1 },
    neighborPlotId: { type: "string", maxLength: 8192, minLength: 1 },
    exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["plotId", "neighborPlotId", "exposureCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied trial-neighbor exposure metadata without inferring biological interaction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotId, neighborPlotId, exposureCode } = request;
  const compute = (): Output => {
    H.domain(plotId.length > 0, "plotId");
    H.domain(neighborPlotId.length > 0, "neighborPlotId");
    H.domain(exposureCode.length > 0, "exposureCode");
    return { token: JSON.stringify([plotId, neighborPlotId, exposureCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plotId: "P17", neighborPlotId: "P18", exposureCode: "downwind" },
  output: { token: '["P17","P18","downwind"]' },
} satisfies ToolExample<Input, Output>;
export const ecologicalTrialNeighborExposureTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/ecological-trial-neighbor-exposure-tag",
    title: "Ecological Trial Neighbor Exposure Tag",
    description:
      "Record supplied trial-neighbor exposure metadata without inferring biological interaction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotId: { type: "string", maxLength: 8192, minLength: 1 },
        neighborPlotId: { type: "string", maxLength: 8192, minLength: 1 },
        exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["plotId", "neighborPlotId", "exposureCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "plotId",
          label: "Plot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "neighborPlotId",
          label: "Neighbor Plot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exposureCode",
          label: "Exposure Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ecologicalTrialNeighborExposureTagTool.execute;
export default ecologicalTrialNeighborExposureTagTool;
