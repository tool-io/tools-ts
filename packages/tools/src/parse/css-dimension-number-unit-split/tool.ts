import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  finite,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly number: number; readonly unit: string };
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
    number: { type: "number" },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["number", "unit"],
} as const;
/** Compute css dimension number unit split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m =
      /^([+-]?(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?)([A-Za-z][A-Za-z0-9-]*)(?![\s\S])/.exec(
        token,
      );
    domain(m);
    return { number: finite(Number(m[1])), unit: m[2] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "-1.5em" },
  output: { number: -1.5, unit: "em" },
} satisfies ToolExample<Input, Output>;
export const cssDimensionNumberUnitSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/css-dimension-number-unit-split",
  title: "Css Dimension Number Unit Split Tool",
  description:
    "Compute css dimension number unit split from explicit bounded inputs.",
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
      { id: "number", label: "Number", valueType: { type: "number" } },
      { id: "unit", label: "Unit", valueType: { type: "string" } },
    ],
  },
});
export const run = cssDimensionNumberUnitSplitTool.execute;
export default cssDimensionNumberUnitSplitTool;
