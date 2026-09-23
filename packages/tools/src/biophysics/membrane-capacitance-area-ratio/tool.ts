import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacitance: number;
  readonly membraneArea: number;
};
export type Output = { readonly specificCapacitance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitance: { type: "number", minimum: 0 },
    membraneArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["capacitance", "membraneArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specificCapacitance: { type: "number" } },
  required: ["specificCapacitance"],
} as const;
/** Calculate membrane capacitance area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitance, membraneArea } = request;
  const compute = (): Output => {
    H.domain(capacitance >= 0);
    H.positive(membraneArea);
    return { specificCapacitance: capacitance / membraneArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacitance: 20, membraneArea: 4 },
  output: { specificCapacitance: 5 },
} satisfies ToolExample<Input, Output>;
export const membraneCapacitanceAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/membrane-capacitance-area-ratio",
    title: "Membrane Capacitance Area Ratio Tool",
    description:
      "Calculate membrane capacitance area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitance: { type: "number", minimum: 0 },
        membraneArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["capacitance", "membraneArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { specificCapacitance: { type: "number" } },
      required: ["specificCapacitance"],
    },
    ports: {
      inputs: [
        {
          id: "capacitance",
          label: "Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "membraneArea",
          label: "Membrane Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specificCapacitance",
          label: "Specific Capacitance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = membraneCapacitanceAreaRatioTool.execute;
export default membraneCapacitanceAreaRatioTool;
