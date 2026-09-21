import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstClock: string;
  readonly secondClock: string;
  readonly firstOffset: number;
  readonly secondOffset: number;
  readonly firstTime: number;
  readonly secondTime: number;
};
export type Output = {
  readonly sameSource: boolean;
  readonly correctedGap: number;
  readonly rawGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstClock: { type: "string", maxLength: 8192 },
    secondClock: { type: "string", maxLength: 8192 },
    firstOffset: { type: "number" },
    secondOffset: { type: "number" },
    firstTime: { type: "number" },
    secondTime: { type: "number" },
  },
  required: [
    "firstClock",
    "secondClock",
    "firstOffset",
    "secondOffset",
    "firstTime",
    "secondTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSource: { type: "boolean" },
    correctedGap: { type: "number" },
    rawGap: { type: "number" },
  },
  required: ["sameSource", "correctedGap", "rawGap"],
} as const;
/** Compare supplied clock identity and common-reference offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstClock,
    secondClock,
    firstOffset,
    secondOffset,
    firstTime,
    secondTime,
  } = request;
  const compute = (): Output => {
    H.domain(firstClock.length > 0 && secondClock.length > 0, "firstClock");
    return {
      sameSource: firstClock === secondClock,
      correctedGap: secondTime - secondOffset - (firstTime - firstOffset),
      rawGap: secondTime - firstTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstClock: "monitor-A",
    secondClock: "logger-B",
    firstOffset: 2,
    secondOffset: -1,
    firstTime: 100,
    secondTime: 104,
  },
  output: { sameSource: false, correctedGap: 7, rawGap: 4 },
} satisfies ToolExample<Input, Output>;
export const perioperativeDatasetClockSourcePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/perioperative-dataset-clock-source-pair",
      title: "Perioperative Dataset Clock Source Pair Tool",
      description:
        "Compare supplied clock identity and common-reference offsets.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstClock: { type: "string", maxLength: 8192 },
          secondClock: { type: "string", maxLength: 8192 },
          firstOffset: { type: "number" },
          secondOffset: { type: "number" },
          firstTime: { type: "number" },
          secondTime: { type: "number" },
        },
        required: [
          "firstClock",
          "secondClock",
          "firstOffset",
          "secondOffset",
          "firstTime",
          "secondTime",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameSource: { type: "boolean" },
          correctedGap: { type: "number" },
          rawGap: { type: "number" },
        },
        required: ["sameSource", "correctedGap", "rawGap"],
      },
      ports: {
        inputs: [
          {
            id: "firstClock",
            label: "First Clock",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondClock",
            label: "Second Clock",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstOffset",
            label: "First Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondOffset",
            label: "Second Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstTime",
            label: "First Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondTime",
            label: "Second Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sameSource",
            label: "Same Source",
            valueType: { type: "boolean" },
          },
          {
            id: "correctedGap",
            label: "Corrected Gap",
            valueType: { type: "number" },
          },
          { id: "rawGap", label: "Raw Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = perioperativeDatasetClockSourcePairTool.execute;
export default perioperativeDatasetClockSourcePairTool;
