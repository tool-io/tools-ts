import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedVolume: number;
  readonly aliquotedVolume: number;
  readonly consumedVolume: number;
  readonly discardedVolume: number;
  readonly recordedRetained: number;
};
export type Output = {
  readonly expectedRetained: number;
  readonly recordGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedVolume: { type: "number", minimum: 0 },
    aliquotedVolume: { type: "number", minimum: 0 },
    consumedVolume: { type: "number", minimum: 0 },
    discardedVolume: { type: "number", minimum: 0 },
    recordedRetained: { type: "number", minimum: 0 },
  },
  required: [
    "receivedVolume",
    "aliquotedVolume",
    "consumedVolume",
    "discardedVolume",
    "recordedRetained",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedRetained: { type: "number" },
    recordGap: { type: "number" },
  },
  required: ["expectedRetained", "recordGap"],
} as const;
/** Disjoint specimen-volume ledger, with no inference about sampling adequacy or specimen handling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    receivedVolume,
    aliquotedVolume,
    consumedVolume,
    discardedVolume,
    recordedRetained,
  } = request;
  const compute = (): Output => {
    H.domain(
      receivedVolume >= 0 &&
        aliquotedVolume >= 0 &&
        consumedVolume >= 0 &&
        discardedVolume >= 0 &&
        recordedRetained >= 0 &&
        aliquotedVolume + consumedVolume + discardedVolume <= receivedVolume,
    );
    return {
      expectedRetained:
        receivedVolume - aliquotedVolume - consumedVolume - discardedVolume,
      recordGap:
        recordedRetained -
        receivedVolume +
        aliquotedVolume +
        consumedVolume +
        discardedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    receivedVolume: 100,
    aliquotedVolume: 20,
    consumedVolume: 30,
    discardedVolume: 10,
    recordedRetained: 35,
  },
  output: { expectedRetained: 40, recordGap: -5 },
} satisfies ToolExample<Input, Output>;
export const pathologyAliquotRetainedVolumeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/pathology-aliquot-retained-volume-gap",
    title: "Pathology Aliquot Retained Volume Gap Tool",
    description:
      "Disjoint specimen-volume ledger, with no inference about sampling adequacy or specimen handling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receivedVolume: { type: "number", minimum: 0 },
        aliquotedVolume: { type: "number", minimum: 0 },
        consumedVolume: { type: "number", minimum: 0 },
        discardedVolume: { type: "number", minimum: 0 },
        recordedRetained: { type: "number", minimum: 0 },
      },
      required: [
        "receivedVolume",
        "aliquotedVolume",
        "consumedVolume",
        "discardedVolume",
        "recordedRetained",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedRetained: { type: "number" },
        recordGap: { type: "number" },
      },
      required: ["expectedRetained", "recordGap"],
    },
    ports: {
      inputs: [
        {
          id: "receivedVolume",
          label: "Received Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aliquotedVolume",
          label: "Aliquoted Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumedVolume",
          label: "Consumed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discardedVolume",
          label: "Discarded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedRetained",
          label: "Recorded Retained",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedRetained",
          label: "Expected Retained",
          valueType: { type: "number" },
        },
        { id: "recordGap", label: "Record Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pathologyAliquotRetainedVolumeGapTool.execute;
export default pathologyAliquotRetainedVolumeGapTool;
