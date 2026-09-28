import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly consumed: number;
  readonly returned: number;
  readonly retained: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "number" },
    consumed: { type: "number" },
    returned: { type: "number" },
    retained: { type: "number" },
  },
  required: ["issued", "consumed", "returned", "retained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Audit an explicit bench test-item mass ledger without compliance conclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, consumed, returned, retained } = request;
  const compute = (): Output => {
    H.domain([issued, consumed, returned, retained].every((x) => x >= 0));
    return { gap: issued - consumed - returned - retained };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, consumed: 60, returned: 20, retained: 15 },
  output: { gap: 5 },
} satisfies ToolExample<Input, Output>;
export const testItemBalanceMassGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/test-item-balance-mass-gap",
    title: "Test Item Balance Mass Gap Tool",
    description:
      "Audit an explicit bench test-item mass ledger without compliance conclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "number" },
        consumed: { type: "number" },
        returned: { type: "number" },
        retained: { type: "number" },
      },
      required: ["issued", "consumed", "returned", "retained"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
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
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = testItemBalanceMassGapTool.execute;
export default testItemBalanceMassGapTool;
