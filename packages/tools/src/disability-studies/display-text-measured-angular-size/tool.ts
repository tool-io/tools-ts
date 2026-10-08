import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredTextHeight: number;
  readonly viewingDistance: number;
};
export type Output = { readonly angularHeightRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredTextHeight: { type: "number", minimum: 0 },
    viewingDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredTextHeight", "viewingDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angularHeightRadians: { type: "number" } },
  required: ["angularHeightRadians"],
} as const;
/** Calculate centered planar text angular height from explicit compatible height and perpendicular viewing distance without assessing legibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredTextHeight, viewingDistance } = request;
  const compute = (): Output => {
    H.domain(measuredTextHeight >= 0, "measuredTextHeight");
    (H.domain(
      Number.isFinite(viewingDistance) && viewingDistance > 0,
      "viewingDistance",
    ),
      viewingDistance);
    return {
      angularHeightRadians:
        2 * Math.atan(measuredTextHeight / viewingDistance / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredTextHeight: 2, viewingDistance: 10 },
  output: { angularHeightRadians: 0.19933730498232408 },
} satisfies ToolExample<Input, Output>;
export const displayTextMeasuredAngularSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/display-text-measured-angular-size",
    title: "Display Text Measured Angular Size",
    description:
      "Calculate centered planar text angular height from explicit compatible height and perpendicular viewing distance without assessing legibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredTextHeight: { type: "number", minimum: 0 },
        viewingDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredTextHeight", "viewingDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angularHeightRadians: { type: "number" } },
      required: ["angularHeightRadians"],
    },
    ports: {
      inputs: [
        {
          id: "measuredTextHeight",
          label: "Measured Text Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viewingDistance",
          label: "Viewing Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angularHeightRadians",
          label: "Angular Height Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = displayTextMeasuredAngularSizeTool.execute;
export default displayTextMeasuredAngularSizeTool;
