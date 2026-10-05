import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitStartMinute: number;
  readonly visitEndMinute: number;
  readonly opensMinute: number;
  readonly closesMinute: number;
};
export type Output = {
  readonly entireVisitWithinOpening: boolean;
  readonly overlapMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitStartMinute: { type: "integer", minimum: 0 },
    visitEndMinute: { type: "integer" },
    opensMinute: { type: "integer", minimum: 0 },
    closesMinute: { type: "integer" },
  },
  required: [
    "visitStartMinute",
    "visitEndMinute",
    "opensMinute",
    "closesMinute",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entireVisitWithinOpening: { type: "boolean" },
    overlapMinutes: { type: "integer" },
  },
  required: ["entireVisitWithinOpening", "overlapMinutes"],
} as const;
/** Compare one visit with one explicit opening interval on a shared local minute timeline; no holiday or schedule lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitStartMinute, visitEndMinute, opensMinute, closesMinute } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(visitStartMinute) &&
        visitStartMinute >= 0 &&
        visitStartMinute <= Number.MAX_SAFE_INTEGER,
      "visitStartMinute",
    ),
      visitStartMinute);
    (H.domain(
      Number.isSafeInteger(visitEndMinute) &&
        visitEndMinute >= visitStartMinute &&
        visitEndMinute <= Number.MAX_SAFE_INTEGER,
      "visitEndMinute",
    ),
      visitEndMinute);
    (H.domain(
      Number.isSafeInteger(opensMinute) &&
        opensMinute >= 0 &&
        opensMinute <= Number.MAX_SAFE_INTEGER,
      "opensMinute",
    ),
      opensMinute);
    (H.domain(
      Number.isSafeInteger(closesMinute) &&
        closesMinute >= opensMinute &&
        closesMinute <= Number.MAX_SAFE_INTEGER,
      "closesMinute",
    ),
      closesMinute);
    return {
      entireVisitWithinOpening:
        visitStartMinute >= opensMinute && visitEndMinute <= closesMinute,
      overlapMinutes: Math.max(
        0,
        Math.min(visitEndMinute, closesMinute) -
          Math.max(visitStartMinute, opensMinute),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitStartMinute: 600,
    visitEndMinute: 660,
    opensMinute: 540,
    closesMinute: 1020,
  },
  output: { entireVisitWithinOpening: true, overlapMinutes: 60 },
} satisfies ToolExample<Input, Output>;
export const tourStopOpeningIntervalMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/tour-stop-opening-interval-match",
    title: "Tour Stop Opening Interval Match Tool",
    description:
      "Compare one visit with one explicit opening interval on a shared local minute timeline; no holiday or schedule lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitStartMinute: { type: "integer", minimum: 0 },
        visitEndMinute: { type: "integer" },
        opensMinute: { type: "integer", minimum: 0 },
        closesMinute: { type: "integer" },
      },
      required: [
        "visitStartMinute",
        "visitEndMinute",
        "opensMinute",
        "closesMinute",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entireVisitWithinOpening: { type: "boolean" },
        overlapMinutes: { type: "integer" },
      },
      required: ["entireVisitWithinOpening", "overlapMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "visitStartMinute",
          label: "Visit Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visitEndMinute",
          label: "Visit End Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "opensMinute",
          label: "Opens Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closesMinute",
          label: "Closes Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "entireVisitWithinOpening",
          label: "Entire Visit Within Opening",
          valueType: { type: "boolean" },
        },
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tourStopOpeningIntervalMatchTool.execute;
export default tourStopOpeningIntervalMatchTool;
