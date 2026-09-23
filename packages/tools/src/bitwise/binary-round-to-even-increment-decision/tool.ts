import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leastSignificant: boolean;
  readonly guard: boolean;
  readonly round: boolean;
  readonly sticky: boolean;
};
export type Output = { readonly increment: boolean; readonly tie: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leastSignificant: { type: "boolean" },
    guard: { type: "boolean" },
    round: { type: "boolean" },
    sticky: { type: "boolean" },
  },
  required: ["leastSignificant", "guard", "round", "sticky"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "boolean" }, tie: { type: "boolean" } },
  required: ["increment", "tie"],
} as const;
/** Compute binary round to even increment decision from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leastSignificant, guard, round, sticky } = input;
  const compute = (): Output => {
    return {
      increment: guard && (round || sticky || leastSignificant),
      tie: guard && !round && !sticky,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leastSignificant: true, guard: true, round: false, sticky: false },
  output: { increment: true, tie: true },
} satisfies ToolExample<Input, Output>;
export const binaryRoundToEvenIncrementDecisionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/binary-round-to-even-increment-decision",
  title: "Binary Round To Even Increment Decision Tool",
  description:
    "Compute binary round to even increment decision from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leastSignificant",
        label: "Least Significant",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "guard",
        label: "Guard",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "round",
        label: "Round",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "sticky",
        label: "Sticky",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "increment", label: "Increment", valueType: { type: "boolean" } },
      { id: "tie", label: "Tie", valueType: { type: "boolean" } },
    ],
  },
});
export const run = binaryRoundToEvenIncrementDecisionTool.execute;
export default binaryRoundToEvenIncrementDecisionTool;
