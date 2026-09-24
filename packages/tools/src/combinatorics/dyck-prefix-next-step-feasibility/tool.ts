import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly up: number;
  readonly down: number;
  readonly pairs: number;
};
export type Output = {
  readonly canUp: boolean;
  readonly canDown: boolean;
  readonly height: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    up: { type: "integer", minimum: 0 },
    down: { type: "integer", minimum: 0 },
    pairs: { type: "integer", minimum: 0 },
  },
  required: ["up", "down", "pairs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canUp: { type: "boolean" },
    canDown: { type: "boolean" },
    height: { type: "integer" },
  },
  required: ["canUp", "canDown", "height"],
} as const;
/** Compute dyck prefix next step feasibility from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { up, down, pairs } = input;
  const compute = (): Output => {
    integer(pairs);
    integer(up, 0, pairs);
    integer(down, 0, up);
    return { canUp: up < pairs, canDown: down < up, height: up - down };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { up: 2, down: 1, pairs: 3 },
  output: { canUp: true, canDown: true, height: 1 },
} satisfies ToolExample<Input, Output>;
export const dyckPrefixNextStepFeasibilityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/dyck-prefix-next-step-feasibility",
  title: "Dyck Prefix Next Step Feasibility Tool",
  description:
    "Compute dyck prefix next step feasibility from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "up", label: "Up", required: true, valueType: { type: "integer" } },
      {
        id: "down",
        label: "Down",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "pairs",
        label: "Pairs",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "canUp", label: "Can Up", valueType: { type: "boolean" } },
      { id: "canDown", label: "Can Down", valueType: { type: "boolean" } },
      { id: "height", label: "Height", valueType: { type: "integer" } },
    ],
  },
});
export const run = dyckPrefixNextStepFeasibilityTool.execute;
export default dyckPrefixNextStepFeasibilityTool;
