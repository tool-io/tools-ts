import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceText: string;
  readonly start: number;
  readonly end: number;
  readonly codePointOffsets: boolean;
};
export type Output = {
  readonly slice: string;
  readonly length: number;
  readonly utf16Start: number;
  readonly utf16End: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceText: { type: "string", maxLength: 8192 },
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    codePointOffsets: { type: "boolean" },
  },
  required: ["sourceText", "start", "end", "codePointOffsets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slice: { type: "string", maxLength: 8192 },
    length: { type: "integer" },
    utf16Start: { type: "integer" },
    utf16End: { type: "integer" },
  },
  required: ["slice", "length", "utf16Start", "utf16End"],
} as const;
/** Extract a half-open token span with an explicit code-point versus UTF-16 offset domain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceText, start, end, codePointOffsets } = request;
  const compute = (): Output => {
    return (() => {
      const units = codePointOffsets ? [...sourceText] : sourceText.split("");
      H.integer(start, 0, units.length);
      H.integer(end, start, units.length);
      const prefix = units.slice(0, start).join(""),
        slice = units.slice(start, end).join("");
      return {
        slice,
        length: end - start,
        utf16Start: prefix.length,
        utf16End: prefix.length + slice.length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceText: "A😀B", start: 1, end: 2, codePointOffsets: true },
  output: { slice: "😀", length: 1, utf16Start: 1, utf16End: 3 },
} satisfies ToolExample<Input, Output>;
export const tokenOffsetDomainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/token-offset-domain-gap",
    title: "Token Offset Domain Gap Tool",
    description:
      "Extract a half-open token span with an explicit code-point versus UTF-16 offset domain.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceText: { type: "string", maxLength: 8192 },
        start: { type: "integer", minimum: 0 },
        end: { type: "integer" },
        codePointOffsets: { type: "boolean" },
      },
      required: ["sourceText", "start", "end", "codePointOffsets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slice: { type: "string", maxLength: 8192 },
        length: { type: "integer" },
        utf16Start: { type: "integer" },
        utf16End: { type: "integer" },
      },
      required: ["slice", "length", "utf16Start", "utf16End"],
    },
    ports: {
      inputs: [
        {
          id: "sourceText",
          label: "Source Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "codePointOffsets",
          label: "Code Point Offsets",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "slice", label: "Slice", valueType: { type: "string" } },
        { id: "length", label: "Length", valueType: { type: "integer" } },
        {
          id: "utf16Start",
          label: "Utf16Start",
          valueType: { type: "integer" },
        },
        { id: "utf16End", label: "Utf16End", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tokenOffsetDomainGapTool.execute;
export default tokenOffsetDomainGapTool;
