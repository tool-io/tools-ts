import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly title: string;
  readonly nonfilingCharacters: number;
};
export type Output = { readonly sortTitle: string; readonly removed: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    nonfilingCharacters: { type: "integer", minimum: 0 },
  },
  required: ["title", "nonfilingCharacters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sortTitle: { type: "string", maxLength: 8192 },
    removed: { type: "string", maxLength: 8192 },
  },
  required: ["sortTitle", "removed"],
} as const;
/** Drop an explicit count of Unicode code points from the start of a catalog title, preserving remaining punctuation and case. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, nonfilingCharacters } = request;
  const compute = (): Output => {
    H.integer(nonfilingCharacters, 0, Array.from(title).length);
    const characters = Array.from(title);
    return {
      sortTitle: characters.slice(nonfilingCharacters).join(""),
      removed: characters.slice(0, nonfilingCharacters).join(""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { title: "The Odyssey", nonfilingCharacters: 4 },
  output: { sortTitle: "Odyssey", removed: "The " },
} satisfies ToolExample<Input, Output>;
export const catalogTitleNonfilingCharacterCutTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/catalog-title-nonfiling-character-cut",
    title: "Catalog Title Nonfiling Character Cut Tool",
    description:
      "Drop an explicit count of Unicode code points from the start of a catalog title, preserving remaining punctuation and case.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        nonfilingCharacters: { type: "integer", minimum: 0 },
      },
      required: ["title", "nonfilingCharacters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sortTitle: { type: "string", maxLength: 8192 },
        removed: { type: "string", maxLength: 8192 },
      },
      required: ["sortTitle", "removed"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nonfilingCharacters",
          label: "Nonfiling Characters",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "sortTitle", label: "Sort Title", valueType: { type: "string" } },
        { id: "removed", label: "Removed", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = catalogTitleNonfilingCharacterCutTool.execute;
export default catalogTitleNonfilingCharacterCutTool;
