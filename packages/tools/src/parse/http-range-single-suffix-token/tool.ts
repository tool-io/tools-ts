import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly length: number; readonly nonzero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" }, nonzero: { type: "boolean" } },
  required: ["length", "nonzero"],
} as const;
/** Calculate http range single suffix token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const r = /^bytes=-(\d+)(?![\s\S])/i.exec(token);
    H.domain(r !== null);
    const length = Number(r[1]);
    H.integer(length, 0);
    return { length, nonzero: length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "bytes=-500" },
  output: { length: 500, nonzero: true },
} satisfies ToolExample<Input, Output>;
export const httpRangeSingleSuffixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/http-range-single-suffix-token",
    title: "HTTP Range Single Suffix Token Tool",
    description:
      "Calculate http range single suffix token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "integer" }, nonzero: { type: "boolean" } },
      required: ["length", "nonzero"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        { id: "nonzero", label: "Nonzero", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = httpRangeSingleSuffixTokenTool.execute;
export default httpRangeSingleSuffixTokenTool;
