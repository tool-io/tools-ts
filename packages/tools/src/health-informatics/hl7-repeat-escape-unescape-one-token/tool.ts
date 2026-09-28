import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly fieldSeparator: string;
  readonly componentSeparator: string;
  readonly repetitionSeparator: string;
  readonly escapeCharacter: string;
  readonly subcomponentSeparator: string;
};
export type Output = { readonly decoded: string; readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    fieldSeparator: { type: "string", maxLength: 8192 },
    componentSeparator: { type: "string", maxLength: 8192 },
    repetitionSeparator: { type: "string", maxLength: 8192 },
    escapeCharacter: { type: "string", maxLength: 8192 },
    subcomponentSeparator: { type: "string", maxLength: 8192 },
  },
  required: [
    "token",
    "fieldSeparator",
    "componentSeparator",
    "repetitionSeparator",
    "escapeCharacter",
    "subcomponentSeparator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decoded: { type: "string", maxLength: 8192 },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["decoded", "kind"],
} as const;
/** Decode one HL7 v2 named delimiter escape using explicit distinct delimiters; hex, formatting and local escapes are outside this token operation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    token,
    fieldSeparator,
    componentSeparator,
    repetitionSeparator,
    escapeCharacter,
    subcomponentSeparator,
  } = request;
  const compute = (): Output => {
    const chars = [
      fieldSeparator,
      componentSeparator,
      repetitionSeparator,
      escapeCharacter,
      subcomponentSeparator,
    ];
    H.domain(chars.every((x) => x.length === 1) && new Set(chars).size === 5);
    H.domain(
      token.length === 3 &&
        token[0] === escapeCharacter &&
        token[2] === escapeCharacter,
    );
    const index = "FSRTE".indexOf(token[1]);
    H.domain(index >= 0);
    return {
      decoded: [
        fieldSeparator,
        componentSeparator,
        repetitionSeparator,
        subcomponentSeparator,
        escapeCharacter,
      ][index],
      kind: ["field", "component", "repetition", "subcomponent", "escape"][
        index
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "\\R\\",
    fieldSeparator: "|",
    componentSeparator: "^",
    repetitionSeparator: "~",
    escapeCharacter: "\\",
    subcomponentSeparator: "&",
  },
  output: { decoded: "~", kind: "repetition" },
} satisfies ToolExample<Input, Output>;
export const hl7RepeatEscapeUnescapeOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/hl7-repeat-escape-unescape-one-token",
    title: "HL7 Repeat Escape Unescape One Token Tool",
    description:
      "Decode one HL7 v2 named delimiter escape using explicit distinct delimiters; hex, formatting and local escapes are outside this token operation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        fieldSeparator: { type: "string", maxLength: 8192 },
        componentSeparator: { type: "string", maxLength: 8192 },
        repetitionSeparator: { type: "string", maxLength: 8192 },
        escapeCharacter: { type: "string", maxLength: 8192 },
        subcomponentSeparator: { type: "string", maxLength: 8192 },
      },
      required: [
        "token",
        "fieldSeparator",
        "componentSeparator",
        "repetitionSeparator",
        "escapeCharacter",
        "subcomponentSeparator",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decoded: { type: "string", maxLength: 8192 },
        kind: { type: "string", maxLength: 8192 },
      },
      required: ["decoded", "kind"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldSeparator",
          label: "Field Separator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentSeparator",
          label: "Component Separator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repetitionSeparator",
          label: "Repetition Separator",
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
          id: "subcomponentSeparator",
          label: "Subcomponent Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "decoded", label: "Decoded", valueType: { type: "string" } },
        { id: "kind", label: "Kind", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = hl7RepeatEscapeUnescapeOneTokenTool.execute;
export default hl7RepeatEscapeUnescapeOneTokenTool;
