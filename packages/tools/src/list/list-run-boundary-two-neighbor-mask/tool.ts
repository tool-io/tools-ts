import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly previous: string;
  readonly current: string;
  readonly next: string;
};
export type Output = {
  readonly start: boolean;
  readonly end: boolean;
  readonly singleton: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "string", maxLength: 8192 },
    current: { type: "string", maxLength: 8192 },
    next: { type: "string", maxLength: 8192 },
  },
  required: ["previous", "current", "next"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "boolean" },
    end: { type: "boolean" },
    singleton: { type: "boolean" },
  },
  required: ["start", "end", "singleton"],
} as const;
/** Compute list run boundary two neighbor mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { previous, current, next } = input;
  const compute = (): Output => {
    const start = previous !== current,
      end = current !== next;
    return { start, end, singleton: start && end };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { previous: "a", current: "b", next: "c" },
  output: { start: true, end: true, singleton: true },
} satisfies ToolExample<Input, Output>;
export const listRunBoundaryTwoNeighborMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-run-boundary-two-neighbor-mask",
  title: "List Run Boundary Two Neighbor Mask Tool",
  description:
    "Compute list run boundary two neighbor mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "previous",
        label: "Previous",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "current",
        label: "Current",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "next",
        label: "Next",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "start", label: "Start", valueType: { type: "boolean" } },
      { id: "end", label: "End", valueType: { type: "boolean" } },
      { id: "singleton", label: "Singleton", valueType: { type: "boolean" } },
    ],
  },
});
export const run = listRunBoundaryTwoNeighborMaskTool.execute;
export default listRunBoundaryTwoNeighborMaskTool;
