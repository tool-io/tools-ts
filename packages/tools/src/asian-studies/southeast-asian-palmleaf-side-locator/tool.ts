import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manuscriptId: string;
  readonly leafNumberText: string;
  readonly sideText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
    leafNumberText: { type: "string", maxLength: 8192, minLength: 1 },
    sideText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manuscriptId", "leafNumberText", "sideText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit palm-leaf manuscript leaf-side locator without interpreting foliation conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manuscriptId, leafNumberText, sideText } = request;
  const compute = (): Output => {
    H.domain(manuscriptId.length > 0, "manuscriptId");
    H.domain(leafNumberText.length > 0, "leafNumberText");
    H.domain(sideText.length > 0, "sideText");
    return { token: JSON.stringify([manuscriptId, leafNumberText, sideText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { manuscriptId: "MS17", leafNumberText: "042", sideText: "recto" },
  output: { token: '["MS17","042","recto"]' },
} satisfies ToolExample<Input, Output>;
export const southeastasianPalmleafSideLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/southeast-asian-palmleaf-side-locator",
    title: "Southeast Asian Palm Leaf Side Locator",
    description:
      "Preserve an explicit palm-leaf manuscript leaf-side locator without interpreting foliation conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manuscriptId: { type: "string", maxLength: 8192, minLength: 1 },
        leafNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        sideText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["manuscriptId", "leafNumberText", "sideText"],
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
          id: "manuscriptId",
          label: "Manuscript Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leafNumberText",
          label: "Leaf Number Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sideText",
          label: "Side Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = southeastasianPalmleafSideLocatorTool.execute;
export default southeastasianPalmleafSideLocatorTool;
