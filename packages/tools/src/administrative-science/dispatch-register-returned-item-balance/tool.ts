import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatched: number;
  readonly delivered: number;
  readonly returned: number;
  readonly pending: number;
};
export type Output = {
  readonly accounted: number;
  readonly residual: number;
  readonly returnFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatched: { type: "integer", minimum: 1 },
    delivered: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    pending: { type: "integer", minimum: 0 },
  },
  required: ["dispatched", "delivered", "returned", "pending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accounted: { type: "integer" },
    residual: { type: "integer" },
    returnFraction: { type: "number" },
  },
  required: ["accounted", "residual", "returnFraction"],
} as const;
/** Use disjoint final delivered, returned and pending categories; retain reconciliation discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatched, delivered, returned, pending } = request;
  const compute = (): Output => {
    H.integer(dispatched, 1);
    H.integer(delivered, 0);
    H.integer(returned, 0);
    H.integer(pending, 0);
    return {
      accounted: delivered + returned + pending,
      residual: dispatched - delivered - returned - pending,
      returnFraction: returned / dispatched,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispatched: 100, delivered: 70, returned: 10, pending: 15 },
  output: { accounted: 95, residual: 5, returnFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const dispatchRegisterReturnedItemBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "administrative-science/dispatch-register-returned-item-balance",
      title: "Dispatch Register Returned Item Balance Tool",
      description:
        "Use disjoint final delivered, returned and pending categories; retain reconciliation discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dispatched: { type: "integer", minimum: 1 },
          delivered: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          pending: { type: "integer", minimum: 0 },
        },
        required: ["dispatched", "delivered", "returned", "pending"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accounted: { type: "integer" },
          residual: { type: "integer" },
          returnFraction: { type: "number" },
        },
        required: ["accounted", "residual", "returnFraction"],
      },
      ports: {
        inputs: [
          {
            id: "dispatched",
            label: "Dispatched",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "delivered",
            label: "Delivered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "pending",
            label: "Pending",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "accounted",
            label: "Accounted",
            valueType: { type: "integer" },
          },
          { id: "residual", label: "Residual", valueType: { type: "integer" } },
          {
            id: "returnFraction",
            label: "Return Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dispatchRegisterReturnedItemBalanceTool.execute;
export default dispatchRegisterReturnedItemBalanceTool;
