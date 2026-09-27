import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedDay: number;
  readonly expiresDay: number;
  readonly queryDay: number;
  readonly endInclusive: boolean;
};
export type Output = {
  readonly started: boolean;
  readonly ended: boolean;
  readonly validUnderDates: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedDay: { type: "integer" },
    expiresDay: { type: "integer" },
    queryDay: { type: "integer" },
    endInclusive: { type: "boolean" },
  },
  required: ["issuedDay", "expiresDay", "queryDay", "endInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    started: { type: "boolean" },
    ended: { type: "boolean" },
    validUnderDates: { type: "boolean" },
  },
  required: ["started", "ended", "validUnderDates"],
} as const;
/** Date-window comparison only; authenticity and certificate scope remain caller-supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedDay, expiresDay, queryDay, endInclusive } = request;
  const compute = (): Output => {
    H.domain(expiresDay >= issuedDay);
    return {
      started: queryDay >= issuedDay,
      ended: endInclusive ? queryDay > expiresDay : queryDay >= expiresDay,
      validUnderDates:
        queryDay >= issuedDay &&
        (endInclusive ? queryDay <= expiresDay : queryDay < expiresDay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedDay: 10, expiresDay: 20, queryDay: 20, endInclusive: true },
  output: { started: true, ended: false, validUnderDates: true },
} satisfies ToolExample<Input, Output>;
export const foodSupplierCertificateValidWindowCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-supplier-certificate-valid-window-check",
      title: "Food Supplier Certificate Valid Window Check Tool",
      description:
        "Date-window comparison only; authenticity and certificate scope remain caller-supplied.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issuedDay: { type: "integer" },
          expiresDay: { type: "integer" },
          queryDay: { type: "integer" },
          endInclusive: { type: "boolean" },
        },
        required: ["issuedDay", "expiresDay", "queryDay", "endInclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          started: { type: "boolean" },
          ended: { type: "boolean" },
          validUnderDates: { type: "boolean" },
        },
        required: ["started", "ended", "validUnderDates"],
      },
      ports: {
        inputs: [
          {
            id: "issuedDay",
            label: "Issued Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expiresDay",
            label: "Expires Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "queryDay",
            label: "Query Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "endInclusive",
            label: "End Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "started", label: "Started", valueType: { type: "boolean" } },
          { id: "ended", label: "Ended", valueType: { type: "boolean" } },
          {
            id: "validUnderDates",
            label: "Valid Under Dates",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodSupplierCertificateValidWindowCheckTool.execute;
export default foodSupplierCertificateValidWindowCheckTool;
