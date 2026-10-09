import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentWording: string;
  readonly communitySource: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentWording: { type: "string", maxLength: 8192, minLength: 1 },
    communitySource: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentWording", "communitySource", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify caller-provided instrument wording by a named source without assigning a community-preferred name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentWording, communitySource, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(instrumentWording.length > 0, "instrumentWording");
    H.domain(communitySource.length > 0, "communitySource");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([
        instrumentWording,
        communitySource,
        sourceVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instrumentWording: "Instrument A",
    communitySource: "Public glossary A",
    sourceVersion: "v2",
  },
  output: { token: '["Instrument A","Public glossary A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const instrumentNameCommunitySourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/instrument-name-community-source-key",
    title: "Instrument Name Community Source Key",
    description:
      "Qualify caller-provided instrument wording by a named source without assigning a community-preferred name.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentWording: { type: "string", maxLength: 8192, minLength: 1 },
        communitySource: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["instrumentWording", "communitySource", "sourceVersion"],
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
          id: "instrumentWording",
          label: "Instrument Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "communitySource",
          label: "Community Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = instrumentNameCommunitySourceKeyTool.execute;
export default instrumentNameCommunitySourceKeyTool;
