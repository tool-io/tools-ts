import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signal: number; readonly biomass: number };
export type Output = { readonly specificSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    biomass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["signal", "biomass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specificSignal: { type: "number" } },
  required: ["specificSignal"],
} as const;
/** Normalize an explicitly blank-corrected bench signal by measured biomass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, biomass } = request;
  const compute = (): Output => {
    H.positive(biomass);
    return { specificSignal: signal / biomass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, biomass: 3 },
  output: { specificSignal: 4 },
} satisfies ToolExample<Input, Output>;
export const biomassSpecificSignalFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/biomass-specific-signal-factor",
    title: "Biomass Specific Signal Factor Tool",
    description:
      "Normalize an explicitly blank-corrected bench signal by measured biomass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        biomass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["signal", "biomass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { specificSignal: { type: "number" } },
      required: ["specificSignal"],
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
          id: "biomass",
          label: "Biomass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specificSignal",
          label: "Specific Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomassSpecificSignalFactorTool.execute;
export default biomassSpecificSignalFactorTool;
