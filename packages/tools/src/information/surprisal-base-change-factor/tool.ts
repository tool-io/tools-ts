import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly sourceBase: number;
  readonly targetBase: number;
};
export type Output = { readonly value: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    sourceBase: { type: "number", exclusiveMinimum: 0 },
    targetBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "sourceBase", "targetBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, factor: { type: "number" } },
  required: ["value", "factor"],
} as const;
/** Calculate surprisal base change factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, sourceBase, targetBase } = request;
  const compute = (): Output => {
    H.domain(
      sourceBase > 0 && sourceBase !== 1 && targetBase > 0 && targetBase !== 1,
    );
    const factor = Math.log(sourceBase) / Math.log(targetBase);
    return { value: value * factor, factor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 3, sourceBase: 2, targetBase: 4 },
  output: { value: 1.5, factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const surprisalBaseChangeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/surprisal-base-change-factor",
    title: "Surprisal Base Change Factor Tool",
    description:
      "Calculate surprisal base change factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        sourceBase: { type: "number", exclusiveMinimum: 0 },
        targetBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "sourceBase", "targetBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" }, factor: { type: "number" } },
      required: ["value", "factor"],
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
          id: "sourceBase",
          label: "Source Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBase",
          label: "Target Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surprisalBaseChangeFactorTool.execute;
export default surprisalBaseChangeFactorTool;
