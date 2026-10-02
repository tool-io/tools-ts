import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly suppliedGapAllowance: number;
  readonly inclusiveEnd: boolean;
};
export type Output = {
  readonly uncoveredDays: number;
  readonly beyondAllowance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "integer" },
    nextStart: { type: "integer" },
    suppliedGapAllowance: { type: "integer", minimum: 0 },
    inclusiveEnd: { type: "boolean" },
  },
  required: [
    "previousEnd",
    "nextStart",
    "suppliedGapAllowance",
    "inclusiveEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncoveredDays: { type: "integer" },
    beyondAllowance: { type: "integer" },
  },
  required: ["uncoveredDays", "beyondAllowance"],
} as const;
/** Audit supplied administrative exposure-record gaps under explicit day-end/allowance conventions without inferring medicine use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart, suppliedGapAllowance, inclusiveEnd } =
    request;
  const compute = (): Output => {
    H.integer(suppliedGapAllowance, 0);
    return {
      uncoveredDays: Math.max(
        0,
        nextStart - previousEnd - (inclusiveEnd ? 1 : 0),
      ),
      beyondAllowance:
        Math.max(0, nextStart - previousEnd - (inclusiveEnd ? 1 : 0)) -
        suppliedGapAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEnd: 10,
    nextStart: 15,
    suppliedGapAllowance: 2,
    inclusiveEnd: true,
  },
  output: { uncoveredDays: 4, beyondAllowance: 2 },
} satisfies ToolExample<Input, Output>;
export const drugExposureGapAllowanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/drug-exposure-gap-allowance",
    title: "Drug Exposure Gap Allowance Tool",
    description:
      "Audit supplied administrative exposure-record gaps under explicit day-end/allowance conventions without inferring medicine use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "integer" },
        nextStart: { type: "integer" },
        suppliedGapAllowance: { type: "integer", minimum: 0 },
        inclusiveEnd: { type: "boolean" },
      },
      required: [
        "previousEnd",
        "nextStart",
        "suppliedGapAllowance",
        "inclusiveEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncoveredDays: { type: "integer" },
        beyondAllowance: { type: "integer" },
      },
      required: ["uncoveredDays", "beyondAllowance"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedGapAllowance",
          label: "Supplied Gap Allowance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusiveEnd",
          label: "Inclusive End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "uncoveredDays",
          label: "Uncovered Days",
          valueType: { type: "integer" },
        },
        {
          id: "beyondAllowance",
          label: "Beyond Allowance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = drugExposureGapAllowanceTool.execute;
export default drugExposureGapAllowanceTool;
