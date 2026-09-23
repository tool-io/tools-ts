import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly censors: number;
  readonly riskBefore: number;
  readonly eventFirst: boolean;
};
export type Output = {
  readonly eventDenominator: number;
  readonly survivalFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    censors: { type: "integer", minimum: 0 },
    riskBefore: { type: "integer", minimum: 1 },
    eventFirst: { type: "boolean" },
  },
  required: ["events", "censors", "riskBefore", "eventFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDenominator: { type: "integer" },
    survivalFactor: { type: "number" },
  },
  required: ["eventDenominator", "survivalFactor"],
} as const;
/** One supplied tied-time survival factor with explicit censor/event ordering, not a fitted survival curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, censors, riskBefore, eventFirst } = request;
  const compute = (): Output => {
    H.integer(riskBefore, 1);
    H.integer(events, 0, riskBefore);
    H.integer(censors, 0, riskBefore - events);
    const eventDenominator = riskBefore - (eventFirst ? 0 : censors);
    H.domain(eventDenominator > 0 || events === 0);
    return {
      eventDenominator,
      survivalFactor: events === 0 ? 1 : 1 - events / eventDenominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 2, censors: 3, riskBefore: 10, eventFirst: true },
  output: { eventDenominator: 10, survivalFactor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const survivalTieCensorOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/survival-tie-censor-order-token",
    title: "Survival Tie Censor Order Token Tool",
    description:
      "One supplied tied-time survival factor with explicit censor/event ordering, not a fitted survival curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        censors: { type: "integer", minimum: 0 },
        riskBefore: { type: "integer", minimum: 1 },
        eventFirst: { type: "boolean" },
      },
      required: ["events", "censors", "riskBefore", "eventFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventDenominator: { type: "integer" },
        survivalFactor: { type: "number" },
      },
      required: ["eventDenominator", "survivalFactor"],
    },
    ports: {
      inputs: [
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "censors",
          label: "Censors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "riskBefore",
          label: "Risk Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eventFirst",
          label: "Event First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "eventDenominator",
          label: "Event Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "survivalFactor",
          label: "Survival Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = survivalTieCensorOrderTokenTool.execute;
export default survivalTieCensorOrderTokenTool;
