import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedBeforeCutoff: number;
  readonly plannedExposure: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBeforeCutoff: { type: "number", minimum: 0 },
    plannedExposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedBeforeCutoff", "plannedExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Compare supplied research exposure quantities without an interim stopping or inference rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedBeforeCutoff, plannedExposure } = request;
  const compute = (): Output => {
    H.domain(observedBeforeCutoff >= 0);
    H.positive(plannedExposure);
    return { share: observedBeforeCutoff / plannedExposure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedBeforeCutoff: 30, plannedExposure: 100 },
  output: { share: 0.3 },
} satisfies ToolExample<Input, Output>;
export const interimCutoffExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/interim-cutoff-exposure-share",
    title: "Interim Cutoff Exposure Share Tool",
    description:
      "Compare supplied research exposure quantities without an interim stopping or inference rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBeforeCutoff: { type: "number", minimum: 0 },
        plannedExposure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedBeforeCutoff", "plannedExposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "observedBeforeCutoff",
          label: "Observed Before Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedExposure",
          label: "Planned Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = interimCutoffExposureShareTool.execute;
export default interimCutoffExposureShareTool;
