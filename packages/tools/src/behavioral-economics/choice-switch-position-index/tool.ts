import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly choices: readonly string[] };
export type Output = {
  readonly firstSwitchIndex: number;
  readonly switched: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    choices: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["choices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSwitchIndex: { type: "integer" },
    switched: { type: "boolean" },
  },
  required: ["firstSwitchIndex", "switched"],
} as const;
/** Calculate choice switch position index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { choices } = request;
  const compute = (): Output => {
    const i = choices.findIndex((x, j) => j > 0 && x !== choices[j - 1]);
    return { firstSwitchIndex: i, switched: i >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { choices: ["A", "A", "B", "A"] },
  output: { firstSwitchIndex: 2, switched: true },
} satisfies ToolExample<Input, Output>;
export const choiceSwitchPositionIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/choice-switch-position-index",
    title: "Choice Switch Position Index Tool",
    description:
      "Calculate choice switch position index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        choices: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["choices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSwitchIndex: { type: "integer" },
        switched: { type: "boolean" },
      },
      required: ["firstSwitchIndex", "switched"],
    },
    ports: {
      inputs: [
        {
          id: "choices",
          label: "Choices",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "firstSwitchIndex",
          label: "First Switch Index",
          valueType: { type: "integer" },
        },
        { id: "switched", label: "Switched", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = choiceSwitchPositionIndexTool.execute;
export default choiceSwitchPositionIndexTool;
