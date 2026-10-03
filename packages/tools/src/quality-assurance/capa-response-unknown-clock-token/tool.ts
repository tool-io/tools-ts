import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openedTime: number;
  readonly responseTime: number;
  readonly responseKnown: boolean;
  readonly targetDuration: number;
};
export type Output = {
  readonly elapsedDefined: boolean;
  readonly elapsed: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openedTime: { type: "number" },
    responseTime: { type: "number" },
    responseKnown: { type: "boolean" },
    targetDuration: { type: "number" },
  },
  required: ["openedTime", "responseTime", "responseKnown", "targetDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDefined: { type: "boolean" },
    elapsed: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["elapsedDefined", "elapsed", "remaining"],
} as const;
/** Preserve missing administrative response clocks with explicit definition flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openedTime, responseTime, responseKnown, targetDuration } = request;
  const compute = (): Output => {
    H.domain(
      targetDuration >= 0 && (!responseKnown || responseTime >= openedTime),
    );
    return {
      elapsedDefined: responseKnown,
      elapsed: responseKnown ? responseTime - openedTime : 0,
      remaining: responseKnown
        ? targetDuration - (responseTime - openedTime)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openedTime: 10,
    responseTime: 18,
    responseKnown: true,
    targetDuration: 10,
  },
  output: { elapsedDefined: true, elapsed: 8, remaining: 2 },
} satisfies ToolExample<Input, Output>;
export const capaResponseUnknownClockTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/capa-response-unknown-clock-token",
    title: "CAPA Response Unknown Clock Token Tool",
    description:
      "Preserve missing administrative response clocks with explicit definition flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openedTime: { type: "number" },
        responseTime: { type: "number" },
        responseKnown: { type: "boolean" },
        targetDuration: { type: "number" },
      },
      required: [
        "openedTime",
        "responseTime",
        "responseKnown",
        "targetDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDefined: { type: "boolean" },
        elapsed: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["elapsedDefined", "elapsed", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "openedTime",
          label: "Opened Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseKnown",
          label: "Response Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "targetDuration",
          label: "Target Duration",
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
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capaResponseUnknownClockTokenTool.execute;
export default capaResponseUnknownClockTokenTool;
