import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly term: string; readonly gloss: string };
export type Output = {
  readonly termCodePoints: number;
  readonly glossCodePoints: number;
  readonly expansion: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    gloss: { type: "string", maxLength: 8192 },
  },
  required: ["term", "gloss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    termCodePoints: { type: "integer" },
    glossCodePoints: { type: "integer" },
    expansion: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["termCodePoints", "glossCodePoints", "expansion", "defined"],
} as const;
/** Calculate cultural term gloss length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, gloss } = request;
  const compute = (): Output => {
    return {
      termCodePoints: [...term].length,
      glossCodePoints: [...gloss].length,
      expansion: term.length > 0 ? [...gloss].length / [...term].length : 0,
      defined: term.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { term: "ab", gloss: "four" },
  output: {
    termCodePoints: 2,
    glossCodePoints: 4,
    expansion: 2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const culturalTermGlossLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-term-gloss-length",
    title: "Cultural Term Gloss Length Tool",
    description:
      "Calculate cultural term gloss length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        gloss: { type: "string", maxLength: 8192 },
      },
      required: ["term", "gloss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        termCodePoints: { type: "integer" },
        glossCodePoints: { type: "integer" },
        expansion: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["termCodePoints", "glossCodePoints", "expansion", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gloss",
          label: "Gloss",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "termCodePoints",
          label: "Term Code Points",
          valueType: { type: "integer" },
        },
        {
          id: "glossCodePoints",
          label: "Gloss Code Points",
          valueType: { type: "integer" },
        },
        { id: "expansion", label: "Expansion", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = culturalTermGlossLengthTool.execute;
export default culturalTermGlossLengthTool;
