import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: string;
  readonly firstEndExclusive: string;
  readonly secondStart: string;
  readonly secondEndExclusive: string;
};
export type Output = { readonly overlapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "string", maxLength: 8192 },
    firstEndExclusive: { type: "string", maxLength: 8192 },
    secondStart: { type: "string", maxLength: 8192 },
    secondEndExclusive: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstStart",
    "firstEndExclusive",
    "secondStart",
    "secondEndExclusive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDays: { type: "integer" } },
  required: ["overlapDays"],
} as const;
/** Intersect supplied public tenure dates as half-open UTC civil-day intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEndExclusive, secondStart, secondEndExclusive } =
    request;
  const compute = (): Output => {
    H.domain(
      H.dateOnly(firstStart) <= H.dateOnly(firstEndExclusive) &&
        H.dateOnly(secondStart) <= H.dateOnly(secondEndExclusive),
    );
    return {
      overlapDays: Math.max(
        0,
        (Math.min(
          H.dateOnly(firstEndExclusive).getTime(),
          H.dateOnly(secondEndExclusive).getTime(),
        ) -
          Math.max(
            H.dateOnly(firstStart).getTime(),
            H.dateOnly(secondStart).getTime(),
          )) /
          86400000,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStart: "2024-01-01",
    firstEndExclusive: "2024-01-10",
    secondStart: "2024-01-05",
    secondEndExclusive: "2024-01-15",
  },
  output: { overlapDays: 5 },
} satisfies ToolExample<Input, Output>;
export const diplomaticTenureOverlapDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/diplomatic-tenure-overlap-days",
    title: "Diplomatic Tenure Overlap Days Tool",
    description:
      "Intersect supplied public tenure dates as half-open UTC civil-day intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "string", maxLength: 8192 },
        firstEndExclusive: { type: "string", maxLength: 8192 },
        secondStart: { type: "string", maxLength: 8192 },
        secondEndExclusive: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstStart",
        "firstEndExclusive",
        "secondStart",
        "secondEndExclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapDays: { type: "integer" } },
      required: ["overlapDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstEndExclusive",
          label: "First End Exclusive",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondEndExclusive",
          label: "Second End Exclusive",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = diplomaticTenureOverlapDaysTool.execute;
export default diplomaticTenureOverlapDaysTool;
