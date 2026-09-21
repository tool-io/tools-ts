import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly respondentIds: readonly string[];
  readonly feedbackPresent: readonly boolean[];
  readonly consentVerified: readonly boolean[];
  readonly contextRecorded: readonly boolean[];
};
export type Output = {
  readonly respondents: number;
  readonly supportedRespondents: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    respondentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    feedbackPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    consentVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    contextRecorded: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "respondentIds",
    "feedbackPresent",
    "consentVerified",
    "contextRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    respondents: { type: "integer" },
    supportedRespondents: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["respondents", "supportedRespondents", "share", "defined"],
} as const;
/** Calculate farmer feedback support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { respondentIds, feedbackPresent, consentVerified, contextRecorded } =
    request;
  const compute = (): Output => {
    H.sameLength(respondentIds, feedbackPresent);
    H.sameLength(respondentIds, consentVerified);
    H.sameLength(respondentIds, contextRecorded);
    return (() => {
      const a = new Set(respondentIds),
        b = new Set(
          respondentIds.filter(
            (x, i) =>
              feedbackPresent[i] && consentVerified[i] && contextRecorded[i],
          ),
        );
      return {
        respondents: a.size,
        supportedRespondents: b.size,
        share: a.size ? b.size / a.size : 0,
        defined: a.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    respondentIds: ["a", "b"],
    feedbackPresent: [true, true],
    consentVerified: [true, true],
    contextRecorded: [true, false],
  },
  output: {
    respondents: 2,
    supportedRespondents: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const farmerFeedbackSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farmer-feedback-support-share",
    title: "Farmer Feedback Support Share Tool",
    description:
      "Calculate farmer feedback support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        respondentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        feedbackPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        consentVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        contextRecorded: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "respondentIds",
        "feedbackPresent",
        "consentVerified",
        "contextRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        respondents: { type: "integer" },
        supportedRespondents: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["respondents", "supportedRespondents", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "respondentIds",
          label: "Respondent Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "feedbackPresent",
          label: "Feedback Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "consentVerified",
          label: "Consent Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "contextRecorded",
          label: "Context Recorded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "respondents",
          label: "Respondents",
          valueType: { type: "integer" },
        },
        {
          id: "supportedRespondents",
          label: "Supported Respondents",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = farmerFeedbackSupportShareTool.execute;
export default farmerFeedbackSupportShareTool;
