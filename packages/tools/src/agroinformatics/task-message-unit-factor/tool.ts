import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly suppliedFactor: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    suppliedFactor: { type: "number" },
    suppliedOffset: { type: "number" },
  },
  required: ["value", "suppliedFactor", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Apply explicit agricultural message unit/origin metadata without executing machinery commands. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, suppliedFactor, suppliedOffset } = request;
  const compute = (): Output => {
    H.domain(suppliedFactor !== 0);
    return { converted: value * suppliedFactor + suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, suppliedFactor: 0.5, suppliedOffset: 1 },
  output: { converted: 7 },
} satisfies ToolExample<Input, Output>;
export const taskMessageUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/task-message-unit-factor",
    title: "Task Message Unit Factor Tool",
    description:
      "Apply explicit agricultural message unit/origin metadata without executing machinery commands.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        suppliedFactor: { type: "number" },
        suppliedOffset: { type: "number" },
      },
      required: ["value", "suppliedFactor", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = taskMessageUnitFactorTool.execute;
export default taskMessageUnitFactorTool;
