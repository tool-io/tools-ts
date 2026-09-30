import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priority: number;
  readonly implementedBits: number;
  readonly preemptionBits: number;
};
export type Output = {
  readonly preemption: number;
  readonly subpriority: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priority: { type: "integer", minimum: 0 },
    implementedBits: { type: "integer", minimum: 1, maximum: 8 },
    preemptionBits: { type: "integer", minimum: 0 },
  },
  required: ["priority", "implementedBits", "preemptionBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preemption: { type: "integer" },
    subpriority: { type: "integer" },
  },
  required: ["preemption", "subpriority"],
} as const;
/** Calculate interrupt priority preemption bit split from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { priority, implementedBits, preemptionBits } = input;
  const compute = (): Output => {
    H.integer(implementedBits, 1, 8);
    H.integer(preemptionBits, 0, implementedBits);
    H.integer(priority, 0, 2 ** implementedBits - 1);
    const subBits = implementedBits - preemptionBits;
    return {
      preemption: Math.floor(priority / 2 ** subBits),
      subpriority: priority % 2 ** subBits,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { priority: 13, implementedBits: 4, preemptionBits: 2 },
  output: { preemption: 3, subpriority: 1 },
} satisfies ToolExample<Input, Output>;
export const interruptPriorityPreemptionBitSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microcontroller/interrupt-priority-preemption-bit-split",
      title: "Interrupt Priority Preemption Bit Split Tool",
      description:
        "Calculate interrupt priority preemption bit split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          priority: { type: "integer", minimum: 0 },
          implementedBits: { type: "integer", minimum: 1, maximum: 8 },
          preemptionBits: { type: "integer", minimum: 0 },
        },
        required: ["priority", "implementedBits", "preemptionBits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preemption: { type: "integer" },
          subpriority: { type: "integer" },
        },
        required: ["preemption", "subpriority"],
      },
      ports: {
        inputs: [
          {
            id: "priority",
            label: "Priority",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "implementedBits",
            label: "Implemented Bits",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "preemptionBits",
            label: "Preemption Bits",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "preemption",
            label: "Preemption",
            valueType: { type: "integer" },
          },
          {
            id: "subpriority",
            label: "Subpriority",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = interruptPriorityPreemptionBitSplitTool.execute;
export default interruptPriorityPreemptionBitSplitTool;
