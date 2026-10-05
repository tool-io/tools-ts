import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly preferredAttribution: string;
  readonly publicCreditAllowed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192 },
    preferredAttribution: { type: "string", maxLength: 8192 },
    publicCreditAllowed: { type: "boolean" },
  },
  required: ["recordingId", "preferredAttribution", "publicCreditAllowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render a public recording attribution according to an explicit permission flag without exposing a withheld credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, preferredAttribution, publicCreditAllowed } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(
      !publicCreditAllowed || preferredAttribution.length > 0,
      "publicCreditAllowed",
    );
    return {
      label:
        recordingId +
        " — " +
        (publicCreditAllowed ? preferredAttribution : "attribution withheld"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "REC17",
    preferredAttribution: "Approved speaker credit",
    publicCreditAllowed: true,
  },
  output: { label: "REC17 — Approved speaker credit" },
} satisfies ToolExample<Input, Output>;
export const publicRecordingSpeakerAttributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/public-recording-speaker-attribution",
    title: "Public Recording Speaker Attribution Tool",
    description:
      "Render a public recording attribution according to an explicit permission flag without exposing a withheld credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingId: { type: "string", maxLength: 8192 },
        preferredAttribution: { type: "string", maxLength: 8192 },
        publicCreditAllowed: { type: "boolean" },
      },
      required: ["recordingId", "preferredAttribution", "publicCreditAllowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordingId",
          label: "Recording Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preferredAttribution",
          label: "Preferred Attribution",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicCreditAllowed",
          label: "Public Credit Allowed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicRecordingSpeakerAttributionTool.execute;
export default publicRecordingSpeakerAttributionTool;
