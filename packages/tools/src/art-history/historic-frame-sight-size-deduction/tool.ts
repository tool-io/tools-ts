import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artWidth: number;
  readonly artHeight: number;
  readonly leftOverlap: number;
  readonly rightOverlap: number;
  readonly topOverlap: number;
  readonly bottomOverlap: number;
};
export type Output = {
  readonly sightWidth: number;
  readonly sightHeight: number;
  readonly hiddenArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artWidth: { type: "number" },
    artHeight: { type: "number" },
    leftOverlap: { type: "number", minimum: 0 },
    rightOverlap: { type: "number", minimum: 0 },
    topOverlap: { type: "number", minimum: 0 },
    bottomOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "artWidth",
    "artHeight",
    "leftOverlap",
    "rightOverlap",
    "topOverlap",
    "bottomOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sightWidth: { type: "number" },
    sightHeight: { type: "number" },
    hiddenArea: { type: "number" },
  },
  required: ["sightWidth", "sightHeight", "hiddenArea"],
} as const;
/** Calculate historic frame sight size deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    artWidth,
    artHeight,
    leftOverlap,
    rightOverlap,
    topOverlap,
    bottomOverlap,
  } = request;
  const compute = (): Output => {
    H.domain(
      leftOverlap >= 0 &&
        rightOverlap >= 0 &&
        topOverlap >= 0 &&
        bottomOverlap >= 0 &&
        artWidth >= leftOverlap + rightOverlap &&
        artHeight >= topOverlap + bottomOverlap,
    );
    return {
      sightWidth: artWidth - leftOverlap - rightOverlap,
      sightHeight: artHeight - topOverlap - bottomOverlap,
      hiddenArea:
        artWidth * artHeight -
        (artWidth - leftOverlap - rightOverlap) *
          (artHeight - topOverlap - bottomOverlap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    artWidth: 40,
    artHeight: 50,
    leftOverlap: 1,
    rightOverlap: 1,
    topOverlap: 2,
    bottomOverlap: 2,
  },
  output: { sightWidth: 38, sightHeight: 46, hiddenArea: 252 },
} satisfies ToolExample<Input, Output>;
export const historicFrameSightSizeDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/historic-frame-sight-size-deduction",
    title: "Historic Frame Sight Size Deduction Tool",
    description:
      "Calculate historic frame sight size deduction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artWidth: { type: "number" },
        artHeight: { type: "number" },
        leftOverlap: { type: "number", minimum: 0 },
        rightOverlap: { type: "number", minimum: 0 },
        topOverlap: { type: "number", minimum: 0 },
        bottomOverlap: { type: "number", minimum: 0 },
      },
      required: [
        "artWidth",
        "artHeight",
        "leftOverlap",
        "rightOverlap",
        "topOverlap",
        "bottomOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sightWidth: { type: "number" },
        sightHeight: { type: "number" },
        hiddenArea: { type: "number" },
      },
      required: ["sightWidth", "sightHeight", "hiddenArea"],
    },
    ports: {
      inputs: [
        {
          id: "artWidth",
          label: "Art Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artHeight",
          label: "Art Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftOverlap",
          label: "Left Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightOverlap",
          label: "Right Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topOverlap",
          label: "Top Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomOverlap",
          label: "Bottom Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sightWidth",
          label: "Sight Width",
          valueType: { type: "number" },
        },
        {
          id: "sightHeight",
          label: "Sight Height",
          valueType: { type: "number" },
        },
        {
          id: "hiddenArea",
          label: "Hidden Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicFrameSightSizeDeductionTool.execute;
export default historicFrameSightSizeDeductionTool;
