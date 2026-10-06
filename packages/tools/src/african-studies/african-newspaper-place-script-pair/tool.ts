import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issueId: string;
  readonly suppliedPlaceName: string;
  readonly suppliedScriptLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issueId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPlaceName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScriptLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["issueId", "suppliedPlaceName", "suppliedScriptLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit newspaper place-name transcription and script label without identifying a location or translating names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issueId, suppliedPlaceName, suppliedScriptLabel } = request;
  const compute = (): Output => {
    H.domain(issueId.length > 0, "issueId");
    H.domain(suppliedPlaceName.length > 0, "suppliedPlaceName");
    H.domain(suppliedScriptLabel.length > 0, "suppliedScriptLabel");
    return {
      token: JSON.stringify([issueId, suppliedPlaceName, suppliedScriptLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    issueId: "ISS17",
    suppliedPlaceName: "Place A",
    suppliedScriptLabel: "Script A",
  },
  output: { token: '["ISS17","Place A","Script A"]' },
} satisfies ToolExample<Input, Output>;
export const africanNewspaperPlaceScriptPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["african-studies", "african studies", "humanities"],
      keywords: ["african studies", "humanities"],
    },
    id: "african-studies/african-newspaper-place-script-pair",
    title: "African Newspaper Place Script Pair",
    description:
      "Preserve an explicit newspaper place-name transcription and script label without identifying a location or translating names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issueId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPlaceName: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedScriptLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["issueId", "suppliedPlaceName", "suppliedScriptLabel"],
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
          id: "issueId",
          label: "Issue Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPlaceName",
          label: "Supplied Place Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedScriptLabel",
          label: "Supplied Script Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = africanNewspaperPlaceScriptPairTool.execute;
export default africanNewspaperPlaceScriptPairTool;
