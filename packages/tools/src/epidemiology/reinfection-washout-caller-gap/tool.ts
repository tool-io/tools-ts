import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousDay: number;
  readonly newDay: number;
  readonly washoutDays: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly gapDays: number;
  readonly meetsWashout: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousDay: { type: "integer" },
    newDay: { type: "integer" },
    washoutDays: { type: "integer", minimum: 0 },
    inclusive: { type: "boolean" },
  },
  required: ["previousDay", "newDay", "washoutDays", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapDays: { type: "integer" },
    meetsWashout: { type: "boolean" },
  },
  required: ["gapDays", "meetsWashout"],
} as const;
/** Apply a caller-supplied episode-spacing rule; no pathogen-specific reinfection definition is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousDay, newDay, washoutDays, inclusive } = request;
  const compute = (): Output => {
    H.integer(washoutDays, 0);
    H.domain(newDay >= previousDay);
    return {
      gapDays: newDay - previousDay,
      meetsWashout: inclusive
        ? newDay - previousDay >= washoutDays
        : newDay - previousDay > washoutDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousDay: 10, newDay: 100, washoutDays: 90, inclusive: true },
  output: { gapDays: 90, meetsWashout: true },
} satisfies ToolExample<Input, Output>;
export const reinfectionWashoutCallerGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/reinfection-washout-caller-gap",
    title: "Reinfection Washout Caller Gap Tool",
    description:
      "Apply a caller-supplied episode-spacing rule; no pathogen-specific reinfection definition is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousDay: { type: "integer" },
        newDay: { type: "integer" },
        washoutDays: { type: "integer", minimum: 0 },
        inclusive: { type: "boolean" },
      },
      required: ["previousDay", "newDay", "washoutDays", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDays: { type: "integer" },
        meetsWashout: { type: "boolean" },
      },
      required: ["gapDays", "meetsWashout"],
    },
    ports: {
      inputs: [
        {
          id: "previousDay",
          label: "Previous Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newDay",
          label: "New Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "washoutDays",
          label: "Washout Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
        {
          id: "meetsWashout",
          label: "Meets Washout",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = reinfectionWashoutCallerGapTool.execute;
export default reinfectionWashoutCallerGapTool;
