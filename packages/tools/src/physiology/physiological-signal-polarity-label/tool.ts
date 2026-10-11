import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelId: string;
  readonly positiveDirection: string;
  readonly negativeDirection: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    positiveDirection: { type: "string", maxLength: 8192, minLength: 1 },
    negativeDirection: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["channelId", "positiveDirection", "negativeDirection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record an explicit physiological signal polarity convention without inferring electrode or sensor orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelId, positiveDirection, negativeDirection } = request;
  const compute = (): Output => {
    H.domain(
      channelId.length > 0 &&
        positiveDirection.length > 0 &&
        negativeDirection.length > 0,
      "channelId",
    );
    return {
      label:
        channelId +
        "; positive=" +
        JSON.stringify(positiveDirection) +
        "; negative=" +
        JSON.stringify(negativeDirection),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channelId: "CH17",
    positiveDirection: "inward",
    negativeDirection: "outward",
  },
  output: { label: 'CH17; positive="inward"; negative="outward"' },
} satisfies ToolExample<Input, Output>;
export const physiologicalSignalPolarityLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physiology", "biology"],
      keywords: ["physiology", "biology"],
    },
    id: "physiology/physiological-signal-polarity-label",
    title: "Physiological Signal Polarity Label",
    description:
      "Record an explicit physiological signal polarity convention without inferring electrode or sensor orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelId: { type: "string", maxLength: 8192, minLength: 1 },
        positiveDirection: { type: "string", maxLength: 8192, minLength: 1 },
        negativeDirection: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["channelId", "positiveDirection", "negativeDirection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "channelId",
          label: "Channel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "positiveDirection",
          label: "Positive Direction",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "negativeDirection",
          label: "Negative Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = physiologicalSignalPolarityLabelTool.execute;
export default physiologicalSignalPolarityLabelTool;
