import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly anchorId: string };
export type Output = { readonly fragment: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { anchorId: { type: "string", maxLength: 8192, minLength: 1 } },
  required: ["anchorId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fragment: { type: "string", maxLength: 8192 } },
  required: ["fragment"],
} as const;
/** Percent-encode a supplied edition anchor of complete Unicode scalar values as a URL fragment without resolving a document or normalizing its identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchorId } = request;
  const compute = (): Output => {
    H.domain(anchorId.length > 0, "anchorId");
    for (const character of anchorId) {
      const point = character.codePointAt(0);
      H.domain(
        point !== undefined && (point < 0xd800 || point > 0xdfff),
        "anchorId",
      );
    }
    return { fragment: "#" + encodeURIComponent(anchorId) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { anchorId: "page 17" },
  output: { fragment: "#page%2017" },
} satisfies ToolExample<Input, Output>;
export const digitalEditionAnchorFragmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/digital-edition-anchor-fragment",
    title: "Digital Edition Anchor Fragment",
    description:
      "Percent-encode a supplied edition anchor of complete Unicode scalar values as a URL fragment without resolving a document or normalizing its identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["anchorId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fragment: { type: "string", maxLength: 8192 } },
      required: ["fragment"],
    },
    ports: {
      inputs: [
        {
          id: "anchorId",
          label: "Anchor Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "fragment", label: "Fragment", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = digitalEditionAnchorFragmentTool.execute;
export default digitalEditionAnchorFragmentTool;
