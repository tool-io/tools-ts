import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callEnd: number;
  readonly responseStart: number;
  readonly cycleDuration: number;
};
export type Output = {
  readonly lag: number;
  readonly cyclePhase: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callEnd: { type: "number" },
    responseStart: { type: "number" },
    cycleDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["callEnd", "responseStart", "cycleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lag: { type: "number" },
    cyclePhase: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: ["lag", "cyclePhase", "overlap"],
} as const;
/** Calculate performance call response lag term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callEnd, responseStart, cycleDuration } = request;
  const compute = (): Output => {
    const modulo = (value: number, modulus: number): number => {
      const remainder = value % modulus;
      const positive = remainder < 0 ? remainder + modulus : remainder;
      return positive === modulus ? 0 : positive;
    };
    H.positive(cycleDuration);
    return {
      lag: responseStart - callEnd,
      cyclePhase:
        modulo(responseStart - callEnd, cycleDuration) / cycleDuration,
      overlap: responseStart < callEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { callEnd: 10, responseStart: 11, cycleDuration: 4 },
  output: { lag: 1, cyclePhase: 0.25, overlap: false },
} satisfies ToolExample<Input, Output>;
export const performanceCallResponseLagTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/performance-call-response-lag-term",
    title: "Performance Call Response Lag Term Tool",
    description:
      "Calculate performance call response lag term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callEnd: { type: "number" },
        responseStart: { type: "number" },
        cycleDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["callEnd", "responseStart", "cycleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lag: { type: "number" },
        cyclePhase: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["lag", "cyclePhase", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "callEnd",
          label: "Call End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseStart",
          label: "Response Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "number" } },
        {
          id: "cyclePhase",
          label: "Cycle Phase",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = performanceCallResponseLagTermTool.execute;
export default performanceCallResponseLagTermTool;
