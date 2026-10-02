import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDay: number;
  readonly endDay: number;
  readonly suppliedOffsetDays: number;
  readonly creditedOverlapDays: number;
};
export type Output = {
  readonly shiftedStart: number;
  readonly shiftedEnd: number;
  readonly creditedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDay: { type: "integer" },
    endDay: { type: "integer" },
    suppliedOffsetDays: { type: "integer" },
    creditedOverlapDays: { type: "integer", minimum: 0 },
  },
  required: ["startDay", "endDay", "suppliedOffsetDays", "creditedOverlapDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedStart: { type: "integer" },
    shiftedEnd: { type: "integer" },
    creditedDays: { type: "integer" },
  },
  required: ["shiftedStart", "shiftedEnd", "creditedDays"],
} as const;
/** Shift supplied half-open record episodes and remove explicitly supplied overlap credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDay, endDay, suppliedOffsetDays, creditedOverlapDays } = request;
  const compute = (): Output => {
    H.domain(endDay >= startDay);
    H.integer(creditedOverlapDays, 0, endDay - startDay);
    return {
      shiftedStart: startDay + suppliedOffsetDays,
      shiftedEnd: endDay + suppliedOffsetDays,
      creditedDays: endDay - startDay - creditedOverlapDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startDay: 10,
    endDay: 30,
    suppliedOffsetDays: 2,
    creditedOverlapDays: 5,
  },
  output: { shiftedStart: 12, shiftedEnd: 32, creditedDays: 15 },
} satisfies ToolExample<Input, Output>;
export const exposureEpisodeOffsetCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/exposure-episode-offset-credit",
    title: "Exposure Episode Offset Credit Tool",
    description:
      "Shift supplied half-open record episodes and remove explicitly supplied overlap credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDay: { type: "integer" },
        endDay: { type: "integer" },
        suppliedOffsetDays: { type: "integer" },
        creditedOverlapDays: { type: "integer", minimum: 0 },
      },
      required: [
        "startDay",
        "endDay",
        "suppliedOffsetDays",
        "creditedOverlapDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedStart: { type: "integer" },
        shiftedEnd: { type: "integer" },
        creditedDays: { type: "integer" },
      },
      required: ["shiftedStart", "shiftedEnd", "creditedDays"],
    },
    ports: {
      inputs: [
        {
          id: "startDay",
          label: "Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedOffsetDays",
          label: "Supplied Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "creditedOverlapDays",
          label: "Credited Overlap Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedStart",
          label: "Shifted Start",
          valueType: { type: "integer" },
        },
        {
          id: "shiftedEnd",
          label: "Shifted End",
          valueType: { type: "integer" },
        },
        {
          id: "creditedDays",
          label: "Credited Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureEpisodeOffsetCreditTool.execute;
export default exposureEpisodeOffsetCreditTool;
