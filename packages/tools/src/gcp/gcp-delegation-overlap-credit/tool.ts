import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly uniqueDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "integer" },
    firstEnd: { type: "integer" },
    secondStart: { type: "integer" },
    secondEnd: { type: "integer" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "integer" },
    uniqueDuration: { type: "integer" },
  },
  required: ["overlap", "uniqueDuration"],
} as const;
/** Half-open supplied delegation-window overlap arithmetic without inferring task authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstStart <= firstEnd && secondStart <= secondEnd);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      uniqueDuration:
        firstEnd -
        firstStart +
        secondEnd -
        secondStart -
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 10, secondStart: 5, secondEnd: 15 },
  output: { overlap: 5, uniqueDuration: 15 },
} satisfies ToolExample<Input, Output>;
export const gcpDelegationOverlapCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-delegation-overlap-credit",
    title: "GCP Delegation Overlap Credit Tool",
    description:
      "Half-open supplied delegation-window overlap arithmetic without inferring task authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "integer" },
        firstEnd: { type: "integer" },
        secondStart: { type: "integer" },
        secondEnd: { type: "integer" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "integer" },
        uniqueDuration: { type: "integer" },
      },
      required: ["overlap", "uniqueDuration"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "integer" } },
        {
          id: "uniqueDuration",
          label: "Unique Duration",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpDelegationOverlapCreditTool.execute;
export default gcpDelegationOverlapCreditTool;
