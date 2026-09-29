import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inflow: number;
  readonly outflow: number;
  readonly storageChange: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inflow: { type: "number" },
    outflow: { type: "number" },
    storageChange: { type: "number" },
  },
  required: ["inflow", "outflow", "storageChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate water balance closure residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inflow, outflow, storageChange } = request;
  const compute = (): Output => {
    return { residual: inflow - outflow - storageChange };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inflow: 100, outflow: 70, storageChange: 20 },
  output: { residual: 10 },
} satisfies ToolExample<Input, Output>;
export const waterBalanceClosureResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/water-balance-closure-residual",
    title: "Water Balance Closure Residual Tool",
    description:
      "Calculate water balance closure residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inflow: { type: "number" },
        outflow: { type: "number" },
        storageChange: { type: "number" },
      },
      required: ["inflow", "outflow", "storageChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "inflow",
          label: "Inflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outflow",
          label: "Outflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageChange",
          label: "Storage Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waterBalanceClosureResidualTool.execute;
export default waterBalanceClosureResidualTool;
