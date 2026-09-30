import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSourceEndDay: number;
  readonly secondSourceStartDay: number;
  readonly sharedBoundaryDay: boolean;
};
export type Output = { readonly gapDays: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSourceEndDay: { type: "integer" },
    secondSourceStartDay: { type: "integer" },
    sharedBoundaryDay: { type: "boolean" },
  },
  required: ["firstSourceEndDay", "secondSourceStartDay", "sharedBoundaryDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapDays: { type: "integer" }, overlaps: { type: "boolean" } },
  required: ["gapDays", "overlaps"],
} as const;
/** Compare supplied absolute day indices and their endpoint convention without selecting an observational calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSourceEndDay, secondSourceStartDay, sharedBoundaryDay } =
    request;
  const compute = (): Output => {
    return {
      gapDays:
        secondSourceStartDay - firstSourceEndDay - (sharedBoundaryDay ? 0 : 1),
      overlaps: secondSourceStartDay < firstSourceEndDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSourceEndDay: 100,
    secondSourceStartDay: 102,
    sharedBoundaryDay: false,
  },
  output: { gapDays: 1, overlaps: false },
} satisfies ToolExample<Input, Output>;
export const hijriSourceMonthBoundaryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/hijri-source-month-boundary-gap",
    title: "Hijri Source Month Boundary Gap Tool",
    description:
      "Compare supplied absolute day indices and their endpoint convention without selecting an observational calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSourceEndDay: { type: "integer" },
        secondSourceStartDay: { type: "integer" },
        sharedBoundaryDay: { type: "boolean" },
      },
      required: [
        "firstSourceEndDay",
        "secondSourceStartDay",
        "sharedBoundaryDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDays: { type: "integer" },
        overlaps: { type: "boolean" },
      },
      required: ["gapDays", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "firstSourceEndDay",
          label: "First Source End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSourceStartDay",
          label: "Second Source Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedBoundaryDay",
          label: "Shared Boundary Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hijriSourceMonthBoundaryGapTool.execute;
export default hijriSourceMonthBoundaryGapTool;
