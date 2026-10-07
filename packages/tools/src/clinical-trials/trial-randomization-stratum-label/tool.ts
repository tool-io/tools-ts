import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly stratumCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    stratumCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialId", "stratumCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit randomization stratum code by source without assigning trial participants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, stratumCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(stratumCode.length > 0, "stratumCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([trialId, stratumCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "TR17", stratumCode: "S2", codeSource: "Protocol v2" },
  output: { token: '["TR17","S2","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const trialRandomizationStratumLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-randomization-stratum-label",
    title: "Trial Randomization Stratum Label",
    description:
      "Qualify an explicit randomization stratum code by source without assigning trial participants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        stratumCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trialId", "stratumCode", "codeSource"],
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
          id: "stratumCode",
          label: "Stratum Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trialRandomizationStratumLabelTool.execute;
export default trialRandomizationStratumLabelTool;
