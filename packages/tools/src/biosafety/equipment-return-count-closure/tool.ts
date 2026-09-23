import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly retired: number;
  readonly stillAssigned: number;
};
export type Output = {
  readonly accounted: number;
  readonly unexplained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer" },
    returned: { type: "integer" },
    retired: { type: "integer" },
    stillAssigned: { type: "integer" },
  },
  required: ["issued", "returned", "retired", "stillAssigned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accounted: { type: "integer" },
    unexplained: { type: "integer" },
  },
  required: ["accounted", "unexplained"],
} as const;
/** Reconcile supplied disjoint equipment disposition counts without certifying readiness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, retired, stillAssigned } = request;
  const compute = (): Output => {
    H.domain([issued, returned, retired, stillAssigned].every((x) => x >= 0));
    const n = BigInt(returned) + BigInt(retired) + BigInt(stillAssigned);
    return { accounted: Number(n), unexplained: Number(BigInt(issued) - n) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, returned: 70, retired: 5, stillAssigned: 20 },
  output: { accounted: 95, unexplained: 5 },
} satisfies ToolExample<Input, Output>;
export const equipmentReturnCountClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/equipment-return-count-closure",
    title: "Equipment Return Count Closure Tool",
    description:
      "Reconcile supplied disjoint equipment disposition counts without certifying readiness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer" },
        returned: { type: "integer" },
        retired: { type: "integer" },
        stillAssigned: { type: "integer" },
      },
      required: ["issued", "returned", "retired", "stillAssigned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accounted: { type: "integer" },
        unexplained: { type: "integer" },
      },
      required: ["accounted", "unexplained"],
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
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retired",
          label: "Retired",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stillAssigned",
          label: "Still Assigned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        {
          id: "unexplained",
          label: "Unexplained",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = equipmentReturnCountClosureTool.execute;
export default equipmentReturnCountClosureTool;
