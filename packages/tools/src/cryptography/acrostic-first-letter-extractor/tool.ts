import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AcrosticFirstLetterExtractorInput = {
  readonly text: string;
};
export type AcrosticFirstLetterExtractorOutput = {
  readonly acrostic: string;
};
export const acrosticFirstLetterExtractorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 100000,
      "description": "Text containing acrostic words"
    }
  },
  "required": [
    "text"
  ]
} as const satisfies ToolJsonSchema;
export const acrosticFirstLetterExtractorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "acrostic": {
      "type": "string",
      "description": "First-letter sequence"
    }
  },
  "required": [
    "acrostic"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects
export const calculateAcrosticFirstLetterExtractor = (rawInput: unknown): ToolResult<AcrosticFirstLetterExtractorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
if (textValue.length > 100000) return issue("text", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: AcrosticFirstLetterExtractorInput = { text: textValue };
  const words = input.text.split(/[\t\n\r\f ]+/).filter((word) => word.length > 0);
  return toolSuccess({ acrostic: words.map((word) => [...word][0] ?? "").join("") });
};
export const example = {
  "input": {
    "text": "Read Every Dawn"
  },
  "output": {
    "acrostic": "RED"
  }
} satisfies ToolExample<AcrosticFirstLetterExtractorInput, AcrosticFirstLetterExtractorOutput>;
export const acrosticFirstLetterExtractorTool = defineTool<AcrosticFirstLetterExtractorInput, AcrosticFirstLetterExtractorOutput>({
  id: "cryptography/acrostic-first-letter-extractor",
  title: "Acrostic First-Letter Extractor",
  description: "Extract the first Unicode code point of each nonempty ASCII-whitespace-delimited word, preserving its case.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: acrosticFirstLetterExtractorInputSchema,
  outputSchema: acrosticFirstLetterExtractorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Text containing acrostic words",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "acrostic",
        "label": "First-letter sequence",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateAcrosticFirstLetterExtractor,
});
export const runAcrosticFirstLetterExtractor = acrosticFirstLetterExtractorTool.execute;
export default acrosticFirstLetterExtractorTool;
