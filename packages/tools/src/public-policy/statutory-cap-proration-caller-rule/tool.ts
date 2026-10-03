import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullCap: number;
  readonly eligibleDays: number;
  readonly periodDays: number;
  readonly roundDown: boolean;
};
export type Output = { readonly rawCap: number; readonly appliedCap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullCap: { type: "number", minimum: 0 },
    eligibleDays: { type: "integer", minimum: 0 },
    periodDays: { type: "integer", minimum: 1 },
    roundDown: { type: "boolean" },
  },
  required: ["fullCap", "eligibleDays", "periodDays", "roundDown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawCap: { type: "number" }, appliedCap: { type: "number" } },
  required: ["rawCap", "appliedCap"],
} as const;
/** Caller supplies cap, day basis and whole-unit rounding convention; no statute is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullCap, eligibleDays, periodDays, roundDown } = request;
  const compute = (): Output => {
    H.domain(fullCap >= 0);
    H.integer(periodDays, 1);
    H.integer(eligibleDays, 0, periodDays);
    return {
      rawCap: (fullCap * eligibleDays) / periodDays,
      appliedCap: roundDown
        ? Math.floor((fullCap * eligibleDays) / periodDays)
        : (fullCap * eligibleDays) / periodDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullCap: 100, eligibleDays: 10, periodDays: 30, roundDown: true },
  output: { rawCap: 33.333333333333336, appliedCap: 33 },
} satisfies ToolExample<Input, Output>;
export const statutoryCapProrationCallerRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/statutory-cap-proration-caller-rule",
    title: "Statutory Cap Proration Caller Rule Tool",
    description:
      "Caller supplies cap, day basis and whole-unit rounding convention; no statute is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullCap: { type: "number", minimum: 0 },
        eligibleDays: { type: "integer", minimum: 0 },
        periodDays: { type: "integer", minimum: 1 },
        roundDown: { type: "boolean" },
      },
      required: ["fullCap", "eligibleDays", "periodDays", "roundDown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawCap: { type: "number" },
        appliedCap: { type: "number" },
      },
      required: ["rawCap", "appliedCap"],
    },
    ports: {
      inputs: [
        {
          id: "fullCap",
          label: "Full Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleDays",
          label: "Eligible Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodDays",
          label: "Period Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "roundDown",
          label: "Round Down",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "rawCap", label: "Raw Cap", valueType: { type: "number" } },
        {
          id: "appliedCap",
          label: "Applied Cap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = statutoryCapProrationCallerRuleTool.execute;
export default statutoryCapProrationCallerRuleTool;
