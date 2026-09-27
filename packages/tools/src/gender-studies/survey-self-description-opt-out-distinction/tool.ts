import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly optOutToken: string;
  readonly missingToken: string;
};
export type Output = {
  readonly status: string;
  readonly retainedResponse: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    optOutToken: { type: "string", maxLength: 8192 },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["response", "optOutToken", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", maxLength: 8192 },
    retainedResponse: { type: "string", maxLength: 8192 },
  },
  required: ["status", "retainedResponse"],
} as const;
/** Preserve self-description while distinguishing caller-defined opt-out and missing tokens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, optOutToken, missingToken } = request;
  const compute = (): Output => {
    H.domain(optOutToken !== missingToken);
    const status =
      response === optOutToken
        ? "opted-out"
        : response === missingToken
          ? "missing"
          : "self-described";
    return {
      status,
      retainedResponse: status === "self-described" ? response : "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    response: "prefer not to say",
    optOutToken: "prefer not to say",
    missingToken: "",
  },
  output: { status: "opted-out", retainedResponse: "" },
} satisfies ToolExample<Input, Output>;
export const surveySelfDescriptionOptOutDistinctionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gender-studies/survey-self-description-opt-out-distinction",
      title: "Survey Self Description Opt Out Distinction Tool",
      description:
        "Preserve self-description while distinguishing caller-defined opt-out and missing tokens.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          response: { type: "string", maxLength: 8192 },
          optOutToken: { type: "string", maxLength: 8192 },
          missingToken: { type: "string", maxLength: 8192 },
        },
        required: ["response", "optOutToken", "missingToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: { type: "string", maxLength: 8192 },
          retainedResponse: { type: "string", maxLength: 8192 },
        },
        required: ["status", "retainedResponse"],
      },
      ports: {
        inputs: [
          {
            id: "response",
            label: "Response",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "optOutToken",
            label: "Opt Out Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "missingToken",
            label: "Missing Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "status", label: "Status", valueType: { type: "string" } },
          {
            id: "retainedResponse",
            label: "Retained Response",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = surveySelfDescriptionOptOutDistinctionTool.execute;
export default surveySelfDescriptionOptOutDistinctionTool;
