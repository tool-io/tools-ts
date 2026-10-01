import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelWeights: readonly number[];
  readonly channelValid: readonly boolean[];
  readonly referenceIncluded: readonly boolean[];
};
export type Output = {
  readonly referenceWeight: number;
  readonly validReferenceWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    channelValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    referenceIncluded: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["channelWeights", "channelValid", "referenceIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceWeight: { type: "number" },
    validReferenceWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["referenceWeight", "validReferenceWeight", "share", "defined"],
} as const;
/** Calculate eeg reference support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelWeights, channelValid, referenceIncluded } = request;
  const compute = (): Output => {
    H.sameLength(channelWeights, channelValid);
    H.sameLength(channelWeights, referenceIncluded);
    H.domain(channelWeights.every((x) => x >= 0));
    return (() => {
      const referenceWeight = channelWeights.reduce(
          (s, x, i) => s + (referenceIncluded[i] ? x : 0),
          0,
        ),
        validReferenceWeight = channelWeights.reduce(
          (s, x, i) => s + (referenceIncluded[i] && channelValid[i] ? x : 0),
          0,
        );
      return {
        referenceWeight,
        validReferenceWeight,
        share: referenceWeight > 0 ? validReferenceWeight / referenceWeight : 0,
        defined: referenceWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channelWeights: [2, 3, 5],
    channelValid: [true, false, true],
    referenceIncluded: [true, true, false],
  },
  output: {
    referenceWeight: 5,
    validReferenceWeight: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const eegReferenceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-reference-support-share",
    title: "EEG Reference Support Share Tool",
    description:
      "Calculate eeg reference support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        channelValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceIncluded: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["channelWeights", "channelValid", "referenceIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceWeight: { type: "number" },
        validReferenceWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["referenceWeight", "validReferenceWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "channelWeights",
          label: "Channel Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "channelValid",
          label: "Channel Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceIncluded",
          label: "Reference Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "referenceWeight",
          label: "Reference Weight",
          valueType: { type: "number" },
        },
        {
          id: "validReferenceWeight",
          label: "Valid Reference Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = eegReferenceSupportShareTool.execute;
export default eegReferenceSupportShareTool;
