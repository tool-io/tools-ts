import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly parameter: string };
export type Output = { readonly filename: string; readonly quoted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "string", maxLength: 8192 } },
  required: ["parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filename: { type: "string", maxLength: 8192 },
    quoted: { type: "boolean" },
  },
  required: ["filename", "quoted"],
} as const;
/** Compute http contentdisposition filename parameter from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { parameter } = input;
  const compute = (): Output => {
    const m =
      /^filename=(?:"((?:[^"\\\r\n]|\\[\x20-\x7e])*)"|([!#$%&\x27*+.^_`|~0-9A-Za-z-]+))(?![\s\S])/i.exec(
        parameter,
      );
    domain(m);
    return {
      filename: m[1] !== undefined ? m[1].replace(/\\(.)/g, "$1") : m[2],
      quoted: m[1] !== undefined,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 'filename="report 1.txt"' },
  output: { filename: "report 1.txt", quoted: true },
} satisfies ToolExample<Input, Output>;
export const httpContentdispositionFilenameParameterTool =
  defineSchemaCalculation<Input, Output>({
    id: "parse/http-contentdisposition-filename-parameter",
    title: "HTTP Contentdisposition Filename Parameter Tool",
    description:
      "Compute http contentdisposition filename parameter from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "parameter",
          label: "Parameter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "filename", label: "Filename", valueType: { type: "string" } },
        { id: "quoted", label: "Quoted", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = httpContentdispositionFilenameParameterTool.execute;
export default httpContentdispositionFilenameParameterTool;
