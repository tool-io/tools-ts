import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnsetDay: number;
  readonly secondOnsetDay: number;
  readonly firstUncertaintyDays: number;
  readonly secondUncertaintyDays: number;
};
export type Output = {
  readonly nominalDays: number;
  readonly minimumDays: number;
  readonly maximumDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnsetDay: { type: "integer" },
    secondOnsetDay: { type: "integer" },
    firstUncertaintyDays: { type: "integer", minimum: 0 },
    secondUncertaintyDays: { type: "integer", minimum: 0 },
  },
  required: [
    "firstOnsetDay",
    "secondOnsetDay",
    "firstUncertaintyDays",
    "secondUncertaintyDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDays: { type: "integer" },
    minimumDays: { type: "integer" },
    maximumDays: { type: "integer" },
  },
  required: ["nominalDays", "minimumDays", "maximumDays"],
} as const;
/** Report one supplied onset interval with explicit date uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstOnsetDay,
    secondOnsetDay,
    firstUncertaintyDays,
    secondUncertaintyDays,
  } = request;
  const compute = (): Output => {
    H.domain(secondOnsetDay >= firstOnsetDay, "secondOnsetDay");
    H.integer(firstUncertaintyDays, 0);
    H.integer(secondUncertaintyDays, 0);
    return {
      nominalDays: secondOnsetDay - firstOnsetDay,
      minimumDays:
        secondOnsetDay -
        firstOnsetDay -
        firstUncertaintyDays -
        secondUncertaintyDays,
      maximumDays:
        secondOnsetDay -
        firstOnsetDay +
        firstUncertaintyDays +
        secondUncertaintyDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOnsetDay: 100,
    secondOnsetDay: 128,
    firstUncertaintyDays: 1,
    secondUncertaintyDays: 2,
  },
  output: { nominalDays: 28, minimumDays: 25, maximumDays: 31 },
} satisfies ToolExample<Input, Output>;
export const menstrualDiaryCycleLengthOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/menstrual-diary-cycle-length-one-pair",
    title: "Menstrual Diary Cycle Length One Pair Tool",
    description:
      "Report one supplied onset interval with explicit date uncertainty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnsetDay: { type: "integer" },
        secondOnsetDay: { type: "integer" },
        firstUncertaintyDays: { type: "integer", minimum: 0 },
        secondUncertaintyDays: { type: "integer", minimum: 0 },
      },
      required: [
        "firstOnsetDay",
        "secondOnsetDay",
        "firstUncertaintyDays",
        "secondUncertaintyDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDays: { type: "integer" },
        minimumDays: { type: "integer" },
        maximumDays: { type: "integer" },
      },
      required: ["nominalDays", "minimumDays", "maximumDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstOnsetDay",
          label: "First Onset Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOnsetDay",
          label: "Second Onset Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstUncertaintyDays",
          label: "First Uncertainty Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondUncertaintyDays",
          label: "Second Uncertainty Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalDays",
          label: "Nominal Days",
          valueType: { type: "integer" },
        },
        {
          id: "minimumDays",
          label: "Minimum Days",
          valueType: { type: "integer" },
        },
        {
          id: "maximumDays",
          label: "Maximum Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = menstrualDiaryCycleLengthOnePairTool.execute;
export default menstrualDiaryCycleLengthOnePairTool;
