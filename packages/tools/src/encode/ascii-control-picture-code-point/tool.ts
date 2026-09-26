import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = { readonly point: number; readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 127 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "integer" },
    symbol: { type: "string", maxLength: 8192 },
  },
  required: ["point", "symbol"],
} as const;
/** Compute ascii control picture code point from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    integer(octet, 0, 127);
    domain(octet <= 32 || octet === 127);
    const point = octet === 127 ? 0x2421 : 0x2400 + octet;
    return { point, symbol: String.fromCodePoint(point) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 0 },
  output: { point: 9216, symbol: "␀" },
} satisfies ToolExample<Input, Output>;
export const asciiControlPictureCodePointTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/ascii-control-picture-code-point",
  title: "Ascii Control Picture Code Point Tool",
  description:
    "Compute ascii control picture code point from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "octet",
        label: "Octet",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "point", label: "Point", valueType: { type: "integer" } },
      { id: "symbol", label: "Symbol", valueType: { type: "string" } },
    ],
  },
});
export const run = asciiControlPictureCodePointTool.execute;
export default asciiControlPictureCodePointTool;
