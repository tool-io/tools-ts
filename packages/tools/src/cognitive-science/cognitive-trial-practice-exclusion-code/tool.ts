import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly suppliedExclusion: string;
  readonly protocolSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedExclusion: { type: "string", maxLength: 8192, minLength: 1 },
    protocolSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialId", "suppliedExclusion", "protocolSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit trial inclusion code and protocol source without selecting analysis exclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, suppliedExclusion, protocolSource } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(suppliedExclusion.length > 0, "suppliedExclusion");
    H.domain(protocolSource.length > 0, "protocolSource");
    return {
      token: JSON.stringify([trialId, suppliedExclusion, protocolSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialId: "T17",
    suppliedExclusion: "practice",
    protocolSource: "P4",
  },
  output: { token: '["T17","practice","P4"]' },
} satisfies ToolExample<Input, Output>;
export const cognitiveTrialPracticeExclusionCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/cognitive-trial-practice-exclusion-code",
      title: "Cognitive Trial Practice Exclusion Code",
      description:
        "Preserve an explicit trial inclusion code and protocol source without selecting analysis exclusions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trialId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedExclusion: { type: "string", maxLength: 8192, minLength: 1 },
          protocolSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["trialId", "suppliedExclusion", "protocolSource"],
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
            id: "trialId",
            label: "Trial Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedExclusion",
            label: "Supplied Exclusion",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "protocolSource",
            label: "Protocol Source",
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
export const run = cognitiveTrialPracticeExclusionCodeTool.execute;
export default cognitiveTrialPracticeExclusionCodeTool;
