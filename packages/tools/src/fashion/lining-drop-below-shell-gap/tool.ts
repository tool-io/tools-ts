import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shellLength: number;
  readonly liningLength: number;
  readonly desiredRecess: number;
};
export type Output = {
  readonly actualRecess: number;
  readonly margin: number;
  readonly protrudes: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shellLength: { type: "number", minimum: 0 },
    liningLength: { type: "number", minimum: 0 },
    desiredRecess: { type: "number", minimum: 0 },
  },
  required: ["shellLength", "liningLength", "desiredRecess"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualRecess: { type: "number" },
    margin: { type: "number" },
    protrudes: { type: "boolean" },
  },
  required: ["actualRecess", "margin", "protrudes"],
} as const;
/** Calculate lining drop below shell gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shellLength, liningLength, desiredRecess } = request;
  const compute = (): Output => {
    H.domain(shellLength >= 0 && liningLength >= 0 && desiredRecess >= 0);
    return {
      actualRecess: shellLength - liningLength,
      margin: shellLength - liningLength - desiredRecess,
      protrudes: liningLength > shellLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shellLength: 100, liningLength: 98, desiredRecess: 1 },
  output: { actualRecess: 2, margin: 1, protrudes: false },
} satisfies ToolExample<Input, Output>;
export const liningDropBelowShellGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/lining-drop-below-shell-gap",
    title: "Lining Drop Below Shell Gap Tool",
    description:
      "Calculate lining drop below shell gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shellLength: { type: "number", minimum: 0 },
        liningLength: { type: "number", minimum: 0 },
        desiredRecess: { type: "number", minimum: 0 },
      },
      required: ["shellLength", "liningLength", "desiredRecess"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualRecess: { type: "number" },
        margin: { type: "number" },
        protrudes: { type: "boolean" },
      },
      required: ["actualRecess", "margin", "protrudes"],
    },
    ports: {
      inputs: [
        {
          id: "shellLength",
          label: "Shell Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liningLength",
          label: "Lining Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "desiredRecess",
          label: "Desired Recess",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualRecess",
          label: "Actual Recess",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "protrudes", label: "Protrudes", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = liningDropBelowShellGapTool.execute;
export default liningDropBelowShellGapTool;
