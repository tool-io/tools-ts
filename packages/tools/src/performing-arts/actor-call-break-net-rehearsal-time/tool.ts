import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callStartMinutes: number;
  readonly callEndMinutes: number;
  readonly breakMinutes: number;
};
export type Output = {
  readonly elapsedMinutes: number;
  readonly netRehearsalMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callStartMinutes: { type: "number" },
    callEndMinutes: { type: "number" },
    breakMinutes: { type: "number", minimum: 0 },
  },
  required: ["callStartMinutes", "callEndMinutes", "breakMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedMinutes: { type: "number" },
    netRehearsalMinutes: { type: "number" },
  },
  required: ["elapsedMinutes", "netRehearsalMinutes"],
} as const;
/** Subtract explicit breaks from an actor call interval without applying labor or rehearsal rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callStartMinutes, callEndMinutes, breakMinutes } = request;
  const compute = (): Output => {
    H.domain(callEndMinutes >= callStartMinutes, "callEndMinutes");
    H.domain(
      breakMinutes >= 0 && breakMinutes <= callEndMinutes - callStartMinutes,
      "breakMinutes",
    );
    return {
      elapsedMinutes: callEndMinutes - callStartMinutes,
      netRehearsalMinutes: callEndMinutes - callStartMinutes - breakMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { callStartMinutes: 540, callEndMinutes: 660, breakMinutes: 15 },
  output: { elapsedMinutes: 120, netRehearsalMinutes: 105 },
} satisfies ToolExample<Input, Output>;
export const actorCallBreakNetRehearsalTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/actor-call-break-net-rehearsal-time",
    title: "Actor Call Break Net Rehearsal Time",
    description:
      "Subtract explicit breaks from an actor call interval without applying labor or rehearsal rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callStartMinutes: { type: "number" },
        callEndMinutes: { type: "number" },
        breakMinutes: { type: "number", minimum: 0 },
      },
      required: ["callStartMinutes", "callEndMinutes", "breakMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedMinutes: { type: "number" },
        netRehearsalMinutes: { type: "number" },
      },
      required: ["elapsedMinutes", "netRehearsalMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "callStartMinutes",
          label: "Call Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "callEndMinutes",
          label: "Call End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "number" },
        },
        {
          id: "netRehearsalMinutes",
          label: "Net Rehearsal Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = actorCallBreakNetRehearsalTimeTool.execute;
export default actorCallBreakNetRehearsalTimeTool;
