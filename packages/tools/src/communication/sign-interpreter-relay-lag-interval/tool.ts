import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceStart: number;
  readonly sourceEnd: number;
  readonly interpretedStart: number;
  readonly interpretedEnd: number;
};
export type Output = {
  readonly startLag: number;
  readonly endLag: number;
  readonly stretch: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceStart: { type: "number" },
    sourceEnd: { type: "number" },
    interpretedStart: { type: "number" },
    interpretedEnd: { type: "number" },
  },
  required: ["sourceStart", "sourceEnd", "interpretedStart", "interpretedEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startLag: { type: "number" },
    endLag: { type: "number" },
    stretch: { type: "number" },
  },
  required: ["startLag", "endLag", "stretch"],
} as const;
/** Calculate sign interpreter relay lag interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceStart, sourceEnd, interpretedStart, interpretedEnd } = request;
  const compute = (): Output => {
    H.domain(sourceEnd > sourceStart && interpretedEnd >= interpretedStart);
    return {
      startLag: interpretedStart - sourceStart,
      endLag: interpretedEnd - sourceEnd,
      stretch: (interpretedEnd - interpretedStart) / (sourceEnd - sourceStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceStart: 10,
    sourceEnd: 20,
    interpretedStart: 12,
    interpretedEnd: 23,
  },
  output: { startLag: 2, endLag: 3, stretch: 1.1 },
} satisfies ToolExample<Input, Output>;
export const signInterpreterRelayLagIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/sign-interpreter-relay-lag-interval",
    title: "Sign Interpreter Relay Lag Interval Tool",
    description:
      "Calculate sign interpreter relay lag interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceStart: { type: "number" },
        sourceEnd: { type: "number" },
        interpretedStart: { type: "number" },
        interpretedEnd: { type: "number" },
      },
      required: [
        "sourceStart",
        "sourceEnd",
        "interpretedStart",
        "interpretedEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startLag: { type: "number" },
        endLag: { type: "number" },
        stretch: { type: "number" },
      },
      required: ["startLag", "endLag", "stretch"],
    },
    ports: {
      inputs: [
        {
          id: "sourceStart",
          label: "Source Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceEnd",
          label: "Source End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interpretedStart",
          label: "Interpreted Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interpretedEnd",
          label: "Interpreted End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "startLag", label: "Start Lag", valueType: { type: "number" } },
        { id: "endLag", label: "End Lag", valueType: { type: "number" } },
        { id: "stretch", label: "Stretch", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signInterpreterRelayLagIntervalTool.execute;
export default signInterpreterRelayLagIntervalTool;
