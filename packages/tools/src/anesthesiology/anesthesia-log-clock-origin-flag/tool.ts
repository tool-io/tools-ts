import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localTime: number;
  readonly originTime: number;
  readonly originKnown: boolean;
  readonly suppliedOffset: number;
};
export type Output = {
  readonly elapsedDefined: boolean;
  readonly elapsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localTime: { type: "number" },
    originTime: { type: "number" },
    originKnown: { type: "boolean" },
    suppliedOffset: { type: "number" },
  },
  required: ["localTime", "originTime", "originKnown", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDefined: { type: "boolean" },
    elapsed: { type: "number" },
  },
  required: ["elapsedDefined", "elapsed"],
} as const;
/** Preserve a log-origin-known flag and explicit time offset without interpreting events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localTime, originTime, originKnown, suppliedOffset } = request;
  const compute = (): Output => {
    return {
      elapsedDefined: originKnown,
      elapsed: originKnown ? localTime - originTime + suppliedOffset : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localTime: 100,
    originTime: 20,
    originKnown: true,
    suppliedOffset: 5,
  },
  output: { elapsedDefined: true, elapsed: 85 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaLogClockOriginFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-log-clock-origin-flag",
    title: "Anesthesia Log Clock Origin Flag Tool",
    description:
      "Preserve a log-origin-known flag and explicit time offset without interpreting events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localTime: { type: "number" },
        originTime: { type: "number" },
        originKnown: { type: "boolean" },
        suppliedOffset: { type: "number" },
      },
      required: ["localTime", "originTime", "originKnown", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDefined: { type: "boolean" },
        elapsed: { type: "number" },
      },
      required: ["elapsedDefined", "elapsed"],
    },
    ports: {
      inputs: [
        {
          id: "localTime",
          label: "Local Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originTime",
          label: "Origin Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originKnown",
          label: "Origin Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedDefined",
          label: "Elapsed Defined",
          valueType: { type: "boolean" },
        },
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaLogClockOriginFlagTool.execute;
export default anesthesiaLogClockOriginFlagTool;
