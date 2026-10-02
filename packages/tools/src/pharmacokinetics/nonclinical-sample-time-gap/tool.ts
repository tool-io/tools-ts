import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedTimes: readonly number[];
  readonly measuredTimes: readonly number[];
  readonly suppliedOrigin: number;
};
export type Output = {
  readonly plannedRelative: readonly number[];
  readonly measuredRelative: readonly number[];
  readonly timingResiduals: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    measuredTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedOrigin: { type: "number" },
  },
  required: ["plannedTimes", "measuredTimes", "suppliedOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedRelative: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    measuredRelative: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    timingResiduals: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["plannedRelative", "measuredRelative", "timingResiduals"],
} as const;
/** Compare explicit nonclinical sample clocks; no dose, clearance or exposure model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedTimes, measuredTimes, suppliedOrigin } = request;
  const compute = (): Output => {
    H.sameLength(plannedTimes, measuredTimes);
    return {
      plannedRelative: plannedTimes.map((x) => x - suppliedOrigin),
      measuredRelative: measuredTimes.map((x) => x - suppliedOrigin),
      timingResiduals: measuredTimes.map((x, i) => x - plannedTimes[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedTimes: [10, 20], measuredTimes: [11, 19], suppliedOrigin: 5 },
  output: {
    plannedRelative: [5, 15],
    measuredRelative: [6, 14],
    timingResiduals: [1, -1],
  },
} satisfies ToolExample<Input, Output>;
export const nonclinicalSampleTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/nonclinical-sample-time-gap",
    title: "Nonclinical Sample Time Gap Tool",
    description:
      "Compare explicit nonclinical sample clocks; no dose, clearance or exposure model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        measuredTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedOrigin: { type: "number" },
      },
      required: ["plannedTimes", "measuredTimes", "suppliedOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedRelative: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        measuredRelative: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        timingResiduals: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["plannedRelative", "measuredRelative", "timingResiduals"],
    },
    ports: {
      inputs: [
        {
          id: "plannedTimes",
          label: "Planned Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "measuredTimes",
          label: "Measured Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedOrigin",
          label: "Supplied Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plannedRelative",
          label: "Planned Relative",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "measuredRelative",
          label: "Measured Relative",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "timingResiduals",
          label: "Timing Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = nonclinicalSampleTimeGapTool.execute;
export default nonclinicalSampleTimeGapTool;
