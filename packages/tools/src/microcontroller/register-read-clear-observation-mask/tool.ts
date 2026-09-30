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
  readonly before: string;
  readonly clearMask: string;
  readonly width: number;
};
export type Output = { readonly observed: string; readonly after: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "string", maxLength: 8192 },
    clearMask: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["before", "clearMask", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "string", maxLength: 8192 },
    after: { type: "string", maxLength: 8192 },
  },
  required: ["observed", "after"],
} as const;
/** Compute register read clear observation mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { before, clearMask, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const a = decimal(before),
      b = decimal(clearMask),
      max = (1n << BigInt(width)) - 1n;
    domain(a >= 0n && b >= 0n && a <= max && b <= max);
    return { observed: a.toString(), after: (a & ~b & max).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { before: "15", clearMask: "5", width: 8 },
  output: { observed: "15", after: "10" },
} satisfies ToolExample<Input, Output>;
export const registerReadClearObservationMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/register-read-clear-observation-mask",
  title: "Register Read Clear Observation Mask Tool",
  description:
    "Compute register read clear observation mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "before",
        label: "Before",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "clearMask",
        label: "Clear Mask",
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
      { id: "observed", label: "Observed", valueType: { type: "string" } },
      { id: "after", label: "After", valueType: { type: "string" } },
    ],
  },
});
export const run = registerReadClearObservationMaskTool.execute;
export default registerReadClearObservationMaskTool;
