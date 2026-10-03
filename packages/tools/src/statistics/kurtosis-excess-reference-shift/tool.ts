import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly kurtosis: number; readonly reference: number };
export type Output = { readonly excess: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kurtosis: { type: "number", minimum: 0 },
    reference: { type: "number" },
  },
  required: ["kurtosis", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { excess: { type: "number" } },
  required: ["excess"],
} as const;
/** Calculate kurtosis excess reference shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { kurtosis, reference } = request;
  const compute = (): Output => {
    H.domain(kurtosis >= 0);
    return { excess: kurtosis - reference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { kurtosis: 4, reference: 3 },
  output: { excess: 1 },
} satisfies ToolExample<Input, Output>;
export const kurtosisExcessReferenceShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/kurtosis-excess-reference-shift",
    title: "Kurtosis Excess Reference Shift Tool",
    description:
      "Calculate kurtosis excess reference shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kurtosis: { type: "number", minimum: 0 },
        reference: { type: "number" },
      },
      required: ["kurtosis", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { excess: { type: "number" } },
      required: ["excess"],
    },
    ports: {
      inputs: [
        {
          id: "kurtosis",
          label: "Kurtosis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = kurtosisExcessReferenceShiftTool.execute;
export default kurtosisExcessReferenceShiftTool;
