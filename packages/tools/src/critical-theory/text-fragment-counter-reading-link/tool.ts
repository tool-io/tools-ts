import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fragmentId: string;
  readonly readingId: string;
  readonly relationCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fragmentId: { type: "string", maxLength: 8192, minLength: 1 },
    readingId: { type: "string", maxLength: 8192, minLength: 1 },
    relationCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fragmentId", "readingId", "relationCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link a supplied text fragment to an explicit reading identifier and relation code without evaluating interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fragmentId, readingId, relationCode } = request;
  const compute = (): Output => {
    H.domain(fragmentId.length > 0, "fragmentId");
    H.domain(readingId.length > 0, "readingId");
    H.domain(relationCode.length > 0, "relationCode");
    return { token: JSON.stringify([fragmentId, readingId, relationCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fragmentId: "F17",
    readingId: "R4",
    relationCode: "counter-reading",
  },
  output: { token: '["F17","R4","counter-reading"]' },
} satisfies ToolExample<Input, Output>;
export const textFragmentCounterReadingLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/text-fragment-counter-reading-link",
    title: "Text Fragment Counter Reading Link",
    description:
      "Link a supplied text fragment to an explicit reading identifier and relation code without evaluating interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fragmentId: { type: "string", maxLength: 8192, minLength: 1 },
        readingId: { type: "string", maxLength: 8192, minLength: 1 },
        relationCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fragmentId", "readingId", "relationCode"],
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
          id: "fragmentId",
          label: "Fragment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "readingId",
          label: "Reading Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relationCode",
          label: "Relation Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = textFragmentCounterReadingLinkTool.execute;
export default textFragmentCounterReadingLinkTool;
