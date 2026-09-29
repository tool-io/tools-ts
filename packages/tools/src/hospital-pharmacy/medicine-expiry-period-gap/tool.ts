import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDate: string;
  readonly useWindowStart: string;
  readonly useWindowEnd: string;
  readonly expiryInclusive: boolean;
};
export type Output = {
  readonly daysToStart: number;
  readonly daysToEnd: number;
  readonly coversWholeWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDate: { type: "string", maxLength: 8192 },
    useWindowStart: { type: "string", maxLength: 8192 },
    useWindowEnd: { type: "string", maxLength: 8192 },
    expiryInclusive: { type: "boolean" },
  },
  required: ["expiryDate", "useWindowStart", "useWindowEnd", "expiryInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysToStart: { type: "integer" },
    daysToEnd: { type: "integer" },
    coversWholeWindow: { type: "boolean" },
  },
  required: ["daysToStart", "daysToEnd", "coversWholeWindow"],
} as const;
/** Compare explicit inventory expiry metadata with a supplied closed date window and equality rule; no use authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDate, useWindowStart, useWindowEnd, expiryInclusive } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(expiryDate).getTime(),
        b = H.dateOnly(useWindowStart).getTime(),
        c = H.dateOnly(useWindowEnd).getTime();
      H.domain(c >= b);
      return {
        daysToStart: (a - b) / 86400000,
        daysToEnd: (a - c) / 86400000,
        coversWholeWindow: expiryInclusive ? a >= c : a > c,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expiryDate: "2024-01-10",
    useWindowStart: "2024-01-01",
    useWindowEnd: "2024-01-08",
    expiryInclusive: false,
  },
  output: { daysToStart: 9, daysToEnd: 2, coversWholeWindow: true },
} satisfies ToolExample<Input, Output>;
export const medicineExpiryPeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-expiry-period-gap",
    title: "Medicine Expiry Period Gap Tool",
    description:
      "Compare explicit inventory expiry metadata with a supplied closed date window and equality rule; no use authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDate: { type: "string", maxLength: 8192 },
        useWindowStart: { type: "string", maxLength: 8192 },
        useWindowEnd: { type: "string", maxLength: 8192 },
        expiryInclusive: { type: "boolean" },
      },
      required: [
        "expiryDate",
        "useWindowStart",
        "useWindowEnd",
        "expiryInclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysToStart: { type: "integer" },
        daysToEnd: { type: "integer" },
        coversWholeWindow: { type: "boolean" },
      },
      required: ["daysToStart", "daysToEnd", "coversWholeWindow"],
    },
    ports: {
      inputs: [
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useWindowStart",
          label: "Use Window Start",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "useWindowEnd",
          label: "Use Window End",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryInclusive",
          label: "Expiry Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "daysToStart",
          label: "Days To Start",
          valueType: { type: "integer" },
        },
        {
          id: "daysToEnd",
          label: "Days To End",
          valueType: { type: "integer" },
        },
        {
          id: "coversWholeWindow",
          label: "Covers Whole Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineExpiryPeriodGapTool.execute;
export default medicineExpiryPeriodGapTool;
