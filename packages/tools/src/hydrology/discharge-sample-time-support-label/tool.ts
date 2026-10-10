import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedTimeSupport: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTimeSupport: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "suppliedTimeSupport", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit discharge sample time-support label without treating instantaneous and averaged values as interchangeable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedTimeSupport, source } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(suppliedTimeSupport.length > 0, "suppliedTimeSupport");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([sampleId, suppliedTimeSupport, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    suppliedTimeSupport: "instantaneous",
    source: "Station record",
  },
  output: { token: '["S17","instantaneous","Station record"]' },
} satisfies ToolExample<Input, Output>;
export const dischargeSampleTimeSupportLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrology", "earth and environmental sciences"],
      keywords: ["hydrology", "earth and environmental sciences"],
    },
    id: "hydrology/discharge-sample-time-support-label",
    title: "Discharge Sample Time Support Label",
    description:
      "Qualify an explicit discharge sample time-support label without treating instantaneous and averaged values as interchangeable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTimeSupport: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "suppliedTimeSupport", "source"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTimeSupport",
          label: "Supplied Time Support",
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
export const run = dischargeSampleTimeSupportLabelTool.execute;
export default dischargeSampleTimeSupportLabelTool;
