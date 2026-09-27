import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly applied: number;
  readonly destroyed: number;
  readonly returned: number;
};
export type Output = { readonly accounted: number; readonly residual: number };
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
  properties: { accounted: { type: "integer" }, residual: { type: "integer" } },
  required: ["accounted", "residual"],
} as const;
/** Reconcile supplied disjoint evidence-seal inventory counts without authenticating custody or evidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, applied, destroyed, returned } = request;
  const compute = (): Output => {
    H.domain([issued, applied, destroyed, returned].every((x) => x >= 0));
    const accounted = BigInt(applied) + BigInt(destroyed) + BigInt(returned);
    return {
      accounted: Number(accounted),
      residual: Number(BigInt(issued) - accounted),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, applied: 80, destroyed: 5, returned: 10 },
  output: { accounted: 95, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const evidenceSealCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-seal-count-residual",
    title: "Evidence Seal Count Residual Tool",
    description:
      "Reconcile supplied disjoint evidence-seal inventory counts without authenticating custody or evidence.",
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
        residual: { type: "integer" },
      },
      required: ["accounted", "residual"],
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
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceSealCountResidualTool.execute;
export default evidenceSealCountResidualTool;
