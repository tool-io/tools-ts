import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDuration: number;
  readonly intervalDuration: number;
  readonly fullCreditOnly: boolean;
};
export type Output = { readonly fraction: number; readonly credit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDuration: { type: "number", minimum: 0 },
    intervalDuration: { type: "number", exclusiveMinimum: 0 },
    fullCreditOnly: { type: "boolean" },
  },
  required: ["observedDuration", "intervalDuration", "fullCreditOnly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, credit: { type: "number" } },
  required: ["fraction", "credit"],
} as const;
/** Calculate interval observation partial credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDuration, intervalDuration, fullCreditOnly } = request;
  const compute = (): Output => {
    H.positive(intervalDuration);
    H.domain(observedDuration >= 0 && observedDuration <= intervalDuration);
    return {
      fraction: observedDuration / intervalDuration,
      credit: fullCreditOnly
        ? observedDuration === intervalDuration
          ? 1
          : 0
        : observedDuration / intervalDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDuration: 5, intervalDuration: 10, fullCreditOnly: false },
  output: { fraction: 0.5, credit: 0.5 },
} satisfies ToolExample<Input, Output>;
export const intervalObservationPartialCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/interval-observation-partial-credit",
    title: "Interval Observation Partial Credit Tool",
    description:
      "Calculate interval observation partial credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDuration: { type: "number", minimum: 0 },
        intervalDuration: { type: "number", exclusiveMinimum: 0 },
        fullCreditOnly: { type: "boolean" },
      },
      required: ["observedDuration", "intervalDuration", "fullCreditOnly"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" }, credit: { type: "number" } },
      required: ["fraction", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "observedDuration",
          label: "Observed Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intervalDuration",
          label: "Interval Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullCreditOnly",
          label: "Full Credit Only",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = intervalObservationPartialCreditTool.execute;
export default intervalObservationPartialCreditTool;
