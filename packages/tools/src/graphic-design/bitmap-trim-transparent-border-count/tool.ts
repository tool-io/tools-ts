import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alphaRows: readonly (readonly number[])[];
  readonly transparentThreshold: number;
};
export type Output = {
  readonly leftTrim: number;
  readonly rightTrim: number;
  readonly topTrim: number;
  readonly bottomTrim: number;
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly empty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alphaRows: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
    transparentThreshold: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["alphaRows", "transparentThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftTrim: { type: "integer" },
    rightTrim: { type: "integer" },
    topTrim: { type: "integer" },
    bottomTrim: { type: "integer" },
    contentWidth: { type: "integer" },
    contentHeight: { type: "integer" },
    empty: { type: "boolean" },
  },
  required: [
    "leftTrim",
    "rightTrim",
    "topTrim",
    "bottomTrim",
    "contentWidth",
    "contentHeight",
    "empty",
  ],
} as const;
/** Find explicit alpha-mask border trims for pixels above a supplied threshold; an empty image uses a zero-origin empty crop and removes full right/bottom extents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alphaRows, transparentThreshold } = request;
  const compute = (): Output => {
    (H.domain(
      transparentThreshold >= 0 && transparentThreshold <= 1,
      "transparentThreshold",
    ),
      transparentThreshold);
    return (() => {
      const height = alphaRows.length,
        width = alphaRows[0]?.length ?? 0;
      H.domain(
        alphaRows.every(
          (row) =>
            row.length === width &&
            row.every((value) => value >= 0 && value <= 1),
        ),
        "alphaRows",
      );
      let minX = width,
        maxX = -1,
        minY = height,
        maxY = -1;
      alphaRows.forEach((row, y) =>
        row.forEach((value, x) => {
          if (value > transparentThreshold) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }),
      );
      return maxX < 0
        ? {
            leftTrim: 0,
            rightTrim: width,
            topTrim: 0,
            bottomTrim: height,
            contentWidth: 0,
            contentHeight: 0,
            empty: true,
          }
        : {
            leftTrim: minX,
            rightTrim: width - maxX - 1,
            topTrim: minY,
            bottomTrim: height - maxY - 1,
            contentWidth: maxX - minX + 1,
            contentHeight: maxY - minY + 1,
            empty: false,
          };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alphaRows: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    transparentThreshold: 0,
  },
  output: {
    leftTrim: 1,
    rightTrim: 1,
    topTrim: 1,
    bottomTrim: 1,
    contentWidth: 2,
    contentHeight: 1,
    empty: false,
  },
} satisfies ToolExample<Input, Output>;
export const bitmapTrimTransparentBorderCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/bitmap-trim-transparent-border-count",
    title: "Bitmap Trim Transparent Border Count Tool",
    description:
      "Find explicit alpha-mask border trims for pixels above a supplied threshold; an empty image uses a zero-origin empty crop and removes full right/bottom extents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alphaRows: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
        transparentThreshold: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["alphaRows", "transparentThreshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftTrim: { type: "integer" },
        rightTrim: { type: "integer" },
        topTrim: { type: "integer" },
        bottomTrim: { type: "integer" },
        contentWidth: { type: "integer" },
        contentHeight: { type: "integer" },
        empty: { type: "boolean" },
      },
      required: [
        "leftTrim",
        "rightTrim",
        "topTrim",
        "bottomTrim",
        "contentWidth",
        "contentHeight",
        "empty",
      ],
    },
    ports: {
      inputs: [
        {
          id: "alphaRows",
          label: "Alpha Rows",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
        {
          id: "transparentThreshold",
          label: "Transparent Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leftTrim", label: "Left Trim", valueType: { type: "integer" } },
        {
          id: "rightTrim",
          label: "Right Trim",
          valueType: { type: "integer" },
        },
        { id: "topTrim", label: "Top Trim", valueType: { type: "integer" } },
        {
          id: "bottomTrim",
          label: "Bottom Trim",
          valueType: { type: "integer" },
        },
        {
          id: "contentWidth",
          label: "Content Width",
          valueType: { type: "integer" },
        },
        {
          id: "contentHeight",
          label: "Content Height",
          valueType: { type: "integer" },
        },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bitmapTrimTransparentBorderCountTool.execute;
export default bitmapTrimTransparentBorderCountTool;
