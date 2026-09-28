import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentText: string;
  readonly escapeCharacter: string;
  readonly componentSeparator: string;
};
export type Output = {
  readonly unescapedSeparators: number;
  readonly completedEscapes: number;
  readonly unclosedEscape: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentText: { type: "string", maxLength: 8192 },
    escapeCharacter: { type: "string", maxLength: 8192 },
    componentSeparator: { type: "string", maxLength: 8192 },
  },
  required: ["componentText", "escapeCharacter", "componentSeparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unescapedSeparators: { type: "integer" },
    completedEscapes: { type: "integer" },
    unclosedEscape: { type: "boolean" },
  },
  required: ["unescapedSeparators", "completedEscapes", "unclosedEscape"],
} as const;
/** Inspect literal HL7 escape-delimited spans before counting component separators; no escape-content decoding or full message validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentText, escapeCharacter, componentSeparator } = request;
  const compute = (): Output => {
    H.domain(
      escapeCharacter.length === 1 &&
        componentSeparator.length === 1 &&
        escapeCharacter !== componentSeparator,
    );
    let escaped = false,
      completedEscapes = 0,
      unescapedSeparators = 0;
    for (const c of componentText) {
      if (c === escapeCharacter) {
        if (escaped) completedEscapes++;
        escaped = !escaped;
      } else if (c === componentSeparator && !escaped) unescapedSeparators++;
    }
    return { unescapedSeparators, completedEscapes, unclosedEscape: escaped };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentText: "A\\S\\B^C",
    escapeCharacter: "\\",
    componentSeparator: "^",
  },
  output: {
    unescapedSeparators: 1,
    completedEscapes: 1,
    unclosedEscape: false,
  },
} satisfies ToolExample<Input, Output>;
export const hl7ComponentEscapeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/hl7-component-escape-gap",
    title: "HL7 Component Escape Gap Tool",
    description:
      "Inspect literal HL7 escape-delimited spans before counting component separators; no escape-content decoding or full message validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentText: { type: "string", maxLength: 8192 },
        escapeCharacter: { type: "string", maxLength: 8192 },
        componentSeparator: { type: "string", maxLength: 8192 },
      },
      required: ["componentText", "escapeCharacter", "componentSeparator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unescapedSeparators: { type: "integer" },
        completedEscapes: { type: "integer" },
        unclosedEscape: { type: "boolean" },
      },
      required: ["unescapedSeparators", "completedEscapes", "unclosedEscape"],
    },
    ports: {
      inputs: [
        {
          id: "componentText",
          label: "Component Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "escapeCharacter",
          label: "Escape Character",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentSeparator",
          label: "Component Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "unescapedSeparators",
          label: "Unescaped Separators",
          valueType: { type: "integer" },
        },
        {
          id: "completedEscapes",
          label: "Completed Escapes",
          valueType: { type: "integer" },
        },
        {
          id: "unclosedEscape",
          label: "Unclosed Escape",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hl7ComponentEscapeGapTool.execute;
export default hl7ComponentEscapeGapTool;
