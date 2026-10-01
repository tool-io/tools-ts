import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly high: number; readonly low: number };
export type Output = { readonly word: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer", minimum: 0, maximum: 255 },
    low: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["high", "low"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { word: { type: "integer" } },
  required: ["word"],
} as const;
/** Compute ipv4 header checksum word contribution from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { high, low } = input;
  const compute = (): Output => {
    integer(high, 0, 255);
    integer(low, 0, 255);
    return { word: high * 256 + low };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { high: 69, low: 0 },
  output: { word: 17664 },
} satisfies ToolExample<Input, Output>;
export const ipv4HeaderChecksumWordContributionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ipv4-header-checksum-word-contribution",
  title: "IPv4 Header Checksum Word Contribution Tool",
  description:
    "Compute ipv4 header checksum word contribution from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "high",
        label: "High",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "low",
        label: "Low",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "word", label: "Word", valueType: { type: "integer" } }],
  },
});
export const run = ipv4HeaderChecksumWordContributionTool.execute;
export default ipv4HeaderChecksumWordContributionTool;
