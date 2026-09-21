import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSource: string;
  readonly endSource: string;
  readonly startTime: number;
  readonly endTime: number;
  readonly suppliedEndOffset: number;
  readonly offsetKnown: boolean;
};
export type Output = {
  readonly sameSource: boolean;
  readonly durationDefined: boolean;
  readonly duration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSource: { type: "string", maxLength: 8192 },
    endSource: { type: "string", maxLength: 8192 },
    startTime: { type: "number" },
    endTime: { type: "number" },
    suppliedEndOffset: { type: "number" },
    offsetKnown: { type: "boolean" },
  },
  required: [
    "startSource",
    "endSource",
    "startTime",
    "endTime",
    "suppliedEndOffset",
    "offsetKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSource: { type: "boolean" },
    durationDefined: { type: "boolean" },
    duration: { type: "number" },
  },
  required: ["sameSource", "durationDefined", "duration"],
} as const;
/** Compare supplied clock-source metadata and an explicit end-clock offset; no synchronization is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    startSource,
    endSource,
    startTime,
    endTime,
    suppliedEndOffset,
    offsetKnown,
  } = request;
  const compute = (): Output => {
    const sameSource = startSource === endSource,
      durationDefined = sameSource || offsetKnown;
    return {
      sameSource,
      durationDefined,
      duration: durationDefined
        ? endTime - (sameSource ? 0 : suppliedEndOffset) - startTime
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startSource: "A",
    endSource: "B",
    startTime: 10,
    endTime: 30,
    suppliedEndOffset: 5,
    offsetKnown: true,
  },
  output: { sameSource: false, durationDefined: true, duration: 15 },
} satisfies ToolExample<Input, Output>;
export const farmTaskClockSourceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-task-clock-source-flag",
    title: "Farm Task Clock Source Flag Tool",
    description:
      "Compare supplied clock-source metadata and an explicit end-clock offset; no synchronization is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSource: { type: "string", maxLength: 8192 },
        endSource: { type: "string", maxLength: 8192 },
        startTime: { type: "number" },
        endTime: { type: "number" },
        suppliedEndOffset: { type: "number" },
        offsetKnown: { type: "boolean" },
      },
      required: [
        "startSource",
        "endSource",
        "startTime",
        "endTime",
        "suppliedEndOffset",
        "offsetKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameSource: { type: "boolean" },
        durationDefined: { type: "boolean" },
        duration: { type: "number" },
      },
      required: ["sameSource", "durationDefined", "duration"],
    },
    ports: {
      inputs: [
        {
          id: "startSource",
          label: "Start Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endSource",
          label: "End Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startTime",
          label: "Start Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endTime",
          label: "End Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEndOffset",
          label: "Supplied End Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sameSource",
          label: "Same Source",
          valueType: { type: "boolean" },
        },
        {
          id: "durationDefined",
          label: "Duration Defined",
          valueType: { type: "boolean" },
        },
        { id: "duration", label: "Duration", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmTaskClockSourceFlagTool.execute;
export default farmTaskClockSourceFlagTool;
