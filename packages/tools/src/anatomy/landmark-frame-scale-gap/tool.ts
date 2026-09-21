import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAxisLengths: readonly number[];
  readonly secondAxisLengths: readonly number[];
};
export type Output = {
  readonly axisRatios: readonly number[];
  readonly maximumRelativeScaleGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxisLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    secondAxisLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["firstAxisLengths", "secondAxisLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisRatios: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumRelativeScaleGap: { type: "number" },
  },
  required: ["axisRatios", "maximumRelativeScaleGap"],
} as const;
/** Calculate landmark frame scale gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAxisLengths, secondAxisLengths } = request;
  const compute = (): Output => {
    H.domain(
      firstAxisLengths.length === 3 &&
        secondAxisLengths.length === 3 &&
        [...firstAxisLengths, ...secondAxisLengths].every((x) => x > 0),
    );
    return (() => {
      const axisRatios = secondAxisLengths.map(
        (x, i) => x / firstAxisLengths[i],
      );
      return {
        axisRatios,
        maximumRelativeScaleGap: Math.max(
          ...axisRatios.map((x) => Math.abs(x - 1)),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAxisLengths: [1, 2, 4], secondAxisLengths: [2, 2, 2] },
  output: { axisRatios: [2, 1, 0.5], maximumRelativeScaleGap: 1 },
} satisfies ToolExample<Input, Output>;
export const landmarkFrameScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/landmark-frame-scale-gap",
    title: "Landmark Frame Scale Gap Tool",
    description:
      "Calculate landmark frame scale gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAxisLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        secondAxisLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstAxisLengths", "secondAxisLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisRatios: { type: "array", maxItems: 256, items: { type: "number" } },
        maximumRelativeScaleGap: { type: "number" },
      },
      required: ["axisRatios", "maximumRelativeScaleGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstAxisLengths",
          label: "First Axis Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondAxisLengths",
          label: "Second Axis Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "axisRatios",
          label: "Axis Ratios",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumRelativeScaleGap",
          label: "Maximum Relative Scale Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landmarkFrameScaleGapTool.execute;
export default landmarkFrameScaleGapTool;
