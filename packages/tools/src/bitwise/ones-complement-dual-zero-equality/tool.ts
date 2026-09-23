import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly width: number;
};
export type Output = { readonly equal: boolean; readonly zero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["left", "right", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equal: { type: "boolean" }, zero: { type: "boolean" } },
  required: ["equal", "zero"],
} as const;
/** Compute ones complement dual zero equality from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const a = decimal(left),
      b = decimal(right),
      all = (1n << BigInt(width)) - 1n;
    domain(a >= 0n && a <= all && b >= 0n && b <= all);
    const zero = (a === 0n || a === all) && (b === 0n || b === all);
    return { equal: a === b || zero, zero };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "0", right: "255", width: 8 },
  output: { equal: true, zero: true },
} satisfies ToolExample<Input, Output>;
export const onesComplementDualZeroEqualityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/ones-complement-dual-zero-equality",
  title: "Ones Complement Dual Zero Equality Tool",
  description:
    "Compute ones complement dual zero equality from explicit bounded inputs.",
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
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "equal", label: "Equal", valueType: { type: "boolean" } },
      { id: "zero", label: "Zero", valueType: { type: "boolean" } },
    ],
  },
});
export const run = onesComplementDualZeroEqualityTool.execute;
export default onesComplementDualZeroEqualityTool;
