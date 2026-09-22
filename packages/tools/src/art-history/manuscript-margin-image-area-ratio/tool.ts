import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageArea: number;
  readonly imageArea: number;
  readonly excludedMargin: number;
};
export type Output = {
  readonly availableMargin: number;
  readonly imageToMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageArea: { type: "number" },
    imageArea: { type: "number", minimum: 0 },
    excludedMargin: { type: "number", minimum: 0 },
  },
  required: ["pageArea", "imageArea", "excludedMargin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMargin: { type: "number" },
    imageToMargin: { type: "number" },
  },
  required: ["availableMargin", "imageToMargin"],
} as const;
/** Calculate manuscript margin image area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageArea, imageArea, excludedMargin } = request;
  const compute = (): Output => {
    H.domain(
      imageArea >= 0 &&
        excludedMargin >= 0 &&
        pageArea > imageArea + excludedMargin,
    );
    return {
      availableMargin: pageArea - imageArea - excludedMargin,
      imageToMargin: imageArea / (pageArea - imageArea - excludedMargin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageArea: 100, imageArea: 40, excludedMargin: 10 },
  output: { availableMargin: 50, imageToMargin: 0.8 },
} satisfies ToolExample<Input, Output>;
export const manuscriptMarginImageAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/manuscript-margin-image-area-ratio",
    title: "Manuscript Margin Image Area Ratio Tool",
    description:
      "Calculate manuscript margin image area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageArea: { type: "number" },
        imageArea: { type: "number", minimum: 0 },
        excludedMargin: { type: "number", minimum: 0 },
      },
      required: ["pageArea", "imageArea", "excludedMargin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMargin: { type: "number" },
        imageToMargin: { type: "number" },
      },
      required: ["availableMargin", "imageToMargin"],
    },
    ports: {
      inputs: [
        {
          id: "pageArea",
          label: "Page Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageArea",
          label: "Image Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedMargin",
          label: "Excluded Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableMargin",
          label: "Available Margin",
          valueType: { type: "number" },
        },
        {
          id: "imageToMargin",
          label: "Image To Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptMarginImageAreaRatioTool.execute;
export default manuscriptMarginImageAreaRatioTool;
