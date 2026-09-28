import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDay: number;
  readonly joinedDay: number;
  readonly leftDay: number;
  readonly leftKnown: boolean;
  readonly includeLeaveDay: boolean;
};
export type Output = { readonly memberAtObservation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDay: { type: "integer" },
    joinedDay: { type: "integer" },
    leftDay: { type: "integer" },
    leftKnown: { type: "boolean" },
    includeLeaveDay: { type: "boolean" },
  },
  required: [
    "observationDay",
    "joinedDay",
    "leftDay",
    "leftKnown",
    "includeLeaveDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { memberAtObservation: { type: "boolean" } },
  required: ["memberAtObservation"],
} as const;
/** Membership of a supplied observation date under explicit series inclusion dates; no country/organization membership table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDay, joinedDay, leftDay, leftKnown, includeLeaveDay } =
    request;
  const compute = (): Output => {
    H.domain(!leftKnown || leftDay >= joinedDay);
    return {
      memberAtObservation:
        observationDay >= joinedDay &&
        (!leftKnown ||
          (includeLeaveDay
            ? observationDay <= leftDay
            : observationDay < leftDay)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationDay: 20,
    joinedDay: 10,
    leftDay: 20,
    leftKnown: true,
    includeLeaveDay: false,
  },
  output: { memberAtObservation: false },
} satisfies ToolExample<Input, Output>;
export const globalSeriesMembershipCutoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-series-membership-cutoff",
    title: "Global Series Membership Cutoff Tool",
    description:
      "Membership of a supplied observation date under explicit series inclusion dates; no country/organization membership table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDay: { type: "integer" },
        joinedDay: { type: "integer" },
        leftDay: { type: "integer" },
        leftKnown: { type: "boolean" },
        includeLeaveDay: { type: "boolean" },
      },
      required: [
        "observationDay",
        "joinedDay",
        "leftDay",
        "leftKnown",
        "includeLeaveDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { memberAtObservation: { type: "boolean" } },
      required: ["memberAtObservation"],
    },
    ports: {
      inputs: [
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "joinedDay",
          label: "Joined Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftDay",
          label: "Left Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftKnown",
          label: "Left Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLeaveDay",
          label: "Include Leave Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "memberAtObservation",
          label: "Member At Observation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = globalSeriesMembershipCutoffTool.execute;
export default globalSeriesMembershipCutoffTool;
