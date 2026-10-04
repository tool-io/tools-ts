import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly header: string };
export type Output = { readonly total: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { header: { type: "string", maxLength: 8192 } },
  required: ["header"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { total: { type: "string", maxLength: 8192 } },
  required: ["total"],
} as const;
/** Compute http content range unsatisfied total from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { header } = input;
  const compute = (): Output => {
    const m = /^bytes \*\/(0|[1-9]\d{0,127})(?![\s\S])/.exec(header);
    domain(m);
    return { total: m[1] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { header: "bytes */123" },
  output: { total: "123" },
} satisfies ToolExample<Input, Output>;
export const httpContentRangeUnsatisfiedTotalTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-content-range-unsatisfied-total",
  title: "HTTP Content Range Unsatisfied Total Tool",
  description:
    "Compute http content range unsatisfied total from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "header",
        label: "Header",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "total", label: "Total", valueType: { type: "string" } }],
  },
});
export const run = httpContentRangeUnsatisfiedTotalTool.execute;
export default httpContentRangeUnsatisfiedTotalTool;
