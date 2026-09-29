import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly bits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "number" } },
  required: ["bits"],
} as const;
/** Calculate jensen shannon one bin contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    const mean = (first + second) / 2;
    return {
      bits:
        mean === 0
          ? 0
          : (first === 0 ? 0 : 0.5 * first * Math.log2(first / mean)) +
            (second === 0 ? 0 : 0.5 * second * Math.log2(second / mean)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0.5, second: 0 },
  output: { bits: 0.25 },
} satisfies ToolExample<Input, Output>;
export const jensenShannonOneBinContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/jensen-shannon-one-bin-contribution",
    title: "Jensen Shannon One Bin Contribution Tool",
    description:
      "Calculate jensen shannon one bin contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "number" } },
      required: ["bits"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "bits", label: "Bits", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = jensenShannonOneBinContributionTool.execute;
export default jensenShannonOneBinContributionTool;
