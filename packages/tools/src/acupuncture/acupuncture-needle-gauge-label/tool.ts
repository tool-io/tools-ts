import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly gaugeText: string;
  readonly gaugeConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    gaugeText: { type: "string", maxLength: 8192, minLength: 1 },
    gaugeConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "gaugeText", "gaugeConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit needle gauge wording and convention without converting gauges or selecting equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, gaugeText, gaugeConvention } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(gaugeText.length > 0, "gaugeText");
    H.domain(gaugeConvention.length > 0, "gaugeConvention");
    return { token: JSON.stringify([recordId, gaugeText, gaugeConvention]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "N17",
    gaugeText: "0.25 mm",
    gaugeConvention: "diameter label",
  },
  output: { token: '["N17","0.25 mm","diameter label"]' },
} satisfies ToolExample<Input, Output>;
export const acupunctureNeedleGaugeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupuncture-needle-gauge-label",
    title: "Acupuncture Needle Gauge Label",
    description:
      "Preserve explicit needle gauge wording and convention without converting gauges or selecting equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        gaugeText: { type: "string", maxLength: 8192, minLength: 1 },
        gaugeConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "gaugeText", "gaugeConvention"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gaugeText",
          label: "Gauge Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gaugeConvention",
          label: "Gauge Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = acupunctureNeedleGaugeLabelTool.execute;
export default acupunctureNeedleGaugeLabelTool;
