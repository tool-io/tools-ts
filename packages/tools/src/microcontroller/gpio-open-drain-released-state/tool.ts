import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly outputLow: boolean;
  readonly externalPullup: boolean;
  readonly externalLow: boolean;
};
export type Output = { readonly state: string; readonly drivenLow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputLow: { type: "boolean" },
    externalPullup: { type: "boolean" },
    externalLow: { type: "boolean" },
  },
  required: ["outputLow", "externalPullup", "externalLow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "string", maxLength: 8192 },
    drivenLow: { type: "boolean" },
  },
  required: ["state", "drivenLow"],
} as const;
/** Compute gpio open drain released state from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { outputLow, externalPullup, externalLow } = input;
  const compute = (): Output => {
    const drivenLow = outputLow || externalLow;
    return {
      state: drivenLow ? "low" : externalPullup ? "high" : "floating",
      drivenLow,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { outputLow: false, externalPullup: true, externalLow: false },
  output: { state: "high", drivenLow: false },
} satisfies ToolExample<Input, Output>;
export const gpioOpenDrainReleasedStateTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/gpio-open-drain-released-state",
  title: "GPIO Open Drain Released State Tool",
  description:
    "Compute gpio open drain released state from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "outputLow",
        label: "Output Low",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "externalPullup",
        label: "External Pullup",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "externalLow",
        label: "External Low",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "state", label: "State", valueType: { type: "string" } },
      { id: "drivenLow", label: "Driven Low", valueType: { type: "boolean" } },
    ],
  },
});
export const run = gpioOpenDrainReleasedStateTool.execute;
export default gpioOpenDrainReleasedStateTool;
