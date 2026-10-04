import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly capacitanceFarads: number };
export type Output = { readonly reciprocalCapacitance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capacitanceFarads: { type: "number", exclusiveMinimum: 0 } },
  required: ["capacitanceFarads"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reciprocalCapacitance: { type: "number" } },
  required: ["reciprocalCapacitance"],
} as const;
/** Return one positive ideal capacitor's contribution to the reciprocal sum for a series combination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitanceFarads } = request;
  const compute = (): Output => {
    (H.domain(capacitanceFarads > 0, "capacitanceFarads"), capacitanceFarads);
    return { reciprocalCapacitance: 1 / capacitanceFarads };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacitanceFarads: 0.000002 },
  output: { reciprocalCapacitance: 500000 },
} satisfies ToolExample<Input, Output>;
export const capacitorSeriesReciprocalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-series-reciprocal-term",
    title: "Capacitor Series Reciprocal Term Tool",
    description:
      "Return one positive ideal capacitor's contribution to the reciprocal sum for a series combination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitanceFarads: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["capacitanceFarads"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reciprocalCapacitance: { type: "number" } },
      required: ["reciprocalCapacitance"],
    },
    ports: {
      inputs: [
        {
          id: "capacitanceFarads",
          label: "Capacitance Farads",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reciprocalCapacitance",
          label: "Reciprocal Capacitance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capacitorSeriesReciprocalTermTool.execute;
export default capacitorSeriesReciprocalTermTool;
