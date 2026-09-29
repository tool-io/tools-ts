import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDate: string;
  readonly referenceDate: string;
  readonly inclusiveExpiry: boolean;
};
export type Output = {
  readonly dayOffset: number;
  readonly currentUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDate: { type: "string", maxLength: 8192 },
    referenceDate: { type: "string", maxLength: 8192 },
    inclusiveExpiry: { type: "boolean" },
  },
  required: ["expiryDate", "referenceDate", "inclusiveExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayOffset: { type: "integer" },
    currentUnderRule: { type: "boolean" },
  },
  required: ["dayOffset", "currentUnderRule"],
} as const;
/** Compare an explicit inventory expiry date under a declared end-date rule without product stability advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDate, referenceDate, inclusiveExpiry } = request;
  const compute = (): Output => {
    return (() => {
      const dayOffset =
        (H.dateOnly(expiryDate).getTime() -
          H.dateOnly(referenceDate).getTime()) /
        86400000;
      return {
        dayOffset,
        currentUnderRule: inclusiveExpiry ? dayOffset >= 0 : dayOffset > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expiryDate: "2024-03-01",
    referenceDate: "2024-02-28",
    inclusiveExpiry: false,
  },
  output: { dayOffset: 2, currentUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const expiryReferenceDayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/expiry-reference-day-offset",
    title: "Expiry Reference Day Offset Tool",
    description:
      "Compare an explicit inventory expiry date under a declared end-date rule without product stability advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDate: { type: "string", maxLength: 8192 },
        referenceDate: { type: "string", maxLength: 8192 },
        inclusiveExpiry: { type: "boolean" },
      },
      required: ["expiryDate", "referenceDate", "inclusiveExpiry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayOffset: { type: "integer" },
        currentUnderRule: { type: "boolean" },
      },
      required: ["dayOffset", "currentUnderRule"],
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
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inclusiveExpiry",
          label: "Inclusive Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "dayOffset",
          label: "Day Offset",
          valueType: { type: "integer" },
        },
        {
          id: "currentUnderRule",
          label: "Current Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = expiryReferenceDayOffsetTool.execute;
export default expiryReferenceDayOffsetTool;
