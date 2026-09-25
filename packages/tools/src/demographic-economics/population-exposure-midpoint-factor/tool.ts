import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly populationStart: number;
  readonly populationEnd: number;
  readonly duration: number;
};
export type Output = {
  readonly midpointPopulation: number;
  readonly exposure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationStart: { type: "number", minimum: 0 },
    populationEnd: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["populationStart", "populationEnd", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpointPopulation: { type: "number" },
    exposure: { type: "number" },
  },
  required: ["midpointPopulation", "exposure"],
} as const;
/** Approximate person-time under linear population change without estimating births or survival. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { populationStart, populationEnd, duration } = request;
  const compute = (): Output => {
    H.domain(populationStart >= 0 && populationEnd >= 0 && duration >= 0);
    return {
      midpointPopulation: populationStart / 2 + populationEnd / 2,
      exposure: (populationStart / 2 + populationEnd / 2) * duration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { populationStart: 100, populationEnd: 120, duration: 2 },
  output: { midpointPopulation: 110, exposure: 220 },
} satisfies ToolExample<Input, Output>;
export const populationExposureMidpointFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/population-exposure-midpoint-factor",
    title: "Population Exposure Midpoint Factor Tool",
    description:
      "Approximate person-time under linear population change without estimating births or survival.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populationStart: { type: "number", minimum: 0 },
        populationEnd: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["populationStart", "populationEnd", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpointPopulation: { type: "number" },
        exposure: { type: "number" },
      },
      required: ["midpointPopulation", "exposure"],
    },
    ports: {
      inputs: [
        {
          id: "populationStart",
          label: "Population Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "populationEnd",
          label: "Population End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midpointPopulation",
          label: "Midpoint Population",
          valueType: { type: "number" },
        },
        { id: "exposure", label: "Exposure", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = populationExposureMidpointFactorTool.execute;
export default populationExposureMidpointFactorTool;
