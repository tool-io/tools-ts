import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWidth: number;
  readonly secondWidth: number;
  readonly gap: number;
};
export type Output = {
  readonly totalWidth: number;
  readonly gapFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWidth: { type: "number", exclusiveMinimum: 0 },
    secondWidth: { type: "number", exclusiveMinimum: 0 },
    gap: { type: "number", minimum: 0 },
  },
  required: ["firstWidth", "secondWidth", "gap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWidth: { type: "number" },
    gapFraction: { type: "number" },
  },
  required: ["totalWidth", "gapFraction"],
} as const;
/** Calculate art work diptych panel gap width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWidth, secondWidth, gap } = request;
  const compute = (): Output => {
    H.positive(firstWidth);
    H.positive(secondWidth);
    H.domain(gap >= 0);
    return {
      totalWidth: firstWidth + secondWidth + gap,
      gapFraction: gap / (firstWidth + secondWidth + gap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWidth: 40, secondWidth: 50, gap: 10 },
  output: { totalWidth: 100, gapFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const artWorkDiptychPanelGapWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/art-work-diptych-panel-gap-width",
    title: "Art Work Diptych Panel Gap Width Tool",
    description:
      "Calculate art work diptych panel gap width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWidth: { type: "number", exclusiveMinimum: 0 },
        secondWidth: { type: "number", exclusiveMinimum: 0 },
        gap: { type: "number", minimum: 0 },
      },
      required: ["firstWidth", "secondWidth", "gap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWidth: { type: "number" },
        gapFraction: { type: "number" },
      },
      required: ["totalWidth", "gapFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstWidth",
          label: "First Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWidth",
          label: "Second Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalWidth",
          label: "Total Width",
          valueType: { type: "number" },
        },
        {
          id: "gapFraction",
          label: "Gap Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artWorkDiptychPanelGapWidthTool.execute;
export default artWorkDiptychPanelGapWidthTool;
