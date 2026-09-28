import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryMonth: number;
  readonly exitMonth: number;
  readonly waveStartMonth: number;
  readonly waveEndMonth: number;
};
export type Output = {
  readonly exposureMonths: number;
  readonly waveFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryMonth: { type: "number" },
    exitMonth: { type: "number" },
    waveStartMonth: { type: "number" },
    waveEndMonth: { type: "number" },
  },
  required: ["entryMonth", "exitMonth", "waveStartMonth", "waveEndMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureMonths: { type: "number" },
    waveFraction: { type: "number" },
  },
  required: ["exposureMonths", "waveFraction"],
} as const;
/** Half-open month-coordinate overlap, without assigning calendar months fixed day counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryMonth, exitMonth, waveStartMonth, waveEndMonth } = request;
  const compute = (): Output => {
    H.domain(exitMonth >= entryMonth && waveEndMonth > waveStartMonth);
    return {
      exposureMonths: Math.max(
        0,
        Math.min(exitMonth, waveEndMonth) -
          Math.max(entryMonth, waveStartMonth),
      ),
      waveFraction:
        Math.max(
          0,
          Math.min(exitMonth, waveEndMonth) -
            Math.max(entryMonth, waveStartMonth),
        ) /
        (waveEndMonth - waveStartMonth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryMonth: 2, exitMonth: 10, waveStartMonth: 0, waveEndMonth: 12 },
  output: { exposureMonths: 8, waveFraction: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const agingPanelExposureMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/aging-panel-exposure-month-term",
    title: "Aging Panel Exposure Month Term Tool",
    description:
      "Half-open month-coordinate overlap, without assigning calendar months fixed day counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryMonth: { type: "number" },
        exitMonth: { type: "number" },
        waveStartMonth: { type: "number" },
        waveEndMonth: { type: "number" },
      },
      required: ["entryMonth", "exitMonth", "waveStartMonth", "waveEndMonth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureMonths: { type: "number" },
        waveFraction: { type: "number" },
      },
      required: ["exposureMonths", "waveFraction"],
    },
    ports: {
      inputs: [
        {
          id: "entryMonth",
          label: "Entry Month",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exitMonth",
          label: "Exit Month",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waveStartMonth",
          label: "Wave Start Month",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waveEndMonth",
          label: "Wave End Month",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exposureMonths",
          label: "Exposure Months",
          valueType: { type: "number" },
        },
        {
          id: "waveFraction",
          label: "Wave Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agingPanelExposureMonthTermTool.execute;
export default agingPanelExposureMonthTermTool;
