import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signal: number; readonly background: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signal: { type: "number" }, background: { type: "number" } },
  required: ["signal", "background"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Divide supplied bench signals in a compatible basis without clinical classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, background } = request;
  const compute = (): Output => {
    H.domain(background !== 0);
    return { ratio: signal / background };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, background: 3 },
  output: { ratio: 4 },
} satisfies ToolExample<Input, Output>;
export const endocrineSignalBackgroundRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-signal-background-ratio",
    title: "Endocrine Signal Background Ratio Tool",
    description:
      "Divide supplied bench signals in a compatible basis without clinical classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        background: { type: "number" },
      },
      required: ["signal", "background"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = endocrineSignalBackgroundRatioTool.execute;
export default endocrineSignalBackgroundRatioTool;
