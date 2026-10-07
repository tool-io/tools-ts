import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly poemTitle: string;
  readonly stanzaNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poemTitle: { type: "string", maxLength: 8192, minLength: 1 },
    stanzaNumber: { type: "integer", minimum: 1 },
  },
  required: ["poemTitle", "stanzaNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly supplied poem and positive stanza number without resolving edition-specific divisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { poemTitle, stanzaNumber } = request;
  const compute = (): Output => {
    H.domain(poemTitle.length > 0, "poemTitle");
    (H.domain(
      Number.isSafeInteger(stanzaNumber) &&
        stanzaNumber >= 1 &&
        stanzaNumber <= Number.MAX_SAFE_INTEGER,
      "stanzaNumber",
    ),
      stanzaNumber);
    return { label: poemTitle + ", stanza " + stanzaNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { poemTitle: "Poem A", stanzaNumber: 7 },
  output: { label: "Poem A, stanza 7" },
} satisfies ToolExample<Input, Output>;
export const poemStanzaNumberLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/poem-stanza-number-label",
    title: "Poem Stanza Number Label",
    description:
      "Format an explicitly supplied poem and positive stanza number without resolving edition-specific divisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poemTitle: { type: "string", maxLength: 8192, minLength: 1 },
        stanzaNumber: { type: "integer", minimum: 1 },
      },
      required: ["poemTitle", "stanzaNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "poemTitle",
          label: "Poem Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stanzaNumber",
          label: "Stanza Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = poemStanzaNumberLabelTool.execute;
export default poemStanzaNumberLabelTool;
