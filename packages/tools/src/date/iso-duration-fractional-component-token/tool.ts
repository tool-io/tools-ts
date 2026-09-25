import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly whole: string;
  readonly fraction: string;
  readonly designator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    whole: { type: "string", maxLength: 8192 },
    fraction: { type: "string", maxLength: 8192 },
    designator: { type: "string", maxLength: 8192 },
  },
  required: ["whole", "fraction", "designator"],
} as const;
/** Compute iso duration fractional component token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^(\d+)(?:[.,](\d+))?([YMWDHS])(?![\s\S])/.exec(token);
    domain(m);
    return { whole: m[1], fraction: m[2] ?? "", designator: m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "12.50S" },
  output: { whole: "12", fraction: "50", designator: "S" },
} satisfies ToolExample<Input, Output>;
export const isoDurationFractionalComponentTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/iso-duration-fractional-component-token",
  title: "ISO Duration Fractional Component Token Tool",
  description:
    "Compute iso duration fractional component token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "whole", label: "Whole", valueType: { type: "string" } },
      { id: "fraction", label: "Fraction", valueType: { type: "string" } },
      { id: "designator", label: "Designator", valueType: { type: "string" } },
    ],
  },
});
export const run = isoDurationFractionalComponentTokenTool.execute;
export default isoDurationFractionalComponentTokenTool;
