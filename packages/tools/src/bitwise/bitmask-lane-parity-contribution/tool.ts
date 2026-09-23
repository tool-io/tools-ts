import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly word: string; readonly laneMask: string };
export type Output = { readonly odd: boolean; readonly selected: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    laneMask: { type: "string", maxLength: 8192 },
  },
  required: ["word", "laneMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    odd: { type: "boolean" },
    selected: { type: "string", maxLength: 8192 },
  },
  required: ["odd", "selected"],
} as const;
/** Compute bitmask lane parity contribution from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, laneMask } = input;
  const compute = (): Output => {
    const w = decimal(word),
      mask = decimal(laneMask);
    domain(w >= 0n && mask >= 0n && w < 1n << 128n && mask < 1n << 128n);
    const selected = w & mask;
    return {
      odd: [...selected.toString(2)].filter((x) => x === "1").length % 2 === 1,
      selected: selected.toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "15", laneMask: "7" },
  output: { odd: true, selected: "7" },
} satisfies ToolExample<Input, Output>;
export const bitmaskLaneParityContributionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitmask-lane-parity-contribution",
  title: "Bitmask Lane Parity Contribution Tool",
  description:
    "Compute bitmask lane parity contribution from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "word",
        label: "Word",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "laneMask",
        label: "Lane Mask",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "odd", label: "Odd", valueType: { type: "boolean" } },
      { id: "selected", label: "Selected", valueType: { type: "string" } },
    ],
  },
});
export const run = bitmaskLaneParityContributionTool.execute;
export default bitmaskLaneParityContributionTool;
