import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number };
export type Output = { readonly escape: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer", minimum: 0, maximum: 31 } },
  required: ["point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escape: { type: "string", maxLength: 8192 } },
  required: ["escape"],
} as const;
/** Compute json string control escape selector from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point } = input;
  const compute = (): Output => {
    integer(point, 0, 31);
    const named: Record<string, string> = {
      8: "\\b",
      9: "\\t",
      10: "\\n",
      12: "\\f",
      13: "\\r",
    };
    return {
      escape: named[point] ?? "\\u" + point.toString(16).padStart(4, "0"),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 10 },
  output: { escape: "\\n" },
} satisfies ToolExample<Input, Output>;
export const jsonStringControlEscapeSelectorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-string-control-escape-selector",
  title: "JSON String Control Escape Selector Tool",
  description:
    "Compute json string control escape selector from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "escape", label: "Escape", valueType: { type: "string" } }],
  },
});
export const run = jsonStringControlEscapeSelectorTool.execute;
export default jsonStringControlEscapeSelectorTool;
