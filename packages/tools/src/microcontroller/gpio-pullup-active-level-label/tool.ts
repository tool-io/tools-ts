import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly level: boolean; readonly activeLow: boolean };
export type Output = { readonly active: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { level: { type: "boolean" }, activeLow: { type: "boolean" } },
  required: ["level", "activeLow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    active: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["active", "label"],
} as const;
/** Compute gpio pullup active level label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { level, activeLow } = input;
  const compute = (): Output => {
    const active = activeLow ? !level : level;
    return { active, label: active ? "active" : "inactive" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { level: false, activeLow: true },
  output: { active: true, label: "active" },
} satisfies ToolExample<Input, Output>;
export const gpioPullupActiveLevelLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/gpio-pullup-active-level-label",
  title: "GPIO Pullup Active Level Label Tool",
  description:
    "Compute gpio pullup active level label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "level",
        label: "Level",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "activeLow",
        label: "Active Low",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "active", label: "Active", valueType: { type: "boolean" } },
      { id: "label", label: "Label", valueType: { type: "string" } },
    ],
  },
});
export const run = gpioPullupActiveLevelLabelTool.execute;
export default gpioPullupActiveLevelLabelTool;
