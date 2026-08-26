import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsularDatingYearExtractorInput = {
  readonly text: string;
};

export type ConsularDatingYearExtractorOutput = {
  readonly hasConsularMark: boolean;
  readonly markForm: string;
  readonly consulCount: number;
  readonly consuls: readonly string[];
};

export const calculateConsularDatingYearExtractor = (
  input: ConsularDatingYearExtractorInput,
): ConsularDatingYearExtractorOutput => {
  if (!input.text.trim())
    return simpleError("text", "Formula text is required.", "invalid_text");
  const match = /\bCOS\b\.?/i.exec(input.text);
  if (!match)
    return {
      hasConsularMark: false,
      markForm: "",
      consulCount: 0,
      consuls: [],
    };
  const prefix = input.text.slice(0, match.index);
  const consuls = prefix
    .split(/\bET\b/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return {
    hasConsularMark: true,
    markForm: match[0],
    consulCount: consuls.length,
    consuls,
  };
};

export const consularDatingYearExtractorExample = {
  input: { text: "M·TVLLIO·CICERONI ET C·ANTONIO COS." },
  output: {
    hasConsularMark: true,
    markForm: "COS.",
    consulCount: 2,
    consuls: ["M·TVLLIO·CICERONI", "C·ANTONIO"],
  },
} satisfies ToolExample<
  ConsularDatingYearExtractorInput,
  ConsularDatingYearExtractorOutput
>;

export const consularDatingYearExtractorTool = createSimpleTool({
  id: "epigraphy/consular-dating-year-extractor",
  title: "Consular Dating Formula Name Extractor",
  description:
    "Extract the consul names preceding the eponymous COS mark in a Latin consular dating formula, splitting the nominative/dative pair on the conjunction ET.",
  inputs: [
    {
      description: "Consular dating formula text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "True when a COS dating mark is present.",
      id: "hasConsularMark",
      kind: "boolean",
      label: "Has mark",
    },
    {
      description: "Matched mark form as written (e.g., COS., cos).",
      id: "markForm",
      kind: "string",
      label: "Mark form",
    },
    {
      description: "Number of consul names extracted.",
      id: "consulCount",
      kind: "integer",
      label: "Consul count",
    },
    {
      description: "Consul name strings before the mark.",
      id: "consuls",
      kind: "stringList",
      label: "Consuls",
    },
  ],
  calculate: (input) =>
    calculateConsularDatingYearExtractor(
      input as unknown as ConsularDatingYearExtractorInput,
    ),
});

export const runConsularDatingYearExtractor =
  consularDatingYearExtractorTool.execute;
export default consularDatingYearExtractorTool;
