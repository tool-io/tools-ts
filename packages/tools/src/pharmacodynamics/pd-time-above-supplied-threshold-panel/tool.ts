import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstResponse: number;
  readonly secondResponse: number;
  readonly threshold: number;
};
export type Output = {
  readonly durationAbove: number;
  readonly fractionAbove: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstResponse: { type: "number" },
    secondResponse: { type: "number" },
    threshold: { type: "number" },
  },
  required: [
    "firstTime",
    "secondTime",
    "firstResponse",
    "secondResponse",
    "threshold",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationAbove: { type: "number" },
    fractionAbove: { type: "number" },
  },
  required: ["durationAbove", "fractionAbove"],
} as const;
/** Exact above-threshold duration within a linearly interpolated research panel. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstResponse, secondResponse, threshold } =
    request;
  const compute = (): Output => {
    H.domain(secondTime > firstTime);
    let fractionAbove: number;
    if (firstResponse === secondResponse)
      fractionAbove = firstResponse > threshold ? 1 : 0;
    else {
      const crossing =
        (threshold - firstResponse) / (secondResponse - firstResponse);
      fractionAbove =
        secondResponse > firstResponse
          ? 1 - Math.min(1, Math.max(0, crossing))
          : Math.min(1, Math.max(0, crossing));
    }
    return {
      durationAbove: (secondTime - firstTime) * fractionAbove,
      fractionAbove,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 0,
    secondTime: 10,
    firstResponse: 0,
    secondResponse: 10,
    threshold: 4,
  },
  output: { durationAbove: 6, fractionAbove: 0.6 },
} satisfies ToolExample<Input, Output>;
export const pdTimeAboveSuppliedThresholdPanelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-time-above-supplied-threshold-panel",
    title: "PD Time Above Supplied Threshold Panel Tool",
    description:
      "Exact above-threshold duration within a linearly interpolated research panel.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstResponse: { type: "number" },
        secondResponse: { type: "number" },
        threshold: { type: "number" },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstResponse",
        "secondResponse",
        "threshold",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationAbove: { type: "number" },
        fractionAbove: { type: "number" },
      },
      required: ["durationAbove", "fractionAbove"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstResponse",
          label: "First Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondResponse",
          label: "Second Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationAbove",
          label: "Duration Above",
          valueType: { type: "number" },
        },
        {
          id: "fractionAbove",
          label: "Fraction Above",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdTimeAboveSuppliedThresholdPanelTool.execute;
export default pdTimeAboveSuppliedThresholdPanelTool;
