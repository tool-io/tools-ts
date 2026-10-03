import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly width: number };
export type Output = {
  readonly sequence: number;
  readonly padded: string;
  readonly widthMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["token", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: { type: "integer" },
    padded: { type: "string", maxLength: 8192 },
    widthMatches: { type: "boolean" },
  },
  required: ["sequence", "padded", "widthMatches"],
} as const;
/** Audit a supplied decimal submission sequence and explicit padding width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    H.domain(/^\d+(?![\s\S])/.test(token), "token");
    const sequence = Number(token);
    H.integer(sequence, 0);
    H.domain(String(sequence).length <= width, "width");
    return {
      sequence,
      padded: String(sequence).padStart(width, "0"),
      widthMatches: token.length === width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "0012", width: 4 },
  output: { sequence: 12, padded: "0012", widthMatches: true },
} satisfies ToolExample<Input, Output>;
export const submissionSequenceLeadingZeroWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/submission-sequence-leading-zero-width",
    title: "Submission Sequence Leading Zero Width Tool",
    description:
      "Audit a supplied decimal submission sequence and explicit padding width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        width: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["token", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sequence: { type: "integer" },
        padded: { type: "string", maxLength: 8192 },
        widthMatches: { type: "boolean" },
      },
      required: ["sequence", "padded", "widthMatches"],
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
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "sequence", label: "Sequence", valueType: { type: "integer" } },
        { id: "padded", label: "Padded", valueType: { type: "string" } },
        {
          id: "widthMatches",
          label: "Width Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = submissionSequenceLeadingZeroWidthTool.execute;
export default submissionSequenceLeadingZeroWidthTool;
