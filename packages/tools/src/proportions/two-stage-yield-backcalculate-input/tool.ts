import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly output: number;
  readonly firstYield: number;
  readonly secondYield: number;
};
export type Output = { readonly input: number; readonly afterFirst: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    output: { type: "number", minimum: 0 },
    firstYield: { type: "number", exclusiveMinimum: 0, minimum: 0, maximum: 1 },
    secondYield: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["output", "firstYield", "secondYield"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { input: { type: "number" }, afterFirst: { type: "number" } },
  required: ["input", "afterFirst"],
} as const;
/** Calculate two stage yield backcalculate input from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { output, firstYield, secondYield } = input;
  const compute = (): Output => {
    H.domain(output >= 0);
    H.probability(firstYield);
    H.probability(secondYield);
    H.positive(firstYield);
    H.positive(secondYield);
    const afterFirst = output / secondYield;
    return { input: afterFirst / firstYield, afterFirst };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: 72, firstYield: 0.8, secondYield: 0.9 },
  output: { input: 100, afterFirst: 80 },
} satisfies ToolExample<Input, Output>;
export const twoStageYieldBackcalculateInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/two-stage-yield-backcalculate-input",
    title: "Two Stage Yield Backcalculate Input Tool",
    description:
      "Calculate two stage yield backcalculate input from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        output: { type: "number", minimum: 0 },
        firstYield: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
        secondYield: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["output", "firstYield", "secondYield"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { input: { type: "number" }, afterFirst: { type: "number" } },
      required: ["input", "afterFirst"],
    },
    ports: {
      inputs: [
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstYield",
          label: "First Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondYield",
          label: "Second Yield",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "input", label: "Input", valueType: { type: "number" } },
        {
          id: "afterFirst",
          label: "After First",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = twoStageYieldBackcalculateInputTool.execute;
export default twoStageYieldBackcalculateInputTool;
