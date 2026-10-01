import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingWidth: number;
  readonly objectWidth: number;
  readonly handMargin: number;
  readonly alignmentUncertainty: number;
};
export type Output = {
  readonly nominalClearance: number;
  readonly usableClearance: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWidth: { type: "number", minimum: 0 },
    objectWidth: { type: "number", minimum: 0 },
    handMargin: { type: "number", minimum: 0 },
    alignmentUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "openingWidth",
    "objectWidth",
    "handMargin",
    "alignmentUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalClearance: { type: "number" },
    usableClearance: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["nominalClearance", "usableClearance", "fits"],
} as const;
/** Calculate home task workspace clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingWidth, objectWidth, handMargin, alignmentUncertainty } =
    request;
  const compute = (): Output => {
    H.domain(
      openingWidth >= 0 &&
        objectWidth >= 0 &&
        handMargin >= 0 &&
        alignmentUncertainty >= 0,
    );
    return {
      nominalClearance: openingWidth - objectWidth,
      usableClearance:
        openingWidth - objectWidth - 2 * handMargin - 2 * alignmentUncertainty,
      fits:
        openingWidth - objectWidth >= 2 * (handMargin + alignmentUncertainty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingWidth: 100,
    objectWidth: 60,
    handMargin: 10,
    alignmentUncertainty: 2,
  },
  output: { nominalClearance: 40, usableClearance: 16, fits: true },
} satisfies ToolExample<Input, Output>;
export const homeTaskWorkspaceClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/home-task-workspace-clearance-gap",
    title: "Home Task Workspace Clearance Gap Tool",
    description:
      "Calculate home task workspace clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWidth: { type: "number", minimum: 0 },
        objectWidth: { type: "number", minimum: 0 },
        handMargin: { type: "number", minimum: 0 },
        alignmentUncertainty: { type: "number", minimum: 0 },
      },
      required: [
        "openingWidth",
        "objectWidth",
        "handMargin",
        "alignmentUncertainty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalClearance: { type: "number" },
        usableClearance: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["nominalClearance", "usableClearance", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "openingWidth",
          label: "Opening Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "objectWidth",
          label: "Object Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handMargin",
          label: "Hand Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alignmentUncertainty",
          label: "Alignment Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalClearance",
          label: "Nominal Clearance",
          valueType: { type: "number" },
        },
        {
          id: "usableClearance",
          label: "Usable Clearance",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = homeTaskWorkspaceClearanceGapTool.execute;
export default homeTaskWorkspaceClearanceGapTool;
