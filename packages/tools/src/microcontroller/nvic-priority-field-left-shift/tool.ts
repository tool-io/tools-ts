import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly priority: number;
  readonly implementedBits: number;
};
export type Output = { readonly registerValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priority: { type: "integer", minimum: 0 },
    implementedBits: { type: "integer", minimum: 1, maximum: 8 },
  },
  required: ["priority", "implementedBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { registerValue: { type: "integer" } },
  required: ["registerValue"],
} as const;
/** Compute nvic priority field left shift from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { priority, implementedBits } = input;
  const compute = (): Output => {
    integer(implementedBits, 1, 8);
    integer(priority, 0, 2 ** implementedBits - 1);
    return { registerValue: priority * 2 ** (8 - implementedBits) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { priority: 3, implementedBits: 4 },
  output: { registerValue: 48 },
} satisfies ToolExample<Input, Output>;
export const nvicPriorityFieldLeftShiftTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/nvic-priority-field-left-shift",
  title: "NVIC Priority Field Left Shift Tool",
  description:
    "Compute nvic priority field left shift from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
    ],
    outputs: [
      {
        id: "registerValue",
        label: "Register Value",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = nvicPriorityFieldLeftShiftTool.execute;
export default nvicPriorityFieldLeftShiftTool;
