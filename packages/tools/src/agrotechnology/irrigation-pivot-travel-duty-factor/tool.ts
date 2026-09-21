import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly revolutionSeconds: number;
  readonly dutyFraction: number;
};
export type Output = {
  readonly activeTipSpeed: number;
  readonly meanTipSpeed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    revolutionSeconds: { type: "number", exclusiveMinimum: 0 },
    dutyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["radius", "revolutionSeconds", "dutyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeTipSpeed: { type: "number" },
    meanTipSpeed: { type: "number" },
  },
  required: ["activeTipSpeed", "meanTipSpeed"],
} as const;
/** Calculate irrigation pivot travel duty factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, revolutionSeconds, dutyFraction } = request;
  const compute = (): Output => {
    H.domain(radius >= 0);
    H.positive(revolutionSeconds);
    H.probability(dutyFraction);
    return {
      activeTipSpeed: (2 * Math.PI * radius) / revolutionSeconds,
      meanTipSpeed: (2 * Math.PI * radius * dutyFraction) / revolutionSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 100, revolutionSeconds: 1000, dutyFraction: 0.5 },
  output: {
    activeTipSpeed: 0.6283185307179586,
    meanTipSpeed: 0.3141592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const irrigationPivotTravelDutyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/irrigation-pivot-travel-duty-factor",
    title: "Irrigation Pivot Travel Duty Factor Tool",
    description:
      "Calculate irrigation pivot travel duty factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        revolutionSeconds: { type: "number", exclusiveMinimum: 0 },
        dutyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["radius", "revolutionSeconds", "dutyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeTipSpeed: { type: "number" },
        meanTipSpeed: { type: "number" },
      },
      required: ["activeTipSpeed", "meanTipSpeed"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revolutionSeconds",
          label: "Revolution Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "activeTipSpeed",
          label: "Active Tip Speed",
          valueType: { type: "number" },
        },
        {
          id: "meanTipSpeed",
          label: "Mean Tip Speed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = irrigationPivotTravelDutyFactorTool.execute;
export default irrigationPivotTravelDutyFactorTool;
