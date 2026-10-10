import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registryBaseUrl: string;
  readonly registrationId: string;
};
export type Output = { readonly url: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registryBaseUrl: { type: "string", maxLength: 8192 },
    registrationId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["registryBaseUrl", "registrationId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { url: { type: "string", maxLength: 8192 } },
  required: ["url"],
} as const;
/** Append a percent-encoded registration identifier to an explicit HTTPS registry base without retrieving or validating a trial record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registryBaseUrl, registrationId } = request;
  const compute = (): Output => {
    H.domain(
      /^https:\/\/[^\s?#]+\/(?![\s\S])/.test(registryBaseUrl),
      "registryBaseUrl",
    );
    H.domain(registrationId.length > 0, "registrationId");
    H.domain(
      !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(
        registrationId,
      ),
      "registrationId",
    );
    return { url: registryBaseUrl + encodeURIComponent(registrationId) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    registryBaseUrl: "https://registry.example/record/",
    registrationId: "TR 17",
  },
  output: { url: "https://registry.example/record/TR%2017" },
} satisfies ToolExample<Input, Output>;
export const naturopathyTrialRegistrationLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["naturopathy", "health and medicine"],
      keywords: ["naturopathy", "health and medicine"],
    },
    id: "naturopathy/naturopathy-trial-registration-link",
    title: "Naturopathy Trial Registration Link",
    description:
      "Append a percent-encoded registration identifier to an explicit HTTPS registry base without retrieving or validating a trial record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registryBaseUrl: { type: "string", maxLength: 8192 },
        registrationId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["registryBaseUrl", "registrationId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { url: { type: "string", maxLength: 8192 } },
      required: ["url"],
    },
    ports: {
      inputs: [
        {
          id: "registryBaseUrl",
          label: "Registry Base Url",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "registrationId",
          label: "Registration Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "url", label: "Url", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = naturopathyTrialRegistrationLinkTool.execute;
export default naturopathyTrialRegistrationLinkTool;
