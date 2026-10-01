import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minimumAngle: number;
  readonly maximumAngle: number;
  readonly referenceMinimum: number;
  readonly referenceMaximum: number;
};
export type Output = {
  readonly observedRange: number;
  readonly referenceRange: number;
  readonly rangeGap: number;
  readonly overlapRange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumAngle: { type: "number" },
    maximumAngle: { type: "number" },
    referenceMinimum: { type: "number" },
    referenceMaximum: { type: "number" },
  },
  required: [
    "minimumAngle",
    "maximumAngle",
    "referenceMinimum",
    "referenceMaximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRange: { type: "number" },
    referenceRange: { type: "number" },
    rangeGap: { type: "number" },
    overlapRange: { type: "number" },
  },
  required: ["observedRange", "referenceRange", "rangeGap", "overlapRange"],
} as const;
/** Descriptive research range comparison against explicit supplied bounds, without selecting normal joint-motion limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minimumAngle, maximumAngle, referenceMinimum, referenceMaximum } =
    request;
  const compute = (): Output => {
    H.domain(
      maximumAngle >= minimumAngle && referenceMaximum >= referenceMinimum,
    );
    return {
      observedRange: maximumAngle - minimumAngle,
      referenceRange: referenceMaximum - referenceMinimum,
      rangeGap:
        maximumAngle - minimumAngle - referenceMaximum + referenceMinimum,
      overlapRange: Math.max(
        0,
        Math.min(maximumAngle, referenceMaximum) -
          Math.max(minimumAngle, referenceMinimum),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    minimumAngle: 10,
    maximumAngle: 80,
    referenceMinimum: 0,
    referenceMaximum: 90,
  },
  output: {
    observedRange: 70,
    referenceRange: 90,
    rangeGap: -20,
    overlapRange: 70,
  },
} satisfies ToolExample<Input, Output>;
export const jointMotionResearchRangeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/joint-motion-research-range-term",
    title: "Joint Motion Research Range Term Tool",
    description:
      "Descriptive research range comparison against explicit supplied bounds, without selecting normal joint-motion limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumAngle: { type: "number" },
        maximumAngle: { type: "number" },
        referenceMinimum: { type: "number" },
        referenceMaximum: { type: "number" },
      },
      required: [
        "minimumAngle",
        "maximumAngle",
        "referenceMinimum",
        "referenceMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedRange: { type: "number" },
        referenceRange: { type: "number" },
        rangeGap: { type: "number" },
        overlapRange: { type: "number" },
      },
      required: ["observedRange", "referenceRange", "rangeGap", "overlapRange"],
    },
    ports: {
      inputs: [
        {
          id: "minimumAngle",
          label: "Minimum Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumAngle",
          label: "Maximum Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMinimum",
          label: "Reference Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMaximum",
          label: "Reference Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedRange",
          label: "Observed Range",
          valueType: { type: "number" },
        },
        {
          id: "referenceRange",
          label: "Reference Range",
          valueType: { type: "number" },
        },
        { id: "rangeGap", label: "Range Gap", valueType: { type: "number" } },
        {
          id: "overlapRange",
          label: "Overlap Range",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointMotionResearchRangeTermTool.execute;
export default jointMotionResearchRangeTermTool;
