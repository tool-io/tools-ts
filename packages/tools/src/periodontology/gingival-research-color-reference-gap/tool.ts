import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sample: readonly number[];
  readonly reference: readonly number[];
  readonly channelScales: readonly number[];
};
export type Output = {
  readonly differences: readonly number[];
  readonly scaledDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sample: { type: "array", maxItems: 256, items: { type: "number" } },
    reference: { type: "array", maxItems: 256, items: { type: "number" } },
    channelScales: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["sample", "reference", "channelScales"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differences: { type: "array", maxItems: 256, items: { type: "number" } },
    scaledDistance: { type: "number" },
  },
  required: ["differences", "scaledDistance"],
} as const;
/** Scaled distance between supplied research color channels without assigning a color space. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sample, reference, channelScales } = request;
  const compute = (): Output => {
    H.sameLength(sample, reference);
    H.sameLength(sample, channelScales);
    H.domain(sample.length > 0 && channelScales.every((x) => x > 0));
    return {
      differences: sample.map((x, i) => x - reference[i]),
      scaledDistance: Math.hypot(
        ...sample.map((x, i) => (x - reference[i]) / channelScales[i]),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sample: [10, 20, 30],
    reference: [7, 16, 30],
    channelScales: [1, 2, 1],
  },
  output: { differences: [3, 4, 0], scaledDistance: 3.6055512754639896 },
} satisfies ToolExample<Input, Output>;
export const gingivalResearchColorReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/gingival-research-color-reference-gap",
    title: "Gingival Research Color Reference Gap Tool",
    description:
      "Scaled distance between supplied research color channels without assigning a color space.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sample: { type: "array", maxItems: 256, items: { type: "number" } },
        reference: { type: "array", maxItems: 256, items: { type: "number" } },
        channelScales: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["sample", "reference", "channelScales"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        differences: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        scaledDistance: { type: "number" },
      },
      required: ["differences", "scaledDistance"],
    },
    ports: {
      inputs: [
        {
          id: "sample",
          label: "Sample",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "channelScales",
          label: "Channel Scales",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "differences",
          label: "Differences",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "scaledDistance",
          label: "Scaled Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gingivalResearchColorReferenceGapTool.execute;
export default gingivalResearchColorReferenceGapTool;
