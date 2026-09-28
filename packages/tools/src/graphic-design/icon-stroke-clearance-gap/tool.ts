import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerlineGap: number;
  readonly firstStrokeWidth: number;
  readonly secondStrokeWidth: number;
  readonly requiredVisibleGap: number;
};
export type Output = { readonly visibleGap: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerlineGap: { type: "number", minimum: 0 },
    firstStrokeWidth: { type: "number", minimum: 0 },
    secondStrokeWidth: { type: "number", minimum: 0 },
    requiredVisibleGap: { type: "number", minimum: 0 },
  },
  required: [
    "centerlineGap",
    "firstStrokeWidth",
    "secondStrokeWidth",
    "requiredVisibleGap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { visibleGap: { type: "number" }, margin: { type: "number" } },
  required: ["visibleGap", "margin"],
} as const;
/** Calculate icon stroke clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    centerlineGap,
    firstStrokeWidth,
    secondStrokeWidth,
    requiredVisibleGap,
  } = request;
  const compute = (): Output => {
    H.domain(
      centerlineGap >= 0 &&
        firstStrokeWidth >= 0 &&
        secondStrokeWidth >= 0 &&
        requiredVisibleGap >= 0,
    );
    return {
      visibleGap: centerlineGap - firstStrokeWidth / 2 - secondStrokeWidth / 2,
      margin:
        centerlineGap -
        firstStrokeWidth / 2 -
        secondStrokeWidth / 2 -
        requiredVisibleGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    centerlineGap: 10,
    firstStrokeWidth: 4,
    secondStrokeWidth: 2,
    requiredVisibleGap: 5,
  },
  output: { visibleGap: 7, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const iconStrokeClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/icon-stroke-clearance-gap",
    title: "Icon Stroke Clearance Gap Tool",
    description:
      "Calculate icon stroke clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerlineGap: { type: "number", minimum: 0 },
        firstStrokeWidth: { type: "number", minimum: 0 },
        secondStrokeWidth: { type: "number", minimum: 0 },
        requiredVisibleGap: { type: "number", minimum: 0 },
      },
      required: [
        "centerlineGap",
        "firstStrokeWidth",
        "secondStrokeWidth",
        "requiredVisibleGap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleGap: { type: "number" },
        margin: { type: "number" },
      },
      required: ["visibleGap", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "centerlineGap",
          label: "Centerline Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstStrokeWidth",
          label: "First Stroke Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStrokeWidth",
          label: "Second Stroke Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredVisibleGap",
          label: "Required Visible Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "visibleGap",
          label: "Visible Gap",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = iconStrokeClearanceGapTool.execute;
export default iconStrokeClearanceGapTool;
