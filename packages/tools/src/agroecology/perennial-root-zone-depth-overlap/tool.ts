import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTop: number;
  readonly firstBottom: number;
  readonly secondTop: number;
  readonly secondBottom: number;
};
export type Output = {
  readonly overlapDepth: number;
  readonly fractionOfFirst: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTop: { type: "number" },
    firstBottom: { type: "number" },
    secondTop: { type: "number" },
    secondBottom: { type: "number" },
  },
  required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDepth: { type: "number" },
    fractionOfFirst: { type: "number" },
  },
  required: ["overlapDepth", "fractionOfFirst"],
} as const;
/** Calculate perennial root zone depth overlap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTop, firstBottom, secondTop, secondBottom } = request;
  const compute = (): Output => {
    H.domain(firstBottom > firstTop && secondBottom >= secondTop);
    return {
      overlapDepth: Math.max(
        0,
        Math.min(firstBottom, secondBottom) - Math.max(firstTop, secondTop),
      ),
      fractionOfFirst:
        Math.max(
          0,
          Math.min(firstBottom, secondBottom) - Math.max(firstTop, secondTop),
        ) /
        (firstBottom - firstTop),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTop: 0, firstBottom: 100, secondTop: 50, secondBottom: 150 },
  output: { overlapDepth: 50, fractionOfFirst: 0.5 },
} satisfies ToolExample<Input, Output>;
export const perennialRootZoneDepthOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/perennial-root-zone-depth-overlap",
    title: "Perennial Root Zone Depth Overlap Tool",
    description:
      "Calculate perennial root zone depth overlap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTop: { type: "number" },
        firstBottom: { type: "number" },
        secondTop: { type: "number" },
        secondBottom: { type: "number" },
      },
      required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDepth: { type: "number" },
        fractionOfFirst: { type: "number" },
      },
      required: ["overlapDepth", "fractionOfFirst"],
    },
    ports: {
      inputs: [
        {
          id: "firstTop",
          label: "First Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBottom",
          label: "First Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTop",
          label: "Second Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBottom",
          label: "Second Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDepth",
          label: "Overlap Depth",
          valueType: { type: "number" },
        },
        {
          id: "fractionOfFirst",
          label: "Fraction Of First",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = perennialRootZoneDepthOverlapTool.execute;
export default perennialRootZoneDepthOverlapTool;
