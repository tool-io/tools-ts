import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly daysLate: number;
  readonly graceDays: number;
  readonly inclusive: boolean;
};
export type Output = { readonly chargeable: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysLate: { type: "integer" },
    graceDays: { type: "integer", minimum: 0 },
    inclusive: { type: "boolean" },
  },
  required: ["daysLate", "graceDays", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeable: { type: "boolean" } },
  required: ["chargeable"],
} as const;
/** Check an explicit late-fee boundary with caller-selected inclusive versus exclusive grace semantics. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { daysLate, graceDays, inclusive } = input;
  const compute = (): Output => {
    H.integer(graceDays, 0);
    return {
      chargeable: inclusive ? daysLate >= graceDays : daysLate > graceDays,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { daysLate: 5, graceDays: 5, inclusive: false },
  output: { chargeable: false },
} satisfies ToolExample<Input, Output>;
export const billLatefeeGraceBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/bill-latefee-grace-boundary",
    title: "Bill Latefee Grace Boundary Tool",
    description:
      "Check an explicit late-fee boundary with caller-selected inclusive versus exclusive grace semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysLate: { type: "integer" },
        graceDays: { type: "integer", minimum: 0 },
        inclusive: { type: "boolean" },
      },
      required: ["daysLate", "graceDays", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chargeable: { type: "boolean" } },
      required: ["chargeable"],
    },
    ports: {
      inputs: [
        {
          id: "daysLate",
          label: "Days Late",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "graceDays",
          label: "Grace Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "chargeable",
          label: "Chargeable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = billLatefeeGraceBoundaryTool.execute;
export default billLatefeeGraceBoundaryTool;
