import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly onward: number;
  readonly retained: number;
  readonly processLoss: number;
};
export type Output = {
  readonly unreconciled: number;
  readonly onwardFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "number", exclusiveMinimum: 0 },
    onward: { type: "number", minimum: 0 },
    retained: { type: "number", minimum: 0 },
    processLoss: { type: "number", minimum: 0 },
  },
  required: ["received", "onward", "retained", "processLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unreconciled: { type: "number" },
    onwardFraction: { type: "number" },
  },
  required: ["unreconciled", "onwardFraction"],
} as const;
/** Signed one-hop reconciliation residual, allowing a discrepancy to remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, onward, retained, processLoss } = request;
  const compute = (): Output => {
    H.positive(received);
    H.domain(
      onward >= 0 && retained >= 0 && processLoss >= 0 && onward <= received,
    );
    return {
      unreconciled: received - onward - retained - processLoss,
      onwardFraction: onward / received,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { received: 100, onward: 60, retained: 30, processLoss: 5 },
  output: { unreconciled: 5, onwardFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const foodTraceabilityOneHopQuantityBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-traceability-one-hop-quantity-balance",
      title: "Food Traceability One Hop Quantity Balance Tool",
      description:
        "Signed one-hop reconciliation residual, allowing a discrepancy to remain visible.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          received: { type: "number", exclusiveMinimum: 0 },
          onward: { type: "number", minimum: 0 },
          retained: { type: "number", minimum: 0 },
          processLoss: { type: "number", minimum: 0 },
        },
        required: ["received", "onward", "retained", "processLoss"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unreconciled: { type: "number" },
          onwardFraction: { type: "number" },
        },
        required: ["unreconciled", "onwardFraction"],
      },
      ports: {
        inputs: [
          {
            id: "received",
            label: "Received",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "onward",
            label: "Onward",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retained",
            label: "Retained",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "processLoss",
            label: "Process Loss",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unreconciled",
            label: "Unreconciled",
            valueType: { type: "number" },
          },
          {
            id: "onwardFraction",
            label: "Onward Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodTraceabilityOneHopQuantityBalanceTool.execute;
export default foodTraceabilityOneHopQuantityBalanceTool;
