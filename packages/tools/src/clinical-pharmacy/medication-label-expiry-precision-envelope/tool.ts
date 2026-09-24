import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly firstDay: string;
  readonly lastDay: string;
  readonly precision: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDay: { type: "string", maxLength: 8192 },
    lastDay: { type: "string", maxLength: 8192 },
    precision: { type: "string", maxLength: 8192 },
  },
  required: ["firstDay", "lastDay", "precision"],
} as const;
/** Parse a supplied month/day expiry precision envelope without assigning product usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const year = Number(match[1]),
      month = Number(match[2]);
    H.integer(year, 1, 9999);
    H.integer(month, 1, 12);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0),
      days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
        month - 1
      ];
    if (match[3]) {
      H.integer(Number(match[3]), 1, days);
      return { firstDay: token, lastDay: token, precision: "day" };
    }
    return {
      firstDay: token + "-01",
      lastDay: token + "-" + days,
      precision: "month",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "2028-02" },
  output: { firstDay: "2028-02-01", lastDay: "2028-02-29", precision: "month" },
} satisfies ToolExample<Input, Output>;
export const medicationLabelExpiryPrecisionEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medication-label-expiry-precision-envelope",
      title: "Medication Label Expiry Precision Envelope Tool",
      description:
        "Parse a supplied month/day expiry precision envelope without assigning product usability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDay: { type: "string", maxLength: 8192 },
          lastDay: { type: "string", maxLength: 8192 },
          precision: { type: "string", maxLength: 8192 },
        },
        required: ["firstDay", "lastDay", "precision"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "firstDay", label: "First Day", valueType: { type: "string" } },
          { id: "lastDay", label: "Last Day", valueType: { type: "string" } },
          {
            id: "precision",
            label: "Precision",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicationLabelExpiryPrecisionEnvelopeTool.execute;
export default medicationLabelExpiryPrecisionEnvelopeTool;
