import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startingVolume: number;
  readonly inflow: number;
  readonly outflow: number;
  readonly measuredFinal: number;
  readonly suppliedLoss: number;
};
export type Output = {
  readonly expectedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startingVolume: { type: "number" },
    inflow: { type: "number" },
    outflow: { type: "number" },
    measuredFinal: { type: "number" },
    suppliedLoss: { type: "number" },
  },
  required: [
    "startingVolume",
    "inflow",
    "outflow",
    "measuredFinal",
    "suppliedLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedFinal", "residual"],
} as const;
/** Supplied treatment-cell water ledger without remediation organisms, agents or operating conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startingVolume, inflow, outflow, measuredFinal, suppliedLoss } =
    request;
  const compute = (): Output => {
    H.domain(
      [startingVolume, inflow, outflow, measuredFinal, suppliedLoss].every(
        (x) => x >= 0,
      ) && outflow + suppliedLoss <= startingVolume + inflow,
    );
    return {
      expectedFinal: startingVolume + inflow - outflow - suppliedLoss,
      residual:
        measuredFinal - startingVolume - inflow + outflow + suppliedLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startingVolume: 100,
    inflow: 20,
    outflow: 30,
    measuredFinal: 85,
    suppliedLoss: 10,
  },
  output: { expectedFinal: 80, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const treatmentCellWaterBalanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/treatment-cell-water-balance-residual",
    title: "Treatment Cell Water Balance Residual Tool",
    description:
      "Supplied treatment-cell water ledger without remediation organisms, agents or operating conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startingVolume: { type: "number" },
        inflow: { type: "number" },
        outflow: { type: "number" },
        measuredFinal: { type: "number" },
        suppliedLoss: { type: "number" },
      },
      required: [
        "startingVolume",
        "inflow",
        "outflow",
        "measuredFinal",
        "suppliedLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedFinal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "startingVolume",
          label: "Starting Volume",
          required: true,
          valueType: { type: "number" },
        },
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
          id: "measuredFinal",
          label: "Measured Final",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLoss",
          label: "Supplied Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = treatmentCellWaterBalanceResidualTool.execute;
export default treatmentCellWaterBalanceResidualTool;
