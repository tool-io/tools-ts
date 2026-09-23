import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageDays: number;
  readonly windowStartDays: number;
  readonly windowEndDays: number;
  readonly suppliedAgeCorrection: number;
};
export type Output = {
  readonly correctedAge: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    windowStartDays: { type: "integer" },
    windowEndDays: { type: "integer" },
    suppliedAgeCorrection: { type: "integer" },
  },
  required: [
    "ageDays",
    "windowStartDays",
    "windowEndDays",
    "suppliedAgeCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedAge: { type: "integer" },
    lowerMargin: { type: "integer" },
    upperMargin: { type: "integer" },
  },
  required: ["correctedAge", "lowerMargin", "upperMargin"],
} as const;
/** Compare supplied research-age indices after an explicit correction without developmental or clinical assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageDays, windowStartDays, windowEndDays, suppliedAgeCorrection } =
    request;
  const compute = (): Output => {
    H.domain(windowStartDays <= windowEndDays);
    return {
      correctedAge: ageDays + suppliedAgeCorrection,
      lowerMargin: ageDays + suppliedAgeCorrection - windowStartDays,
      upperMargin: windowEndDays - ageDays - suppliedAgeCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ageDays: 100,
    windowStartDays: 90,
    windowEndDays: 110,
    suppliedAgeCorrection: -5,
  },
  output: { correctedAge: 95, lowerMargin: 5, upperMargin: 15 },
} satisfies ToolExample<Input, Output>;
export const researchVisitAgeWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/research-visit-age-window-offset",
    title: "Research Visit Age Window Offset Tool",
    description:
      "Compare supplied research-age indices after an explicit correction without developmental or clinical assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        windowStartDays: { type: "integer" },
        windowEndDays: { type: "integer" },
        suppliedAgeCorrection: { type: "integer" },
      },
      required: [
        "ageDays",
        "windowStartDays",
        "windowEndDays",
        "suppliedAgeCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedAge: { type: "integer" },
        lowerMargin: { type: "integer" },
        upperMargin: { type: "integer" },
      },
      required: ["correctedAge", "lowerMargin", "upperMargin"],
    },
    ports: {
      inputs: [
        {
          id: "ageDays",
          label: "Age Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowStartDays",
          label: "Window Start Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowEndDays",
          label: "Window End Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAgeCorrection",
          label: "Supplied Age Correction",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "correctedAge",
          label: "Corrected Age",
          valueType: { type: "integer" },
        },
        {
          id: "lowerMargin",
          label: "Lower Margin",
          valueType: { type: "integer" },
        },
        {
          id: "upperMargin",
          label: "Upper Margin",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchVisitAgeWindowOffsetTool.execute;
export default researchVisitAgeWindowOffsetTool;
