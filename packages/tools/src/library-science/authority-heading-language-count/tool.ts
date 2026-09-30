import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headingIds: readonly string[];
  readonly languages: readonly string[];
  readonly selectedHeading: string;
};
export type Output = {
  readonly distinctLanguages: number;
  readonly records: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    languages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedHeading: { type: "string", maxLength: 8192 },
  },
  required: ["headingIds", "languages", "selectedHeading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctLanguages: { type: "integer" },
    records: { type: "integer" },
  },
  required: ["distinctLanguages", "records"],
} as const;
/** Calculate authority heading language count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headingIds, languages, selectedHeading } = request;
  const compute = (): Output => {
    H.sameLength(headingIds, languages);
    return {
      distinctLanguages: new Set(
        languages.filter((x, i) => headingIds[i] === selectedHeading),
      ).size,
      records: headingIds.filter((x) => x === selectedHeading).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    headingIds: ["h1", "h1", "h2"],
    languages: ["en", "fr", "en"],
    selectedHeading: "h1",
  },
  output: { distinctLanguages: 2, records: 2 },
} satisfies ToolExample<Input, Output>;
export const authorityHeadingLanguageCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/authority-heading-language-count",
    title: "Authority Heading Language Count Tool",
    description:
      "Calculate authority heading language count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        languages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedHeading: { type: "string", maxLength: 8192 },
      },
      required: ["headingIds", "languages", "selectedHeading"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctLanguages: { type: "integer" },
        records: { type: "integer" },
      },
      required: ["distinctLanguages", "records"],
    },
    ports: {
      inputs: [
        {
          id: "headingIds",
          label: "Heading Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "languages",
          label: "Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedHeading",
          label: "Selected Heading",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "distinctLanguages",
          label: "Distinct Languages",
          valueType: { type: "integer" },
        },
        { id: "records", label: "Records", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = authorityHeadingLanguageCountTool.execute;
export default authorityHeadingLanguageCountTool;
