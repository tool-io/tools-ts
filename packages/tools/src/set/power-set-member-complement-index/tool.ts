import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: string; readonly elements: number };
export type Output = { readonly complementIndex: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "string", maxLength: 8192 },
    elements: { type: "integer", minimum: 0, maximum: 128 },
  },
  required: ["index", "elements"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { complementIndex: { type: "string", maxLength: 8192 } },
  required: ["complementIndex"],
} as const;
/** Calculate power set member complement index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, elements } = request;
  const compute = (): Output => {
    H.integer(elements, 0, 128);
    const n = H.decimal(index),
      mask = (1n << BigInt(elements)) - 1n;
    H.domain(n >= 0n && n <= mask);
    return { complementIndex: String(mask ^ n) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: "5", elements: 4 },
  output: { complementIndex: "10" },
} satisfies ToolExample<Input, Output>;
export const powerSetMemberComplementIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/power-set-member-complement-index",
    title: "Power Set Member Complement Index Tool",
    description:
      "Calculate power set member complement index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "string", maxLength: 8192 },
        elements: { type: "integer", minimum: 0, maximum: 128 },
      },
      required: ["index", "elements"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { complementIndex: { type: "string", maxLength: 8192 } },
      required: ["complementIndex"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elements",
          label: "Elements",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "complementIndex",
          label: "Complement Index",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = powerSetMemberComplementIndexTool.execute;
export default powerSetMemberComplementIndexTool;
