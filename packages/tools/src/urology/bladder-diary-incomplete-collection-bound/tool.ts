import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredVolume: number;
  readonly knownSpillVolume: number;
  readonly maximumUnmeasuredVolume: number;
};
export type Output = {
  readonly minimumTotal: number;
  readonly maximumTotal: number;
  readonly intervalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredVolume: { type: "number", minimum: 0 },
    knownSpillVolume: { type: "number", minimum: 0 },
    maximumUnmeasuredVolume: { type: "number", minimum: 0 },
  },
  required: ["measuredVolume", "knownSpillVolume", "maximumUnmeasuredVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumTotal: { type: "number" },
    maximumTotal: { type: "number" },
    intervalWidth: { type: "number" },
  },
  required: ["minimumTotal", "maximumTotal", "intervalWidth"],
} as const;
/** Explicit incomplete research collection bounds, without estimating an unknown spill or a physiological volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredVolume, knownSpillVolume, maximumUnmeasuredVolume } = request;
  const compute = (): Output => {
    H.domain(
      measuredVolume >= 0 &&
        knownSpillVolume >= 0 &&
        maximumUnmeasuredVolume >= 0,
    );
    return {
      minimumTotal: measuredVolume + knownSpillVolume,
      maximumTotal: measuredVolume + knownSpillVolume + maximumUnmeasuredVolume,
      intervalWidth: maximumUnmeasuredVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredVolume: 200,
    knownSpillVolume: 20,
    maximumUnmeasuredVolume: 50,
  },
  output: { minimumTotal: 220, maximumTotal: 270, intervalWidth: 50 },
} satisfies ToolExample<Input, Output>;
export const bladderDiaryIncompleteCollectionBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urology/bladder-diary-incomplete-collection-bound",
      title: "Bladder Diary Incomplete Collection Bound Tool",
      description:
        "Explicit incomplete research collection bounds, without estimating an unknown spill or a physiological volume.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredVolume: { type: "number", minimum: 0 },
          knownSpillVolume: { type: "number", minimum: 0 },
          maximumUnmeasuredVolume: { type: "number", minimum: 0 },
        },
        required: [
          "measuredVolume",
          "knownSpillVolume",
          "maximumUnmeasuredVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimumTotal: { type: "number" },
          maximumTotal: { type: "number" },
          intervalWidth: { type: "number" },
        },
        required: ["minimumTotal", "maximumTotal", "intervalWidth"],
      },
      ports: {
        inputs: [
          {
            id: "measuredVolume",
            label: "Measured Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "knownSpillVolume",
            label: "Known Spill Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumUnmeasuredVolume",
            label: "Maximum Unmeasured Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "minimumTotal",
            label: "Minimum Total",
            valueType: { type: "number" },
          },
          {
            id: "maximumTotal",
            label: "Maximum Total",
            valueType: { type: "number" },
          },
          {
            id: "intervalWidth",
            label: "Interval Width",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bladderDiaryIncompleteCollectionBoundTool.execute;
export default bladderDiaryIncompleteCollectionBoundTool;
