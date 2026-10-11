import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly seriousnessWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    seriousnessWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reportId", "seriousnessWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly reported seriousness wording and source without assigning a regulatory classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, seriousnessWording, source } = request;
  const compute = (): Output => {
    H.domain(reportId.length > 0, "reportId");
    H.domain(seriousnessWording.length > 0, "seriousnessWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([reportId, seriousnessWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportId: "AE17",
    seriousnessWording: "reported serious",
    source: "Investigator record",
  },
  output: { token: '["AE17","reported serious","Investigator record"]' },
} satisfies ToolExample<Input, Output>;
export const safetyReportSeriousnessSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/safety-report-seriousness-source-label",
    title: "Safety Report Seriousness Source Label",
    description:
      "Preserve explicitly reported seriousness wording and source without assigning a regulatory classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        seriousnessWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reportId", "seriousnessWording", "source"],
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
          id: "reportId",
          label: "Report Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriousnessWording",
          label: "Seriousness Wording",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = safetyReportSeriousnessSourceLabelTool.execute;
export default safetyReportSeriousnessSourceLabelTool;
