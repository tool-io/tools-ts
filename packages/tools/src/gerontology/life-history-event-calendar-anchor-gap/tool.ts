import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recalledYear: number;
  readonly anchorYear: number;
  readonly recalledOffset: number;
};
export type Output = {
  readonly impliedYear: number;
  readonly disagreementYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recalledYear: { type: "integer" },
    anchorYear: { type: "integer" },
    recalledOffset: { type: "integer" },
  },
  required: ["recalledYear", "anchorYear", "recalledOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedYear: { type: "integer" },
    disagreementYears: { type: "integer" },
  },
  required: ["impliedYear", "disagreementYears"],
} as const;
/** Integer astronomical years and a signed recalled offset from an explicit historical anchor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recalledYear, anchorYear, recalledOffset } = request;
  const compute = (): Output => {
    return {
      impliedYear: anchorYear + recalledOffset,
      disagreementYears: recalledYear - anchorYear - recalledOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recalledYear: 1985, anchorYear: 1980, recalledOffset: 3 },
  output: { impliedYear: 1983, disagreementYears: 2 },
} satisfies ToolExample<Input, Output>;
export const lifeHistoryEventCalendarAnchorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/life-history-event-calendar-anchor-gap",
    title: "Life History Event Calendar Anchor Gap Tool",
    description:
      "Integer astronomical years and a signed recalled offset from an explicit historical anchor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recalledYear: { type: "integer" },
        anchorYear: { type: "integer" },
        recalledOffset: { type: "integer" },
      },
      required: ["recalledYear", "anchorYear", "recalledOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedYear: { type: "integer" },
        disagreementYears: { type: "integer" },
      },
      required: ["impliedYear", "disagreementYears"],
    },
    ports: {
      inputs: [
        {
          id: "recalledYear",
          label: "Recalled Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anchorYear",
          label: "Anchor Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recalledOffset",
          label: "Recalled Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "impliedYear",
          label: "Implied Year",
          valueType: { type: "integer" },
        },
        {
          id: "disagreementYears",
          label: "Disagreement Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = lifeHistoryEventCalendarAnchorGapTool.execute;
export default lifeHistoryEventCalendarAnchorGapTool;
