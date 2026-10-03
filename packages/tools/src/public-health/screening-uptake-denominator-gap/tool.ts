import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attended: number;
  readonly invited: number;
  readonly excluded: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly uptake: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attended: { type: "integer", minimum: 0 },
    invited: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["attended", "invited", "excluded", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    uptake: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "uptake", "defined"],
} as const;
/** Audit supplied screening invitation/attendance records without defining screening eligibility or recommending screening. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attended, invited, excluded, excludeMarked } = request;
  const compute = (): Output => {
    H.integer(invited, 0);
    H.integer(excluded, 0, invited);
    H.integer(attended, 0, invited - excluded);
    return {
      denominator: invited - (excludeMarked ? excluded : 0),
      uptake:
        invited - (excludeMarked ? excluded : 0) > 0
          ? attended / (invited - (excludeMarked ? excluded : 0))
          : 0,
      defined: invited - (excludeMarked ? excluded : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attended: 60, invited: 100, excluded: 20, excludeMarked: true },
  output: { denominator: 80, uptake: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const screeningUptakeDenominatorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/screening-uptake-denominator-gap",
    title: "Screening Uptake Denominator Gap Tool",
    description:
      "Audit supplied screening invitation/attendance records without defining screening eligibility or recommending screening.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attended: { type: "integer", minimum: 0 },
        invited: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: ["attended", "invited", "excluded", "excludeMarked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        uptake: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "uptake", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "attended",
          label: "Attended",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "invited",
          label: "Invited",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "uptake", label: "Uptake", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = screeningUptakeDenominatorGapTool.execute;
export default screeningUptakeDenominatorGapTool;
