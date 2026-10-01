import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineTension: number;
  readonly horizontalSpan: number;
  readonly verticalSpan: number;
};
export type Output = {
  readonly horizontalTension: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineTension: { type: "number", minimum: 0 },
    horizontalSpan: { type: "number" },
    verticalSpan: { type: "number" },
  },
  required: ["lineTension", "horizontalSpan", "verticalSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalTension: { type: "number" },
    share: { type: "number" },
  },
  required: ["horizontalTension", "share"],
} as const;
/** Resolve an ideal straight line tension geometrically without line-strength or safety recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineTension, horizontalSpan, verticalSpan } = request;
  const compute = (): Output => {
    H.domain(lineTension >= 0 && horizontalSpan >= 0, "lineTension");
    const scale = Math.max(horizontalSpan, Math.abs(verticalSpan));
    H.domain(scale > 0, "horizontalSpan", "Provide a nonzero line span.");
    const share =
      horizontalSpan /
      scale /
      Math.hypot(horizontalSpan / scale, verticalSpan / scale);
    return { horizontalTension: lineTension * share, share };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineTension: 100, horizontalSpan: 3, verticalSpan: 4 },
  output: { horizontalTension: 60, share: 0.6 },
} satisfies ToolExample<Input, Output>;
export const mooringLineHorizontalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/mooring-line-horizontal-share",
    title: "Mooring Line Horizontal Share Tool",
    description:
      "Resolve an ideal straight line tension geometrically without line-strength or safety recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineTension: { type: "number", minimum: 0 },
        horizontalSpan: { type: "number" },
        verticalSpan: { type: "number" },
      },
      required: ["lineTension", "horizontalSpan", "verticalSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalTension: { type: "number" },
        share: { type: "number" },
      },
      required: ["horizontalTension", "share"],
    },
    ports: {
      inputs: [
        {
          id: "lineTension",
          label: "Line Tension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalSpan",
          label: "Horizontal Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verticalSpan",
          label: "Vertical Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalTension",
          label: "Horizontal Tension",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mooringLineHorizontalShareTool.execute;
export default mooringLineHorizontalShareTool;
