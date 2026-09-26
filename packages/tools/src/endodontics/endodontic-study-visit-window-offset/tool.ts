import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anchorDay: number;
  readonly nominalOffset: number;
  readonly observedDay: number;
  readonly windowBefore: number;
  readonly windowAfter: number;
};
export type Output = {
  readonly relativeDay: number;
  readonly deviation: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorDay: { type: "integer" },
    nominalOffset: { type: "integer" },
    observedDay: { type: "integer" },
    windowBefore: { type: "integer", minimum: 0 },
    windowAfter: { type: "integer", minimum: 0 },
  },
  required: [
    "anchorDay",
    "nominalOffset",
    "observedDay",
    "windowBefore",
    "windowAfter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeDay: { type: "integer" },
    deviation: { type: "integer" },
    withinWindow: { type: "boolean" },
  },
  required: ["relativeDay", "deviation", "withinWindow"],
} as const;
/** Validate research followup timing against explicit anchor-relative bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchorDay, nominalOffset, observedDay, windowBefore, windowAfter } =
    request;
  const compute = (): Output => {
    H.integer(windowBefore, 0);
    H.integer(windowAfter, 0);
    return {
      relativeDay: observedDay - anchorDay,
      deviation: observedDay - anchorDay - nominalOffset,
      withinWindow:
        observedDay >= anchorDay + nominalOffset - windowBefore &&
        observedDay <= anchorDay + nominalOffset + windowAfter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    anchorDay: 100,
    nominalOffset: 30,
    observedDay: 132,
    windowBefore: 2,
    windowAfter: 4,
  },
  output: { relativeDay: 32, deviation: 2, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const endodonticStudyVisitWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/endodontic-study-visit-window-offset",
    title: "Endodontic Study Visit Window Offset Tool",
    description:
      "Validate research followup timing against explicit anchor-relative bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorDay: { type: "integer" },
        nominalOffset: { type: "integer" },
        observedDay: { type: "integer" },
        windowBefore: { type: "integer", minimum: 0 },
        windowAfter: { type: "integer", minimum: 0 },
      },
      required: [
        "anchorDay",
        "nominalOffset",
        "observedDay",
        "windowBefore",
        "windowAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeDay: { type: "integer" },
        deviation: { type: "integer" },
        withinWindow: { type: "boolean" },
      },
      required: ["relativeDay", "deviation", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "anchorDay",
          label: "Anchor Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nominalOffset",
          label: "Nominal Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedDay",
          label: "Observed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowBefore",
          label: "Window Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowAfter",
          label: "Window After",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "relativeDay",
          label: "Relative Day",
          valueType: { type: "integer" },
        },
        { id: "deviation", label: "Deviation", valueType: { type: "integer" } },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = endodonticStudyVisitWindowOffsetTool.execute;
export default endodonticStudyVisitWindowOffsetTool;
