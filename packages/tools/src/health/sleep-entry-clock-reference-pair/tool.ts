import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localStart: number;
  readonly localEnd: number;
  readonly startOffset: number;
  readonly endOffset: number;
};
export type Output = {
  readonly localMinutes: number;
  readonly elapsedMinutes: number;
  readonly offsetChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localStart: { type: "integer" },
    localEnd: { type: "integer" },
    startOffset: { type: "integer", minimum: -1439, maximum: 1439 },
    endOffset: { type: "integer", minimum: -1439, maximum: 1439 },
  },
  required: ["localStart", "localEnd", "startOffset", "endOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localMinutes: { type: "integer" },
    elapsedMinutes: { type: "integer" },
    offsetChange: { type: "integer" },
  },
  required: ["localMinutes", "elapsedMinutes", "offsetChange"],
} as const;
/** Use explicit serial local minute coordinates across a sleep interval; offsets establish elapsed time without a time-zone lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localStart, localEnd, startOffset, endOffset } = request;
  const compute = (): Output => {
    H.integer(startOffset, -1439, 1439);
    H.integer(endOffset, -1439, 1439);
    const localMinutes = localEnd - localStart,
      offsetChange = endOffset - startOffset;
    return {
      localMinutes,
      elapsedMinutes: localMinutes - offsetChange,
      offsetChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localStart: 1320, localEnd: 1800, startOffset: 120, endOffset: 60 },
  output: { localMinutes: 480, elapsedMinutes: 540, offsetChange: -60 },
} satisfies ToolExample<Input, Output>;
export const sleepEntryClockReferencePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/sleep-entry-clock-reference-pair",
    title: "Sleep Entry Clock Reference Pair Tool",
    description:
      "Use explicit serial local minute coordinates across a sleep interval; offsets establish elapsed time without a time-zone lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localStart: { type: "integer" },
        localEnd: { type: "integer" },
        startOffset: { type: "integer", minimum: -1439, maximum: 1439 },
        endOffset: { type: "integer", minimum: -1439, maximum: 1439 },
      },
      required: ["localStart", "localEnd", "startOffset", "endOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localMinutes: { type: "integer" },
        elapsedMinutes: { type: "integer" },
        offsetChange: { type: "integer" },
      },
      required: ["localMinutes", "elapsedMinutes", "offsetChange"],
    },
    ports: {
      inputs: [
        {
          id: "localStart",
          label: "Local Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "localEnd",
          label: "Local End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startOffset",
          label: "Start Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endOffset",
          label: "End Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "localMinutes",
          label: "Local Minutes",
          valueType: { type: "integer" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "integer" },
        },
        {
          id: "offsetChange",
          label: "Offset Change",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sleepEntryClockReferencePairTool.execute;
export default sleepEntryClockReferencePairTool;
