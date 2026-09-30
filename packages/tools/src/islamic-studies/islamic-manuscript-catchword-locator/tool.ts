import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchword: string;
  readonly nextLeafFirstToken: string;
  readonly foldCase: boolean;
  readonly trimSpaces: boolean;
};
export type Output = {
  readonly matches: boolean;
  readonly normalizedCatchword: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchword: { type: "string", maxLength: 8192 },
    nextLeafFirstToken: { type: "string", maxLength: 8192 },
    foldCase: { type: "boolean" },
    trimSpaces: { type: "boolean" },
  },
  required: ["catchword", "nextLeafFirstToken", "foldCase", "trimSpaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    normalizedCatchword: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "normalizedCatchword"],
} as const;
/** Compare one supplied catchword with an explicitly identified next-leaf first token; no OCR, Arabic normalization or foliation inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchword, nextLeafFirstToken, foldCase, trimSpaces } = request;
  const compute = (): Output => {
    const normalize = (x: string) => {
      const t = trimSpaces ? x.trim() : x;
      return foldCase ? t.toLowerCase() : t;
    };
    const normalizedCatchword = normalize(catchword);
    H.domain(normalizedCatchword.length > 0);
    return {
      matches: normalizedCatchword === normalize(nextLeafFirstToken),
      normalizedCatchword,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    catchword: "كتاب",
    nextLeafFirstToken: "كتاب",
    foldCase: false,
    trimSpaces: false,
  },
  output: { matches: true, normalizedCatchword: "كتاب" },
} satisfies ToolExample<Input, Output>;
export const islamicManuscriptCatchwordLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/islamic-manuscript-catchword-locator",
    title: "Islamic Manuscript Catchword Locator Tool",
    description:
      "Compare one supplied catchword with an explicitly identified next-leaf first token; no OCR, Arabic normalization or foliation inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchword: { type: "string", maxLength: 8192 },
        nextLeafFirstToken: { type: "string", maxLength: 8192 },
        foldCase: { type: "boolean" },
        trimSpaces: { type: "boolean" },
      },
      required: ["catchword", "nextLeafFirstToken", "foldCase", "trimSpaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        normalizedCatchword: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "normalizedCatchword"],
    },
    ports: {
      inputs: [
        {
          id: "catchword",
          label: "Catchword",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextLeafFirstToken",
          label: "Next Leaf First Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "foldCase",
          label: "Fold Case",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "trimSpaces",
          label: "Trim Spaces",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "normalizedCatchword",
          label: "Normalized Catchword",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = islamicManuscriptCatchwordLocatorTool.execute;
export default islamicManuscriptCatchwordLocatorTool;
