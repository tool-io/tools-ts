import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: string; readonly right: string };
export type Output = {
  readonly sameMethod: boolean;
  readonly differsOnlyByCase: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameMethod: { type: "boolean" },
    differsOnlyByCase: { type: "boolean" },
  },
  required: ["sameMethod", "differsOnlyByCase"],
} as const;
/** Compute http method case sensitivity tag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    domain(
      /^[!#$%&\x27*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(left) &&
        /^[!#$%&\x27*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(right),
    );
    return {
      sameMethod: left === right,
      differsOnlyByCase:
        left !== right && left.toLowerCase() === right.toLowerCase(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "GET", right: "get" },
  output: { sameMethod: false, differsOnlyByCase: true },
} satisfies ToolExample<Input, Output>;
export const httpMethodCaseSensitivityTagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-method-case-sensitivity-tag",
  title: "HTTP Method Case Sensitivity Tag Tool",
  description:
    "Compute http method case sensitivity tag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "sameMethod",
        label: "Same Method",
        valueType: { type: "boolean" },
      },
      {
        id: "differsOnlyByCase",
        label: "Differs Only By Case",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = httpMethodCaseSensitivityTagTool.execute;
export default httpMethodCaseSensitivityTagTool;
