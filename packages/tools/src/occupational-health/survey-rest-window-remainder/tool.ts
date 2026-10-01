import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restWindow: number;
  readonly elapsed: number;
  readonly suppliedInterruptions: number;
};
export type Output = {
  readonly creditedRest: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restWindow: { type: "number", minimum: 0 },
    elapsed: { type: "number", minimum: 0 },
    suppliedInterruptions: { type: "number", minimum: 0 },
  },
  required: ["restWindow", "elapsed", "suppliedInterruptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedRest: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["creditedRest", "remaining"],
} as const;
/** Administrative supplied rest-window ledger without determining sufficient rest or fitness for work. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restWindow, elapsed, suppliedInterruptions } = request;
  const compute = (): Output => {
    H.domain(
      restWindow >= 0 &&
        elapsed >= 0 &&
        suppliedInterruptions >= 0 &&
        suppliedInterruptions <= elapsed,
    );
    return {
      creditedRest: elapsed - suppliedInterruptions,
      remaining: restWindow - elapsed + suppliedInterruptions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restWindow: 30, elapsed: 20, suppliedInterruptions: 5 },
  output: { creditedRest: 15, remaining: 15 },
} satisfies ToolExample<Input, Output>;
export const surveyRestWindowRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/survey-rest-window-remainder",
    title: "Survey Rest Window Remainder Tool",
    description:
      "Administrative supplied rest-window ledger without determining sufficient rest or fitness for work.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restWindow: { type: "number", minimum: 0 },
        elapsed: { type: "number", minimum: 0 },
        suppliedInterruptions: { type: "number", minimum: 0 },
      },
      required: ["restWindow", "elapsed", "suppliedInterruptions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedRest: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["creditedRest", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "restWindow",
          label: "Rest Window",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInterruptions",
          label: "Supplied Interruptions",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedRest",
          label: "Credited Rest",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surveyRestWindowRemainderTool.execute;
export default surveyRestWindowRemainderTool;
