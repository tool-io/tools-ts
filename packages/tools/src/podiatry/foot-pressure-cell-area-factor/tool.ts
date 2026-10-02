import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellPressure: number;
  readonly cellArea: number;
};
export type Output = { readonly normalForce: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellPressure: { type: "number", minimum: 0 },
    cellArea: { type: "number", minimum: 0 },
  },
  required: ["cellPressure", "cellArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalForce: { type: "number" } },
  required: ["normalForce"],
} as const;
/** Return one supplied bench pressure-area force contribution in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellPressure, cellArea } = request;
  const compute = (): Output => {
    H.domain(cellPressure >= 0 && cellArea >= 0);
    return { normalForce: cellPressure * cellArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellPressure: 20, cellArea: 0.5 },
  output: { normalForce: 10 },
} satisfies ToolExample<Input, Output>;
export const footPressureCellAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/foot-pressure-cell-area-factor",
    title: "Foot Pressure Cell Area Factor Tool",
    description:
      "Return one supplied bench pressure-area force contribution in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellPressure: { type: "number", minimum: 0 },
        cellArea: { type: "number", minimum: 0 },
      },
      required: ["cellPressure", "cellArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalForce: { type: "number" } },
      required: ["normalForce"],
    },
    ports: {
      inputs: [
        {
          id: "cellPressure",
          label: "Cell Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalForce",
          label: "Normal Force",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = footPressureCellAreaFactorTool.execute;
export default footPressureCellAreaFactorTool;
