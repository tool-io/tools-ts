import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maximumSignal: number;
  readonly minimumSignal: number;
  readonly referenceMean: number;
};
export type Output = {
  readonly absoluteRange: number;
  readonly integralUniformity: number;
  readonly referenceRelativeRange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumSignal: { type: "number" },
    minimumSignal: { type: "number", minimum: 0 },
    referenceMean: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["maximumSignal", "minimumSignal", "referenceMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteRange: { type: "number" },
    integralUniformity: { type: "number" },
    referenceRelativeRange: { type: "number" },
  },
  required: ["absoluteRange", "integralUniformity", "referenceRelativeRange"],
} as const;
/** One extrema-based uniformity convention 1-(max-min)/(max+min), with no modality acceptance threshold or automatic ROI selection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maximumSignal, minimumSignal, referenceMean } = request;
  const compute = (): Output => {
    H.domain(
      maximumSignal >= minimumSignal &&
        minimumSignal >= 0 &&
        maximumSignal + minimumSignal > 0,
    );
    H.positive(referenceMean);
    return {
      absoluteRange: maximumSignal - minimumSignal,
      integralUniformity:
        1 - (maximumSignal - minimumSignal) / (maximumSignal + minimumSignal),
      referenceRelativeRange: (maximumSignal - minimumSignal) / referenceMean,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maximumSignal: 110, minimumSignal: 90, referenceMean: 100 },
  output: {
    absoluteRange: 20,
    integralUniformity: 0.9,
    referenceRelativeRange: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const radiologyPhantomUniformityOnePairTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/radiology-phantom-uniformity-one-pair-term",
      title: "Radiology Phantom Uniformity One Pair Term Tool",
      description:
        "One extrema-based uniformity convention 1-(max-min)/(max+min), with no modality acceptance threshold or automatic ROI selection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          maximumSignal: { type: "number" },
          minimumSignal: { type: "number", minimum: 0 },
          referenceMean: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["maximumSignal", "minimumSignal", "referenceMean"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          absoluteRange: { type: "number" },
          integralUniformity: { type: "number" },
          referenceRelativeRange: { type: "number" },
        },
        required: [
          "absoluteRange",
          "integralUniformity",
          "referenceRelativeRange",
        ],
      },
      ports: {
        inputs: [
          {
            id: "maximumSignal",
            label: "Maximum Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumSignal",
            label: "Minimum Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMean",
            label: "Reference Mean",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "absoluteRange",
            label: "Absolute Range",
            valueType: { type: "number" },
          },
          {
            id: "integralUniformity",
            label: "Integral Uniformity",
            valueType: { type: "number" },
          },
          {
            id: "referenceRelativeRange",
            label: "Reference Relative Range",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = radiologyPhantomUniformityOnePairTermTool.execute;
export default radiologyPhantomUniformityOnePairTermTool;
