import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = {
  readonly lowerRoot: string;
  readonly lowerGap: string;
  readonly upperGap: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerRoot: { type: "string", maxLength: 8192 },
    lowerGap: { type: "string", maxLength: 8192 },
    upperGap: { type: "string", maxLength: 8192 },
  },
  required: ["lowerRoot", "lowerGap", "upperGap"],
} as const;
/** Compute integer square neighbor gap pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const n = decimal(value);
    domain(n >= 0n);
    let lo = 0n,
      hi = n + 1n;
    while (hi - lo > 1n) {
      const mid = (lo + hi) / 2n;
      if (mid * mid <= n) lo = mid;
      else hi = mid;
    }
    return {
      lowerRoot: lo.toString(),
      lowerGap: (n - lo * lo).toString(),
      upperGap: ((lo + 1n) ** 2n - n).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "10" },
  output: { lowerRoot: "3", lowerGap: "1", upperGap: "6" },
} satisfies ToolExample<Input, Output>;
export const integerSquareNeighborGapPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/integer-square-neighbor-gap-pair",
  title: "Integer Square Neighbor Gap Pair Tool",
  description:
    "Compute integer square neighbor gap pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "lowerRoot", label: "Lower Root", valueType: { type: "string" } },
      { id: "lowerGap", label: "Lower Gap", valueType: { type: "string" } },
      { id: "upperGap", label: "Upper Gap", valueType: { type: "string" } },
    ],
  },
});
export const run = integerSquareNeighborGapPairTool.execute;
export default integerSquareNeighborGapPairTool;
