import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valueText: string;
  readonly commentMarker: string;
  readonly requireWhitespaceBefore: boolean;
};
export type Output = {
  readonly valueBeforeComment: string;
  readonly commentText: string;
  readonly commentFound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueText: { type: "string", maxLength: 8192 },
    commentMarker: { type: "string", maxLength: 8192, minLength: 1 },
    requireWhitespaceBefore: { type: "boolean" },
  },
  required: ["valueText", "commentMarker", "requireWhitespaceBefore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueBeforeComment: { type: "string", maxLength: 8192 },
    commentText: { type: "string", maxLength: 8192 },
    commentFound: { type: "boolean" },
  },
  required: ["valueBeforeComment", "commentText", "commentFound"],
} as const;
/** Split explicit unquoted INI value text at the first caller-defined inline comment marker under an explicit preceding-whitespace policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valueText, commentMarker, requireWhitespaceBefore } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(commentMarker.length > 0, "commentMarker");
      let position = -1;
      for (let i = 0; i <= valueText.length - commentMarker.length; i++) {
        if (
          valueText.startsWith(commentMarker, i) &&
          (!requireWhitespaceBefore ||
            i === 0 ||
            valueText[i - 1] === " " ||
            valueText[i - 1] === "\t")
        ) {
          position = i;
          break;
        }
      }
      return {
        valueBeforeComment:
          position < 0 ? valueText : valueText.slice(0, position),
        commentText:
          position < 0 ? "" : valueText.slice(position + commentMarker.length),
        commentFound: position >= 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    valueText: "red ; note",
    commentMarker: ";",
    requireWhitespaceBefore: true,
  },
  output: {
    valueBeforeComment: "red ",
    commentText: " note",
    commentFound: true,
  },
} satisfies ToolExample<Input, Output>;
export const iniInlineCommentBoundaryPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/ini-inline-comment-boundary-policy",
    title: "Ini Inline Comment Boundary Policy",
    description:
      "Split explicit unquoted INI value text at the first caller-defined inline comment marker under an explicit preceding-whitespace policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valueText: { type: "string", maxLength: 8192 },
        commentMarker: { type: "string", maxLength: 8192, minLength: 1 },
        requireWhitespaceBefore: { type: "boolean" },
      },
      required: ["valueText", "commentMarker", "requireWhitespaceBefore"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valueBeforeComment: { type: "string", maxLength: 8192 },
        commentText: { type: "string", maxLength: 8192 },
        commentFound: { type: "boolean" },
      },
      required: ["valueBeforeComment", "commentText", "commentFound"],
    },
    ports: {
      inputs: [
        {
          id: "valueText",
          label: "Value Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "commentMarker",
          label: "Comment Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requireWhitespaceBefore",
          label: "Require Whitespace Before",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "valueBeforeComment",
          label: "Value Before Comment",
          valueType: { type: "string" },
        },
        {
          id: "commentText",
          label: "Comment Text",
          valueType: { type: "string" },
        },
        {
          id: "commentFound",
          label: "Comment Found",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = iniInlineCommentBoundaryPolicyTool.execute;
export default iniInlineCommentBoundaryPolicyTool;
