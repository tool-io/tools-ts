import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly applied: number;
  readonly destroyed: number;
  readonly returned: number;
};
export type Output = {
  readonly accounted: number;
  readonly unaccounted: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer" },
    applied: { type: "integer" },
    destroyed: { type: "integer" },
    returned: { type: "integer" },
  },
  required: ["issued", "applied", "destroyed", "returned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accounted: { type: "integer" },
    unaccounted: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["accounted", "unaccounted", "balanced"],
} as const;
/** Count supplied disjoint label dispositions without certifying GMP reconciliation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, applied, destroyed, returned } = request;
  const compute = (): Output => {
    H.domain([issued, applied, destroyed, returned].every((x) => x >= 0));
    const accounted = BigInt(applied) + BigInt(destroyed) + BigInt(returned),
      gap = BigInt(issued) - accounted;
    return {
      accounted: Number(accounted),
      unaccounted: Number(gap),
      balanced: gap === 0n,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 1000, applied: 900, destroyed: 30, returned: 60 },
  output: { accounted: 990, unaccounted: 10, balanced: false },
} satisfies ToolExample<Input, Output>;
export const gmpLabelRollCountClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-label-roll-count-closure",
    title: "GMP Label Roll Count Closure Tool",
    description:
      "Count supplied disjoint label dispositions without certifying GMP reconciliation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer" },
        applied: { type: "integer" },
        destroyed: { type: "integer" },
        returned: { type: "integer" },
      },
      required: ["issued", "applied", "destroyed", "returned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accounted: { type: "integer" },
        unaccounted: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["accounted", "unaccounted", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "applied",
          label: "Applied",
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
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        {
          id: "unaccounted",
          label: "Unaccounted",
          valueType: { type: "integer" },
        },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gmpLabelRollCountClosureTool.execute;
export default gmpLabelRollCountClosureTool;
