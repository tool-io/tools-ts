import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdtfQualifierDecoderInput = {
  readonly edtfValue: string;
};

export type EdtfQualifierDecoderOutput = {
  readonly baseValue: string;
  readonly qualifier:
    "none" | "uncertain" | "approximate" | "uncertain-and-approximate";
  readonly meaning: string;
};

const QUALIFIERS = [
  {
    suffix: "%",
    qualifier: "uncertain-and-approximate" as const,
    meaning: "uncertain and approximate",
  },
  {
    suffix: "?",
    qualifier: "uncertain" as const,
    meaning: "uncertain",
  },
  {
    suffix: "~",
    qualifier: "approximate" as const,
    meaning: "approximate",
  },
];

export const calculateEdtfQualifierDecoder = (
  input: EdtfQualifierDecoderInput,
): EdtfQualifierDecoderOutput => {
  const value = input.edtfValue.trim();
  if (value.length === 0)
    simpleError("edtfValue", "EDTF value must not be empty.", "invalid_edtf");
  const match = QUALIFIERS.find((entry) => value.endsWith(entry.suffix));
  if (match === undefined)
    return { baseValue: value, qualifier: "none", meaning: "no qualifier" };
  const baseValue = value.slice(0, -match.suffix.length);
  if (baseValue.length === 0)
    simpleError(
      "edtfValue",
      "Qualifier must follow a date or interval value.",
      "invalid_edtf",
    );
  return { baseValue, qualifier: match.qualifier, meaning: match.meaning };
};

export const edtfQualifierDecoderExample = {
  input: { edtfValue: "1984%" },
  output: {
    baseValue: "1984",
    qualifier: "uncertain-and-approximate",
    meaning: "uncertain and approximate",
  },
} satisfies ToolExample<EdtfQualifierDecoderInput, EdtfQualifierDecoderOutput>;

export const edtfQualifierDecoderTool = createSimpleTool({
  id: "archival-studies/edtf-qualifier-decoder",
  title: "EDTF Uncertain/Approximate Qualifier Decoder",
  description:
    "Split an Extended Date/Time Format value into its base value and trailing uncertainty qualifier (? uncertain, ~ approximate, % both).",
  inputs: [
    {
      description: "EDTF value possibly ending in ?, ~ or %.",
      id: "edtfValue",
      kind: "string",
      label: "EDTF value",
    },
  ],
  outputs: [
    {
      description: "Value with any trailing qualifier removed.",
      id: "baseValue",
      kind: "string",
      label: "Base value",
    },
    {
      description: "Decoded qualifier kind.",
      enum: ["none", "uncertain", "approximate", "uncertain-and-approximate"],
      id: "qualifier",
      kind: "string",
      label: "Qualifier",
    },
    {
      description: "Plain-language meaning of the qualifier.",
      id: "meaning",
      kind: "string",
      label: "Meaning",
    },
  ],
  calculate: (input) =>
    calculateEdtfQualifierDecoder({
      edtfValue: input.edtfValue as string,
    }),
});

export const runEdtfQualifierDecoder = edtfQualifierDecoderTool.execute;
export default edtfQualifierDecoderTool;
