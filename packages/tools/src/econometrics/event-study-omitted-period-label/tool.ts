import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelId: string;
  readonly omittedPeriodText: string;
  readonly referenceConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelId: { type: "string", maxLength: 8192, minLength: 1 },
    omittedPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["modelId", "omittedPeriodText", "referenceConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit event-study omitted period and convention without selecting an identification strategy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelId, omittedPeriodText, referenceConvention } = request;
  const compute = (): Output => {
    H.domain(modelId.length > 0, "modelId");
    H.domain(omittedPeriodText.length > 0, "omittedPeriodText");
    H.domain(referenceConvention.length > 0, "referenceConvention");
    return {
      token: JSON.stringify([modelId, omittedPeriodText, referenceConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    modelId: "M17",
    omittedPeriodText: "-1",
    referenceConvention: "relative event period",
  },
  output: { token: '["M17","-1","relative event period"]' },
} satisfies ToolExample<Input, Output>;
export const eventStudyOmittedPeriodLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/event-study-omitted-period-label",
    title: "Event Study Omitted Period Label Tool",
    description:
      "Record an explicit event-study omitted period and convention without selecting an identification strategy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelId: { type: "string", maxLength: 8192, minLength: 1 },
        omittedPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["modelId", "omittedPeriodText", "referenceConvention"],
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
          id: "modelId",
          label: "Model Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "omittedPeriodText",
          label: "Omitted Period Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceConvention",
          label: "Reference Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = eventStudyOmittedPeriodLabelTool.execute;
export default eventStudyOmittedPeriodLabelTool;
