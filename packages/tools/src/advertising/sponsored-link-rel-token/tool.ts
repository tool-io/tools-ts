import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly existingRel: string };
export type Output = { readonly rel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { existingRel: { type: "string", maxLength: 8192 } },
  required: ["existingRel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rel: { type: "string", maxLength: 8192 } },
  required: ["rel"],
} as const;
/** Add sponsored to a whitespace-separated HTML rel token list, deduplicating case-insensitively while preserving first spellings and order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { existingRel } = request;
  const compute = (): Output => {
    const tokens =
      existingRel.trim() === "" ? [] : existingRel.trim().split(/\s+/);
    const seen = new Set<string>();
    const output: string[] = [];
    for (const t of [...tokens, "sponsored"]) {
      const key = t.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        output.push(t);
      }
    }
    return { rel: output.join(" ") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { existingRel: "nofollow external" },
  output: { rel: "nofollow external sponsored" },
} satisfies ToolExample<Input, Output>;
export const sponsoredLinkRelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/sponsored-link-rel-token",
    title: "Sponsored Link Rel Token Tool",
    description:
      "Add sponsored to a whitespace-separated HTML rel token list, deduplicating case-insensitively while preserving first spellings and order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { existingRel: { type: "string", maxLength: 8192 } },
      required: ["existingRel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rel: { type: "string", maxLength: 8192 } },
      required: ["rel"],
    },
    ports: {
      inputs: [
        {
          id: "existingRel",
          label: "Existing Rel",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "rel", label: "Rel", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sponsoredLinkRelTokenTool.execute;
export default sponsoredLinkRelTokenTool;
