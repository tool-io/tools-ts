import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lineNumber: number; readonly breakKind: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineNumber: { type: "integer", minimum: 1 },
    breakKind: {
      type: "string",
      maxLength: 8192,
      enum: ["line", "column", "page"],
    },
  },
  required: ["lineNumber", "breakKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicit manuscript break annotation using a declared local bracketed convention without generating an edition’s full markup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineNumber, breakKind } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(lineNumber) &&
        lineNumber >= 1 &&
        lineNumber <= Number.MAX_SAFE_INTEGER,
      "lineNumber",
    ),
      lineNumber);
    H.domain(["line", "column", "page"].includes(breakKind), "breakKind");
    return { token: "[" + breakKind + " break " + lineNumber + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineNumber: 12, breakKind: "line" },
  output: { token: "[line break 12]" },
} satisfies ToolExample<Input, Output>;
export const manuscriptLineBreakTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/manuscript-line-break-token",
    title: "Manuscript Line Break Token",
    description:
      "Format an explicit manuscript break annotation using a declared local bracketed convention without generating an edition’s full markup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineNumber: { type: "integer", minimum: 1 },
        breakKind: {
          type: "string",
          maxLength: 8192,
          enum: ["line", "column", "page"],
        },
      },
      required: ["lineNumber", "breakKind"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "lineNumber",
          label: "Line Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "breakKind",
          label: "Break Kind",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = manuscriptLineBreakTokenTool.execute;
export default manuscriptLineBreakTokenTool;
