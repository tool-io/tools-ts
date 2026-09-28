import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAlpha: number;
  readonly secondAlpha: number;
  readonly thirdAlpha: number;
  readonly includeThird: boolean;
};
export type Output = {
  readonly combinedAlpha: number;
  readonly residualTransparency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAlpha: { type: "number", minimum: 0, maximum: 1 },
    secondAlpha: { type: "number", minimum: 0, maximum: 1 },
    thirdAlpha: { type: "number", minimum: 0, maximum: 1 },
    includeThird: { type: "boolean" },
  },
  required: ["firstAlpha", "secondAlpha", "thirdAlpha", "includeThird"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedAlpha: { type: "number" },
    residualTransparency: { type: "number" },
  },
  required: ["combinedAlpha", "residualTransparency"],
} as const;
/** Source-over alpha of aligned layers, without color compositing or blend-mode behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAlpha, secondAlpha, thirdAlpha, includeThird } = request;
  const compute = (): Output => {
    H.probability(firstAlpha);
    H.probability(secondAlpha);
    H.probability(thirdAlpha);
    return {
      combinedAlpha:
        1 -
        (1 - firstAlpha) *
          (1 - secondAlpha) *
          (includeThird ? 1 - thirdAlpha : 1),
      residualTransparency:
        (1 - firstAlpha) *
        (1 - secondAlpha) *
        (includeThird ? 1 - thirdAlpha : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAlpha: 0.5,
    secondAlpha: 0.5,
    thirdAlpha: 0.2,
    includeThird: true,
  },
  output: { combinedAlpha: 0.8, residualTransparency: 0.2 },
} satisfies ToolExample<Input, Output>;
export const designTokenAlphaOverlapOpacityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/design-token-alpha-overlap-opacity-term",
    title: "Design Token Alpha Overlap Opacity Term Tool",
    description:
      "Source-over alpha of aligned layers, without color compositing or blend-mode behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAlpha: { type: "number", minimum: 0, maximum: 1 },
        secondAlpha: { type: "number", minimum: 0, maximum: 1 },
        thirdAlpha: { type: "number", minimum: 0, maximum: 1 },
        includeThird: { type: "boolean" },
      },
      required: ["firstAlpha", "secondAlpha", "thirdAlpha", "includeThird"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedAlpha: { type: "number" },
        residualTransparency: { type: "number" },
      },
      required: ["combinedAlpha", "residualTransparency"],
    },
    ports: {
      inputs: [
        {
          id: "firstAlpha",
          label: "First Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAlpha",
          label: "Second Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thirdAlpha",
          label: "Third Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeThird",
          label: "Include Third",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "combinedAlpha",
          label: "Combined Alpha",
          valueType: { type: "number" },
        },
        {
          id: "residualTransparency",
          label: "Residual Transparency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = designTokenAlphaOverlapOpacityTermTool.execute;
export default designTokenAlphaOverlapOpacityTermTool;
