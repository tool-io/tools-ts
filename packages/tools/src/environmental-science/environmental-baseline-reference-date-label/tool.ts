import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricId: string;
  readonly suppliedBaselineDate: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBaselineDate: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["metricId", "suppliedBaselineDate", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit environmental baseline-date label and source without imputing missing date precision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricId, suppliedBaselineDate, source } = request;
  const compute = (): Output => {
    H.domain(metricId.length > 0, "metricId");
    H.domain(suppliedBaselineDate.length > 0, "suppliedBaselineDate");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([metricId, suppliedBaselineDate, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    metricId: "M17",
    suppliedBaselineDate: "2026-11-01",
    source: "Study A",
  },
  output: { token: '["M17","2026-11-01","Study A"]' },
} satisfies ToolExample<Input, Output>;
export const environmentalBaselineReferenceDateLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/environmental-baseline-reference-date-label",
      title: "Environmental Baseline Reference Date Label",
      description:
        "Preserve an explicit environmental baseline-date label and source without imputing missing date precision.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          metricId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedBaselineDate: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["metricId", "suppliedBaselineDate", "source"],
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
            id: "metricId",
            label: "Metric Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedBaselineDate",
            label: "Supplied Baseline Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = environmentalBaselineReferenceDateLabelTool.execute;
export default environmentalBaselineReferenceDateLabelTool;
