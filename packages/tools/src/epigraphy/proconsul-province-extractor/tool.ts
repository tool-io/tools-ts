import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProconsulProvinceExtractorInput = {
  readonly text: string;
};

export type ProconsulProvinceExtractorOutput = {
  readonly found: boolean;
  readonly province: string;
};

const PROCONSUL_PROVINCE_PATTERN =
  /\bpro\s?(?:cos\.?|consul(?:e|m|is|ibus)?\.?)\s+(?:in\s+)?(?:provinci(?:am|ae|a)?\s+)?(\p{L}+)\b/iu;

export const calculateProconsulProvinceExtractor = (
  input: ProconsulProvinceExtractorInput,
): ProconsulProvinceExtractorOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const match = PROCONSUL_PROVINCE_PATTERN.exec(input.text);
  if (!match) return { found: false, province: "" };
  return { found: true, province: match[1] };
};

export const proconsulProvinceExtractorExample = {
  input: {
    text: "legati et praefecti missi ad pro consule provinciae Africae",
  },
  output: { found: true, province: "Africae" },
} satisfies ToolExample<
  ProconsulProvinceExtractorInput,
  ProconsulProvinceExtractorOutput
>;

export const proconsulProvinceExtractorTool = createSimpleTool({
  id: "epigraphy/proconsul-province-extractor",
  title: "Proconsul Province Name Association Extractor",
  description:
    "Extracts the province name that follows a proconsul or procos. token, including 'provinciae'-bridged phrases.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Latin inscription or diploma text.",
    },
  ],
  outputs: [
    {
      id: "found",
      kind: "boolean",
      label: "Found",
      description: "Whether a proconsular province association was detected.",
    },
    {
      id: "province",
      kind: "string",
      label: "Province",
      description: "Captured province token, empty when not found.",
    },
  ],
  calculate: (input) =>
    calculateProconsulProvinceExtractor(
      input as unknown as ProconsulProvinceExtractorInput,
    ),
});

export const runProconsulProvinceExtractor =
  proconsulProvinceExtractorTool.execute;
export default proconsulProvinceExtractorTool;
