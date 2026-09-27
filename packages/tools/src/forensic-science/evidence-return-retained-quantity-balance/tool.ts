import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly consumed: number;
  readonly returned: number;
  readonly retained: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "number", minimum: 0 },
    consumed: { type: "number", minimum: 0 },
    returned: { type: "number", minimum: 0 },
    retained: { type: "number", minimum: 0 },
  },
  required: ["received", "consumed", "returned", "retained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "number" },
    balanced: { type: "boolean" },
  },
  required: ["unaccounted", "balanced"],
} as const;
/** Calculate evidence return retained quantity balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, consumed, returned, retained } = request;
  const compute = (): Output => {
    H.domain(received >= 0 && consumed >= 0 && returned >= 0 && retained >= 0);
    return {
      unaccounted: received - consumed - returned - retained,
      balanced: received === consumed + returned + retained,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { received: 100, consumed: 10, returned: 60, retained: 25 },
  output: { unaccounted: 5, balanced: false },
} satisfies ToolExample<Input, Output>;
export const evidenceReturnRetainedQuantityBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/evidence-return-retained-quantity-balance",
      title: "Evidence Return Retained Quantity Balance Tool",
      description:
        "Calculate evidence return retained quantity balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          received: { type: "number", minimum: 0 },
          consumed: { type: "number", minimum: 0 },
          returned: { type: "number", minimum: 0 },
          retained: { type: "number", minimum: 0 },
        },
        required: ["received", "consumed", "returned", "retained"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "number" },
          balanced: { type: "boolean" },
        },
        required: ["unaccounted", "balanced"],
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
            id: "consumed",
            label: "Consumed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retained",
            label: "Retained",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "number" },
          },
          { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = evidenceReturnRetainedQuantityBalanceTool.execute;
export default evidenceReturnRetainedQuantityBalanceTool;
