import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly events: number; readonly exposure: number };
export type Output = {
  readonly rateDefined: boolean;
  readonly rate: number;
  readonly logRateDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    exposure: { type: "number", minimum: 0 },
  },
  required: ["events", "exposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateDefined: { type: "boolean" },
    rate: { type: "number" },
    logRateDefined: { type: "boolean" },
  },
  required: ["rateDefined", "rate", "logRateDefined"],
} as const;
/** Distinguish a defined zero event rate from an undefined logarithm or zero exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, exposure } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.domain(exposure >= 0);
    return {
      rateDefined: exposure > 0,
      rate: exposure > 0 ? events / exposure : 0,
      logRateDefined: exposure > 0 && events > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 0, exposure: 100 },
  output: { rateDefined: true, rate: 0, logRateDefined: false },
} satisfies ToolExample<Input, Output>;
export const trialStratumZeroEventDomainTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/trial-stratum-zero-event-domain",
    title: "Trial Stratum Zero Event Domain Tool",
    description:
      "Distinguish a defined zero event rate from an undefined logarithm or zero exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        exposure: { type: "number", minimum: 0 },
      },
      required: ["events", "exposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rateDefined: { type: "boolean" },
        rate: { type: "number" },
        logRateDefined: { type: "boolean" },
      },
      required: ["rateDefined", "rate", "logRateDefined"],
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
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rateDefined",
          label: "Rate Defined",
          valueType: { type: "boolean" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "logRateDefined",
          label: "Log Rate Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialStratumZeroEventDomainTool.execute;
export default trialStratumZeroEventDomainTool;
