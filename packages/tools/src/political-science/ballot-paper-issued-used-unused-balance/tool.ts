import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly used: number;
  readonly spoiled: number;
  readonly unused: number;
};
export type Output = {
  readonly accounted: number;
  readonly residual: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    used: { type: "integer", minimum: 0 },
    spoiled: { type: "integer", minimum: 0 },
    unused: { type: "integer", minimum: 0 },
  },
  required: ["issued", "used", "spoiled", "unused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accounted: { type: "integer" },
    residual: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["accounted", "residual", "balanced"],
} as const;
/** Use disjoint used, spoiled and unused categories; discrepancies remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, used, spoiled, unused } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(used, 0);
    H.integer(spoiled, 0);
    H.integer(unused, 0);
    return {
      accounted: used + spoiled + unused,
      residual: issued - used - spoiled - unused,
      balanced: issued === used + spoiled + unused,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 1000, used: 800, spoiled: 20, unused: 180 },
  output: { accounted: 1000, residual: 0, balanced: true },
} satisfies ToolExample<Input, Output>;
export const ballotPaperIssuedUsedUnusedBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/ballot-paper-issued-used-unused-balance",
    title: "Ballot Paper Issued Used Unused Balance Tool",
    description:
      "Use disjoint used, spoiled and unused categories; discrepancies remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer", minimum: 0 },
        used: { type: "integer", minimum: 0 },
        spoiled: { type: "integer", minimum: 0 },
        unused: { type: "integer", minimum: 0 },
      },
      required: ["issued", "used", "spoiled", "unused"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accounted: { type: "integer" },
        residual: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["accounted", "residual", "balanced"],
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
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spoiled",
          label: "Spoiled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unused",
          label: "Unused",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ballotPaperIssuedUsedUnusedBalanceTool.execute;
export default ballotPaperIssuedUsedUnusedBalanceTool;
