import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialStorage: number;
  readonly inflow: number;
  readonly outflow: number;
  readonly internalProduction: number;
  readonly duration: number;
};
export type Output = {
  readonly netRate: number;
  readonly finalStorage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialStorage: { type: "number", minimum: 0 },
    inflow: { type: "number", minimum: 0 },
    outflow: { type: "number", minimum: 0 },
    internalProduction: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: [
    "initialStorage",
    "inflow",
    "outflow",
    "internalProduction",
    "duration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRate: { type: "number" }, finalStorage: { type: "number" } },
  required: ["netRate", "finalStorage"],
} as const;
/** Constant sediment mass-rate balance; a negative final storage exposes an inconsistent supplied scenario. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialStorage, inflow, outflow, internalProduction, duration } =
    request;
  const compute = (): Output => {
    H.domain(
      initialStorage >= 0 &&
        inflow >= 0 &&
        outflow >= 0 &&
        internalProduction >= 0 &&
        duration >= 0,
    );
    return {
      netRate: inflow + internalProduction - outflow,
      finalStorage:
        initialStorage + (inflow + internalProduction - outflow) * duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialStorage: 100,
    inflow: 10,
    outflow: 8,
    internalProduction: 2,
    duration: 5,
  },
  output: { netRate: 4, finalStorage: 120 },
} satisfies ToolExample<Input, Output>;
export const sedimentBudgetStorageOneCompartmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/sediment-budget-storage-one-compartment",
      title: "Sediment Budget Storage One Compartment Tool",
      description:
        "Constant sediment mass-rate balance; a negative final storage exposes an inconsistent supplied scenario.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialStorage: { type: "number", minimum: 0 },
          inflow: { type: "number", minimum: 0 },
          outflow: { type: "number", minimum: 0 },
          internalProduction: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
        },
        required: [
          "initialStorage",
          "inflow",
          "outflow",
          "internalProduction",
          "duration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netRate: { type: "number" },
          finalStorage: { type: "number" },
        },
        required: ["netRate", "finalStorage"],
      },
      ports: {
        inputs: [
          {
            id: "initialStorage",
            label: "Initial Storage",
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
            id: "internalProduction",
            label: "Internal Production",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "netRate", label: "Net Rate", valueType: { type: "number" } },
          {
            id: "finalStorage",
            label: "Final Storage",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sedimentBudgetStorageOneCompartmentTool.execute;
export default sedimentBudgetStorageOneCompartmentTool;
