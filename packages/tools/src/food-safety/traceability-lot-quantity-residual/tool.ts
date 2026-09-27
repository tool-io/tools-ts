import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly issued: number;
  readonly returned: number;
  readonly destroyed: number;
  readonly countedRemaining: number;
};
export type Output = {
  readonly expectedRemaining: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer" },
    issued: { type: "integer" },
    returned: { type: "integer" },
    destroyed: { type: "integer" },
    countedRemaining: { type: "integer" },
  },
  required: ["received", "issued", "returned", "destroyed", "countedRemaining"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedRemaining: { type: "integer" },
    residual: { type: "integer" },
  },
  required: ["expectedRemaining", "residual"],
} as const;
/** Reconcile supplied food-lot quantities without authenticating traceability or declaring usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, issued, returned, destroyed, countedRemaining } = request;
  const compute = (): Output => {
    H.domain(
      [received, issued, returned, destroyed, countedRemaining].every(
        (x) => x >= 0,
      ),
    );
    const expected =
      BigInt(received) - BigInt(issued) + BigInt(returned) - BigInt(destroyed);
    return {
      expectedRemaining: Number(expected),
      residual: Number(BigInt(countedRemaining) - expected),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    received: 100,
    issued: 70,
    returned: 10,
    destroyed: 5,
    countedRemaining: 30,
  },
  output: { expectedRemaining: 35, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const traceabilityLotQuantityResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/traceability-lot-quantity-residual",
    title: "Traceability Lot Quantity Residual Tool",
    description:
      "Reconcile supplied food-lot quantities without authenticating traceability or declaring usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        received: { type: "integer" },
        issued: { type: "integer" },
        returned: { type: "integer" },
        destroyed: { type: "integer" },
        countedRemaining: { type: "integer" },
      },
      required: [
        "received",
        "issued",
        "returned",
        "destroyed",
        "countedRemaining",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedRemaining: { type: "integer" },
        residual: { type: "integer" },
      },
      required: ["expectedRemaining", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issued",
          label: "Issued",
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
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedRemaining",
          label: "Counted Remaining",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedRemaining",
          label: "Expected Remaining",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = traceabilityLotQuantityResidualTool.execute;
export default traceabilityLotQuantityResidualTool;
