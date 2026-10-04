import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredClearWidth: number;
  readonly requiredWidth: number;
};
export type Output = {
  readonly margin: number;
  readonly meetsSuppliedWidth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredClearWidth: { type: "number", minimum: 0 },
    requiredWidth: { type: "number", minimum: 0 },
  },
  required: ["measuredClearWidth", "requiredWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    meetsSuppliedWidth: { type: "boolean" },
  },
  required: ["margin", "meetsSuppliedWidth"],
} as const;
/** Compare measured clear width with an explicitly supplied access requirement without selecting a building standard or evaluating a whole route. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredClearWidth, requiredWidth } = request;
  const compute = (): Output => {
    H.domain(
      measuredClearWidth >= 0 && requiredWidth >= 0,
      "measuredClearWidth",
    );
    return {
      margin: measuredClearWidth - requiredWidth,
      meetsSuppliedWidth: measuredClearWidth >= requiredWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredClearWidth: 900, requiredWidth: 850 },
  output: { margin: 50, meetsSuppliedWidth: true },
} satisfies ToolExample<Input, Output>;
export const wheelchairClearWidthMeasuredMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/wheelchair-clear-width-measured-margin",
    title: "Wheelchair Clear Width Measured Margin Tool",
    description:
      "Compare measured clear width with an explicitly supplied access requirement without selecting a building standard or evaluating a whole route.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredClearWidth: { type: "number", minimum: 0 },
        requiredWidth: { type: "number", minimum: 0 },
      },
      required: ["measuredClearWidth", "requiredWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        meetsSuppliedWidth: { type: "boolean" },
      },
      required: ["margin", "meetsSuppliedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "measuredClearWidth",
          label: "Measured Clear Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredWidth",
          label: "Required Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "meetsSuppliedWidth",
          label: "Meets Supplied Width",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = wheelchairClearWidthMeasuredMarginTool.execute;
export default wheelchairClearWidthMeasuredMarginTool;
