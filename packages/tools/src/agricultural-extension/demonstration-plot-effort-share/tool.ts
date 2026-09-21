import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotEffort: number;
  readonly totalEffort: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotEffort: { type: "number", minimum: 0 },
    totalEffort: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["plotEffort", "totalEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate demonstration plot effort share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotEffort, totalEffort } = request;
  const compute = (): Output => {
    H.positive(totalEffort);
    H.domain(plotEffort >= 0 && plotEffort <= totalEffort);
    return { share: plotEffort / totalEffort };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plotEffort: 3, totalEffort: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const demonstrationPlotEffortShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/demonstration-plot-effort-share",
    title: "Demonstration Plot Effort Share Tool",
    description:
      "Calculate demonstration plot effort share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotEffort: { type: "number", minimum: 0 },
        totalEffort: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["plotEffort", "totalEffort"],
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
          id: "plotEffort",
          label: "Plot Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEffort",
          label: "Total Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = demonstrationPlotEffortShareTool.execute;
export default demonstrationPlotEffortShareTool;
