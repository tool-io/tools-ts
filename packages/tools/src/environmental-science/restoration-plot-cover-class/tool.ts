import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coverPercent: number;
  readonly lowerBounds: readonly number[];
  readonly classLabels: readonly string[];
};
export type Output = { readonly classLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverPercent: { type: "number", minimum: 0, maximum: 100 },
    lowerBounds: { type: "array", maxItems: 256, items: { type: "number" } },
    classLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["coverPercent", "lowerBounds", "classLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { classLabel: { type: "string", maxLength: 8192 } },
  required: ["classLabel"],
} as const;
/** Classify a measured cover percentage using explicit increasing lower bounds with inclusive lower edges; no standard ecological cover scheme is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coverPercent, lowerBounds, classLabels } = request;
  const compute = (): Output => {
    H.domain(coverPercent >= 0 && coverPercent <= 100, "coverPercent");
    H.sameLength(lowerBounds, classLabels);
    H.domain(
      lowerBounds.length > 0 &&
        lowerBounds[0] === 0 &&
        lowerBounds.every(
          (v, i) => v >= 0 && v <= 100 && (i === 0 || v > lowerBounds[i - 1]),
        ),
      "lowerBounds",
    );
    let index = 0;
    lowerBounds.forEach((v, i) => {
      if (coverPercent >= v) index = i;
    });
    return { classLabel: classLabels[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coverPercent: 35,
    lowerBounds: [0, 25, 50, 75],
    classLabels: ["low", "moderate", "high", "very high"],
  },
  output: { classLabel: "moderate" },
} satisfies ToolExample<Input, Output>;
export const restorationPlotCoverClassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/restoration-plot-cover-class",
    title: "Restoration Plot Cover Class Tool",
    description:
      "Classify a measured cover percentage using explicit increasing lower bounds with inclusive lower edges; no standard ecological cover scheme is invented.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverPercent: { type: "number", minimum: 0, maximum: 100 },
        lowerBounds: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        classLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["coverPercent", "lowerBounds", "classLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { classLabel: { type: "string", maxLength: 8192 } },
      required: ["classLabel"],
    },
    ports: {
      inputs: [
        {
          id: "coverPercent",
          label: "Cover Percent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBounds",
          label: "Lower Bounds",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "classLabels",
          label: "Class Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "classLabel",
          label: "Class Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationPlotCoverClassTool.execute;
export default restorationPlotCoverClassTool;
