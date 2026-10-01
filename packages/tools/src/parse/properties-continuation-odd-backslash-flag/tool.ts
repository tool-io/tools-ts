import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly line: string };
export type Output = {
  readonly backslashes: number;
  readonly continued: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backslashes: { type: "integer" },
    continued: { type: "boolean" },
  },
  required: ["backslashes", "continued"],
} as const;
/** Compute properties continuation odd backslash flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    domain(!/[\r\n]/.test(line));
    const backslashes = (line.match(/\\*(?![\s\S])/) ?? [""])[0].length;
    return { backslashes, continued: backslashes % 2 === 1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "key=value\\" },
  output: { backslashes: 1, continued: true },
} satisfies ToolExample<Input, Output>;
export const propertiesContinuationOddBackslashFlagTool =
  defineSchemaCalculation<Input, Output>({
    id: "parse/properties-continuation-odd-backslash-flag",
    title: "Properties Continuation Odd Backslash Flag Tool",
    description:
      "Compute properties continuation odd backslash flag from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "backslashes",
          label: "Backslashes",
          valueType: { type: "integer" },
        },
        { id: "continued", label: "Continued", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = propertiesContinuationOddBackslashFlagTool.execute;
export default propertiesContinuationOddBackslashFlagTool;
