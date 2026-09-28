import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  readonly printWidthInches: number;
  readonly printHeightInches: number;
  readonly minimumPpi: number;
};
export type Output = {
  readonly horizontalPpi: number;
  readonly verticalPpi: number;
  readonly limitingPpi: number;
  readonly maximumScale: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelWidth: { type: "integer", minimum: 1 },
    pixelHeight: { type: "integer", minimum: 1 },
    printWidthInches: { type: "number", exclusiveMinimum: 0 },
    printHeightInches: { type: "number", exclusiveMinimum: 0 },
    minimumPpi: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "pixelWidth",
    "pixelHeight",
    "printWidthInches",
    "printHeightInches",
    "minimumPpi",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalPpi: { type: "number" },
    verticalPpi: { type: "number" },
    limitingPpi: { type: "number" },
    maximumScale: { type: "number" },
  },
  required: ["horizontalPpi", "verticalPpi", "limitingPpi", "maximumScale"],
} as const;
/** Calculate image resolution enlargement limit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pixelWidth,
    pixelHeight,
    printWidthInches,
    printHeightInches,
    minimumPpi,
  } = request;
  const compute = (): Output => {
    H.integer(pixelWidth, 1);
    H.integer(pixelHeight, 1);
    H.positive(printWidthInches);
    H.positive(printHeightInches);
    H.positive(minimumPpi);
    return {
      horizontalPpi: pixelWidth / printWidthInches,
      verticalPpi: pixelHeight / printHeightInches,
      limitingPpi: Math.min(
        pixelWidth / printWidthInches,
        pixelHeight / printHeightInches,
      ),
      maximumScale:
        Math.min(
          pixelWidth / printWidthInches,
          pixelHeight / printHeightInches,
        ) / minimumPpi,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelWidth: 2400,
    pixelHeight: 3000,
    printWidthInches: 8,
    printHeightInches: 10,
    minimumPpi: 300,
  },
  output: {
    horizontalPpi: 300,
    verticalPpi: 300,
    limitingPpi: 300,
    maximumScale: 1,
  },
} satisfies ToolExample<Input, Output>;
export const imageResolutionEnlargementLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/image-resolution-enlargement-limit-gap",
    title: "Image Resolution Enlargement Limit Gap Tool",
    description:
      "Calculate image resolution enlargement limit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelWidth: { type: "integer", minimum: 1 },
        pixelHeight: { type: "integer", minimum: 1 },
        printWidthInches: { type: "number", exclusiveMinimum: 0 },
        printHeightInches: { type: "number", exclusiveMinimum: 0 },
        minimumPpi: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "pixelWidth",
        "pixelHeight",
        "printWidthInches",
        "printHeightInches",
        "minimumPpi",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalPpi: { type: "number" },
        verticalPpi: { type: "number" },
        limitingPpi: { type: "number" },
        maximumScale: { type: "number" },
      },
      required: ["horizontalPpi", "verticalPpi", "limitingPpi", "maximumScale"],
    },
    ports: {
      inputs: [
        {
          id: "pixelWidth",
          label: "Pixel Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pixelHeight",
          label: "Pixel Height",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "printWidthInches",
          label: "Print Width Inches",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "printHeightInches",
          label: "Print Height Inches",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumPpi",
          label: "Minimum Ppi",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalPpi",
          label: "Horizontal Ppi",
          valueType: { type: "number" },
        },
        {
          id: "verticalPpi",
          label: "Vertical Ppi",
          valueType: { type: "number" },
        },
        {
          id: "limitingPpi",
          label: "Limiting Ppi",
          valueType: { type: "number" },
        },
        {
          id: "maximumScale",
          label: "Maximum Scale",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imageResolutionEnlargementLimitGapTool.execute;
export default imageResolutionEnlargementLimitGapTool;
