import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly exposureStart: number;
  readonly exposureEnd: number;
  readonly includeEnd: boolean;
};
export type Output = { readonly insideExposureWindow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    exposureStart: { type: "number" },
    exposureEnd: { type: "number" },
    includeEnd: { type: "boolean" },
  },
  required: ["eventTime", "exposureStart", "exposureEnd", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { insideExposureWindow: { type: "boolean" } },
  required: ["insideExposureWindow"],
} as const;
/** Check a supplied event timestamp against explicit exposure bounds and endpoint policy without inferring transmission or causation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, exposureStart, exposureEnd, includeEnd } = request;
  const compute = (): Output => {
    H.domain(exposureEnd >= exposureStart, "exposureEnd");
    return {
      insideExposureWindow:
        eventTime >= exposureStart &&
        (includeEnd ? eventTime <= exposureEnd : eventTime < exposureEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 5, exposureStart: 2, exposureEnd: 5, includeEnd: false },
  output: { insideExposureWindow: false },
} satisfies ToolExample<Input, Output>;
export const exposureWindowOverlapSingleEventTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/exposure-window-overlap-single-event",
    title: "Exposure Window Overlap Single Event Tool",
    description:
      "Check a supplied event timestamp against explicit exposure bounds and endpoint policy without inferring transmission or causation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        exposureStart: { type: "number" },
        exposureEnd: { type: "number" },
        includeEnd: { type: "boolean" },
      },
      required: ["eventTime", "exposureStart", "exposureEnd", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { insideExposureWindow: { type: "boolean" } },
      required: ["insideExposureWindow"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureStart",
          label: "Exposure Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureEnd",
          label: "Exposure End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "insideExposureWindow",
          label: "Inside Exposure Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureWindowOverlapSingleEventTool.execute;
export default exposureWindowOverlapSingleEventTool;
