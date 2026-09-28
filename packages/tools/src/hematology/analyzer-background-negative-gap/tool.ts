import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly background: number;
  readonly suppliedFactor: number;
};
export type Output = { readonly corrected: number; readonly negative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    background: { type: "number" },
    suppliedFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "background", "suppliedFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, negative: { type: "boolean" } },
  required: ["corrected", "negative"],
} as const;
/** Preserve signed blank-corrected analyzer values without clamping or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, background, suppliedFactor } = request;
  const compute = (): Output => {
    H.positive(suppliedFactor);
    return {
      corrected: (observed - background) * suppliedFactor,
      negative: observed < background,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 3, background: 5, suppliedFactor: 2 },
  output: { corrected: -4, negative: true },
} satisfies ToolExample<Input, Output>;
export const analyzerBackgroundNegativeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/analyzer-background-negative-gap",
    title: "Analyzer Background Negative Gap Tool",
    description:
      "Preserve signed blank-corrected analyzer values without clamping or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        background: { type: "number" },
        suppliedFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observed", "background", "suppliedFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        negative: { type: "boolean" },
      },
      required: ["corrected", "negative"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = analyzerBackgroundNegativeGapTool.execute;
export default analyzerBackgroundNegativeGapTool;
