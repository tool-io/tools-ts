import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedPassage: string;
  readonly replacementText: string;
  readonly redact: boolean;
};
export type Output = {
  readonly displayText: string;
  readonly redactionApplied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedPassage: { type: "string", maxLength: 8192 },
    replacementText: { type: "string", maxLength: 8192, minLength: 1 },
    redact: { type: "boolean" },
  },
  required: ["suppliedPassage", "replacementText", "redact"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayText: { type: "string", maxLength: 8192 },
    redactionApplied: { type: "boolean" },
  },
  required: ["displayText", "redactionApplied"],
} as const;
/** Select an explicit passage or supplied redaction replacement under a caller flag without deciding publication permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedPassage, replacementText, redact } = request;
  const compute = (): Output => {
    H.domain(replacementText.length > 0, "replacementText");
    return {
      displayText: redact ? replacementText : suppliedPassage,
      redactionApplied: redact,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedPassage: "Passage A",
    replacementText: "[withheld]",
    redact: true,
  },
  output: { displayText: "[withheld]", redactionApplied: true },
} satisfies ToolExample<Input, Output>;
export const latinAmericanOralHistoryRedactionChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "latin-american-studies",
          "latin american studies",
          "humanities",
        ],
        keywords: ["latin american studies", "humanities"],
      },
      id: "latin-american-studies/latin-american-oral-history-redaction-choice",
      title: "Latin American Oral History Redaction Choice",
      description:
        "Select an explicit passage or supplied redaction replacement under a caller flag without deciding publication permission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedPassage: { type: "string", maxLength: 8192 },
          replacementText: { type: "string", maxLength: 8192, minLength: 1 },
          redact: { type: "boolean" },
        },
        required: ["suppliedPassage", "replacementText", "redact"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          displayText: { type: "string", maxLength: 8192 },
          redactionApplied: { type: "boolean" },
        },
        required: ["displayText", "redactionApplied"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedPassage",
            label: "Supplied Passage",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "replacementText",
            label: "Replacement Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "redact",
            label: "Redact",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "displayText",
            label: "Display Text",
            valueType: { type: "string" },
          },
          {
            id: "redactionApplied",
            label: "Redaction Applied",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = latinAmericanOralHistoryRedactionChoiceTool.execute;
export default latinAmericanOralHistoryRedactionChoiceTool;
