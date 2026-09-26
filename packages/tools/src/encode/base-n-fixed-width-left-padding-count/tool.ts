import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly encoded: string;
  readonly width: number;
  readonly zeroSymbol: string;
};
export type Output = { readonly padded: string; readonly added: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encoded: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 0, maximum: 256 },
    zeroSymbol: { type: "string", maxLength: 8192 },
  },
  required: ["encoded", "width", "zeroSymbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    padded: { type: "string", maxLength: 8192 },
    added: { type: "integer" },
  },
  required: ["padded", "added"],
} as const;
/** Compute base n fixed width left padding count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { encoded, width, zeroSymbol } = input;
  const compute = (): Output => {
    integer(width, 0, 256);
    domain([...zeroSymbol].length === 1 && [...encoded].length <= width);
    const added = width - [...encoded].length;
    return { padded: zeroSymbol.repeat(added) + encoded, added };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { encoded: "abc", width: 5, zeroSymbol: "0" },
  output: { padded: "00abc", added: 2 },
} satisfies ToolExample<Input, Output>;
export const baseNFixedWidthLeftPaddingCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/base-n-fixed-width-left-padding-count",
  title: "Base N Fixed Width Left Padding Count Tool",
  description:
    "Compute base n fixed width left padding count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "encoded",
        label: "Encoded",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "zeroSymbol",
        label: "Zero Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "padded", label: "Padded", valueType: { type: "string" } },
      { id: "added", label: "Added", valueType: { type: "integer" } },
    ],
  },
});
export const run = baseNFixedWidthLeftPaddingCountTool.execute;
export default baseNFixedWidthLeftPaddingCountTool;
