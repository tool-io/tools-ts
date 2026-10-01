import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTime: number;
  readonly epochStart: number;
  readonly epochEnd: number;
  readonly startIncluded: boolean;
  readonly endIncluded: boolean;
};
export type Output = { readonly assigned: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTime: { type: "number" },
    epochStart: { type: "number" },
    epochEnd: { type: "number" },
    startIncluded: { type: "boolean" },
    endIncluded: { type: "boolean" },
  },
  required: [
    "sampleTime",
    "epochStart",
    "epochEnd",
    "startIncluded",
    "endIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { assigned: { type: "boolean" } },
  required: ["assigned"],
} as const;
/** Assign a trace sample using explicit epoch endpoint ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTime, epochStart, epochEnd, startIncluded, endIncluded } =
    request;
  const compute = (): Output => {
    H.domain(epochStart < epochEnd);
    return {
      assigned:
        (startIncluded ? sampleTime >= epochStart : sampleTime > epochStart) &&
        (endIncluded ? sampleTime <= epochEnd : sampleTime < epochEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleTime: 10,
    epochStart: 10,
    epochEnd: 20,
    startIncluded: true,
    endIncluded: false,
  },
  output: { assigned: true },
} satisfies ToolExample<Input, Output>;
export const eegEpochStartAffinityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-epoch-start-affinity",
    title: "EEG Epoch Start Affinity Tool",
    description:
      "Assign a trace sample using explicit epoch endpoint ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        epochStart: { type: "number" },
        epochEnd: { type: "number" },
        startIncluded: { type: "boolean" },
        endIncluded: { type: "boolean" },
      },
      required: [
        "sampleTime",
        "epochStart",
        "epochEnd",
        "startIncluded",
        "endIncluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { assigned: { type: "boolean" } },
      required: ["assigned"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "epochStart",
          label: "Epoch Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "epochEnd",
          label: "Epoch End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startIncluded",
          label: "Start Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "endIncluded",
          label: "End Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "assigned", label: "Assigned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = eegEpochStartAffinityTool.execute;
export default eegEpochStartAffinityTool;
