import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resolutionId: string;
  readonly amendmentText: string;
  readonly sourceEdition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolutionId: { type: "string", maxLength: 8192, minLength: 1 },
    amendmentText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resolutionId", "amendmentText", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit resolution amendment label by source edition without interpreting its legal effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resolutionId, amendmentText, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(resolutionId.length > 0, "resolutionId");
    H.domain(amendmentText.length > 0, "amendmentText");
    H.domain(sourceEdition.length > 0, "sourceEdition");
    return {
      token: JSON.stringify([resolutionId, amendmentText, sourceEdition]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resolutionId: "RES17", amendmentText: "A2", sourceEdition: "v2" },
  output: { token: '["RES17","A2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const internationalResolutionAmendmentSuffixTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/international-resolution-amendment-suffix",
      title: "International Resolution Amendment Suffix",
      description:
        "Qualify an explicit resolution amendment label by source edition without interpreting its legal effect.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resolutionId: { type: "string", maxLength: 8192, minLength: 1 },
          amendmentText: { type: "string", maxLength: 8192, minLength: 1 },
          sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["resolutionId", "amendmentText", "sourceEdition"],
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
            id: "resolutionId",
            label: "Resolution Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "amendmentText",
            label: "Amendment Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceEdition",
            label: "Source Edition",
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
export const run = internationalResolutionAmendmentSuffixTool.execute;
export default internationalResolutionAmendmentSuffixTool;
