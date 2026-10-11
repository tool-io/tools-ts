import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointCode: string;
  readonly recordedSide: string;
  readonly chartSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSide: { type: "string", maxLength: 8192, minLength: 1 },
    chartSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["jointCode", "recordedSide", "chartSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit joint chart site and side by its source without resolving anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointCode, recordedSide, chartSource } = request;
  const compute = (): Output => {
    H.domain(jointCode.length > 0, "jointCode");
    H.domain(recordedSide.length > 0, "recordedSide");
    H.domain(chartSource.length > 0, "chartSource");
    return { token: JSON.stringify([jointCode, recordedSide, chartSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointCode: "J17", recordedSide: "left", chartSource: "Chart A" },
  output: { token: '["J17","left","Chart A"]' },
} satisfies ToolExample<Input, Output>;
export const jointChartSideSiteTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/joint-chart-side-site-token",
    title: "Joint Chart Side Site Token",
    description:
      "Qualify an explicit joint chart site and side by its source without resolving anatomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSide: { type: "string", maxLength: 8192, minLength: 1 },
        chartSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["jointCode", "recordedSide", "chartSource"],
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
          id: "jointCode",
          label: "Joint Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSide",
          label: "Recorded Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chartSource",
          label: "Chart Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = jointChartSideSiteTokenTool.execute;
export default jointChartSideSiteTokenTool;
