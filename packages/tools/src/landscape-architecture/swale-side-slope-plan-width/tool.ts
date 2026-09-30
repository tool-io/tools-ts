import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomWidth: number;
  readonly depth: number;
  readonly leftRunPerRise: number;
  readonly rightRunPerRise: number;
};
export type Output = {
  readonly topWidth: number;
  readonly crossSectionArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomWidth: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    leftRunPerRise: { type: "number", minimum: 0 },
    rightRunPerRise: { type: "number", minimum: 0 },
  },
  required: ["bottomWidth", "depth", "leftRunPerRise", "rightRunPerRise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topWidth: { type: "number" },
    crossSectionArea: { type: "number" },
  },
  required: ["topWidth", "crossSectionArea"],
} as const;
/** Calculate swale side slope plan width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomWidth, depth, leftRunPerRise, rightRunPerRise } = request;
  const compute = (): Output => {
    H.domain(
      bottomWidth >= 0 &&
        depth >= 0 &&
        leftRunPerRise >= 0 &&
        rightRunPerRise >= 0,
    );
    return {
      topWidth: bottomWidth + depth * (leftRunPerRise + rightRunPerRise),
      crossSectionArea:
        depth *
        (bottomWidth + (depth * (leftRunPerRise + rightRunPerRise)) / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomWidth: 2, depth: 1, leftRunPerRise: 3, rightRunPerRise: 2 },
  output: { topWidth: 7, crossSectionArea: 4.5 },
} satisfies ToolExample<Input, Output>;
export const swaleSideSlopePlanWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/swale-side-slope-plan-width",
    title: "Swale Side Slope Plan Width Tool",
    description:
      "Calculate swale side slope plan width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomWidth: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        leftRunPerRise: { type: "number", minimum: 0 },
        rightRunPerRise: { type: "number", minimum: 0 },
      },
      required: ["bottomWidth", "depth", "leftRunPerRise", "rightRunPerRise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topWidth: { type: "number" },
        crossSectionArea: { type: "number" },
      },
      required: ["topWidth", "crossSectionArea"],
    },
    ports: {
      inputs: [
        {
          id: "bottomWidth",
          label: "Bottom Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftRunPerRise",
          label: "Left Run Per Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightRunPerRise",
          label: "Right Run Per Rise",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "topWidth", label: "Top Width", valueType: { type: "number" } },
        {
          id: "crossSectionArea",
          label: "Cross Section Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = swaleSideSlopePlanWidthTool.execute;
export default swaleSideSlopePlanWidthTool;
