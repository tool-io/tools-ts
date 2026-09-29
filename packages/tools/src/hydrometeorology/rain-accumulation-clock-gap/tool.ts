import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gaugeStart: number;
  readonly gaugeEnd: number;
  readonly referenceStart: number;
  readonly referenceEnd: number;
};
export type Output = {
  readonly startGap: number;
  readonly endGap: number;
  readonly durationGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaugeStart: { type: "number" },
    gaugeEnd: { type: "number" },
    referenceStart: { type: "number" },
    referenceEnd: { type: "number" },
  },
  required: ["gaugeStart", "gaugeEnd", "referenceStart", "referenceEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startGap: { type: "number" },
    endGap: { type: "number" },
    durationGap: { type: "number" },
  },
  required: ["startGap", "endGap", "durationGap"],
} as const;
/** Calculate rain accumulation clock gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gaugeStart, gaugeEnd, referenceStart, referenceEnd } = request;
  const compute = (): Output => {
    H.domain(gaugeEnd >= gaugeStart && referenceEnd >= referenceStart);
    return {
      startGap: gaugeStart - referenceStart,
      endGap: gaugeEnd - referenceEnd,
      durationGap: gaugeEnd - gaugeStart - (referenceEnd - referenceStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gaugeStart: 1, gaugeEnd: 12, referenceStart: 0, referenceEnd: 10 },
  output: { startGap: 1, endGap: 2, durationGap: 1 },
} satisfies ToolExample<Input, Output>;
export const rainAccumulationClockGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rain-accumulation-clock-gap",
    title: "Rain Accumulation Clock Gap Tool",
    description:
      "Calculate rain accumulation clock gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaugeStart: { type: "number" },
        gaugeEnd: { type: "number" },
        referenceStart: { type: "number" },
        referenceEnd: { type: "number" },
      },
      required: ["gaugeStart", "gaugeEnd", "referenceStart", "referenceEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startGap: { type: "number" },
        endGap: { type: "number" },
        durationGap: { type: "number" },
      },
      required: ["startGap", "endGap", "durationGap"],
    },
    ports: {
      inputs: [
        {
          id: "gaugeStart",
          label: "Gauge Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gaugeEnd",
          label: "Gauge End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStart",
          label: "Reference Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEnd",
          label: "Reference End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "startGap", label: "Start Gap", valueType: { type: "number" } },
        { id: "endGap", label: "End Gap", valueType: { type: "number" } },
        {
          id: "durationGap",
          label: "Duration Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainAccumulationClockGapTool.execute;
export default rainAccumulationClockGapTool;
