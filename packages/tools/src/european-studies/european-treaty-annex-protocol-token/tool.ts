import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treatyId: string;
  readonly annexText: string;
  readonly protocolText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatyId: { type: "string", maxLength: 8192, minLength: 1 },
    annexText: { type: "string", maxLength: 8192, minLength: 1 },
    protocolText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["treatyId", "annexText", "protocolText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied treaty annex and protocol references without interpreting legal status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { treatyId, annexText, protocolText } = request;
  const compute = (): Output => {
    H.domain(treatyId.length > 0, "treatyId");
    H.domain(annexText.length > 0, "annexText");
    H.domain(protocolText.length > 0, "protocolText");
    return { token: JSON.stringify([treatyId, annexText, protocolText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    treatyId: "TR17",
    annexText: "Annex II",
    protocolText: "Protocol 3",
  },
  output: { token: '["TR17","Annex II","Protocol 3"]' },
} satisfies ToolExample<Input, Output>;
export const europeanTreatyAnnexProtocolTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["european-studies", "european studies", "humanities"],
      keywords: ["european studies", "humanities"],
    },
    id: "european-studies/european-treaty-annex-protocol-token",
    title: "European Treaty Annex Protocol Token",
    description:
      "Pair explicitly supplied treaty annex and protocol references without interpreting legal status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatyId: { type: "string", maxLength: 8192, minLength: 1 },
        annexText: { type: "string", maxLength: 8192, minLength: 1 },
        protocolText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["treatyId", "annexText", "protocolText"],
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
          id: "treatyId",
          label: "Treaty Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annexText",
          label: "Annex Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "protocolText",
          label: "Protocol Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = europeanTreatyAnnexProtocolTokenTool.execute;
export default europeanTreatyAnnexProtocolTokenTool;
