import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPressure: number;
  readonly referenceHeight: number;
  readonly channelHeight: number;
  readonly pressurePerHeight: number;
};
export type Output = {
  readonly correction: number;
  readonly correctedPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPressure: { type: "number" },
    referenceHeight: { type: "number" },
    channelHeight: { type: "number" },
    pressurePerHeight: { type: "number", minimum: 0 },
  },
  required: [
    "measuredPressure",
    "referenceHeight",
    "channelHeight",
    "pressurePerHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correction: { type: "number" },
    correctedPressure: { type: "number" },
  },
  required: ["correction", "correctedPressure"],
} as const;
/** Use an explicit signed bench height convention and supplied pressure-per-height factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredPressure,
    referenceHeight,
    channelHeight,
    pressurePerHeight,
  } = request;
  const compute = (): Output => {
    H.domain(pressurePerHeight >= 0);
    return {
      correction: (referenceHeight - channelHeight) * pressurePerHeight,
      correctedPressure:
        measuredPressure +
        (referenceHeight - channelHeight) * pressurePerHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPressure: 10,
    referenceHeight: 5,
    channelHeight: 2,
    pressurePerHeight: 2,
  },
  output: { correction: 6, correctedPressure: 16 },
} satisfies ToolExample<Input, Output>;
export const pressureChannelReferenceHeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/pressure-channel-reference-height-gap",
    title: "Pressure Channel Reference Height Gap Tool",
    description:
      "Use an explicit signed bench height convention and supplied pressure-per-height factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPressure: { type: "number" },
        referenceHeight: { type: "number" },
        channelHeight: { type: "number" },
        pressurePerHeight: { type: "number", minimum: 0 },
      },
      required: [
        "measuredPressure",
        "referenceHeight",
        "channelHeight",
        "pressurePerHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correction: { type: "number" },
        correctedPressure: { type: "number" },
      },
      required: ["correction", "correctedPressure"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPressure",
          label: "Measured Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "channelHeight",
          label: "Channel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressurePerHeight",
          label: "Pressure Per Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
        {
          id: "correctedPressure",
          label: "Corrected Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureChannelReferenceHeightGapTool.execute;
export default pressureChannelReferenceHeightGapTool;
