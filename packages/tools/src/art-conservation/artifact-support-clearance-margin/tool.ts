import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artifactWidth: number;
  readonly supportWidth: number;
  readonly requiredGapEachSide: number;
  readonly centerOffset: number;
};
export type Output = {
  readonly leftGap: number;
  readonly rightGap: number;
  readonly minimumMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifactWidth: { type: "number", minimum: 0 },
    supportWidth: { type: "number", minimum: 0 },
    requiredGapEachSide: { type: "number", minimum: 0 },
    centerOffset: { type: "number" },
  },
  required: [
    "artifactWidth",
    "supportWidth",
    "requiredGapEachSide",
    "centerOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftGap: { type: "number" },
    rightGap: { type: "number" },
    minimumMargin: { type: "number" },
  },
  required: ["leftGap", "rightGap", "minimumMargin"],
} as const;
/** Calculate artifact support clearance margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artifactWidth, supportWidth, requiredGapEachSide, centerOffset } =
    request;
  const compute = (): Output => {
    H.domain(
      artifactWidth >= 0 && supportWidth >= 0 && requiredGapEachSide >= 0,
    );
    return (() => {
      const half = (supportWidth - artifactWidth) / 2,
        leftGap = half + centerOffset,
        rightGap = half - centerOffset;
      return {
        leftGap,
        rightGap,
        minimumMargin: Math.min(leftGap, rightGap) - requiredGapEachSide,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    artifactWidth: 6,
    supportWidth: 10,
    requiredGapEachSide: 1,
    centerOffset: 0.5,
  },
  output: { leftGap: 2.5, rightGap: 1.5, minimumMargin: 0.5 },
} satisfies ToolExample<Input, Output>;
export const artifactSupportClearanceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/artifact-support-clearance-margin",
    title: "Artifact Support Clearance Margin Tool",
    description:
      "Calculate artifact support clearance margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifactWidth: { type: "number", minimum: 0 },
        supportWidth: { type: "number", minimum: 0 },
        requiredGapEachSide: { type: "number", minimum: 0 },
        centerOffset: { type: "number" },
      },
      required: [
        "artifactWidth",
        "supportWidth",
        "requiredGapEachSide",
        "centerOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftGap: { type: "number" },
        rightGap: { type: "number" },
        minimumMargin: { type: "number" },
      },
      required: ["leftGap", "rightGap", "minimumMargin"],
    },
    ports: {
      inputs: [
        {
          id: "artifactWidth",
          label: "Artifact Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supportWidth",
          label: "Support Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredGapEachSide",
          label: "Required Gap Each Side",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerOffset",
          label: "Center Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leftGap", label: "Left Gap", valueType: { type: "number" } },
        { id: "rightGap", label: "Right Gap", valueType: { type: "number" } },
        {
          id: "minimumMargin",
          label: "Minimum Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactSupportClearanceMarginTool.execute;
export default artifactSupportClearanceMarginTool;
