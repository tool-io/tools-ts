import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly customerKw: number;
  readonly customerOwnPeakKw: number;
  readonly systemPeak: boolean;
};
export type Output = {
  readonly coincidentKw: number;
  readonly ownPeakFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    customerKw: { type: "number", minimum: 0 },
    customerOwnPeakKw: { type: "number", exclusiveMinimum: 0 },
    systemPeak: { type: "boolean" },
  },
  required: ["customerKw", "customerOwnPeakKw", "systemPeak"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coincidentKw: { type: "number" },
    ownPeakFraction: { type: "number" },
  },
  required: ["coincidentKw", "ownPeakFraction"],
} as const;
/** Calculate peak demand coincidence one interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { customerKw, customerOwnPeakKw, systemPeak } = request;
  const compute = (): Output => {
    H.positive(customerOwnPeakKw);
    H.domain(customerKw >= 0 && customerKw <= customerOwnPeakKw);
    return {
      coincidentKw: systemPeak ? customerKw : 0,
      ownPeakFraction: customerKw / customerOwnPeakKw,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { customerKw: 30, customerOwnPeakKw: 50, systemPeak: true },
  output: { coincidentKw: 30, ownPeakFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const peakDemandCoincidenceOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/peak-demand-coincidence-one-interval",
    title: "Peak Demand Coincidence One Interval Tool",
    description:
      "Calculate peak demand coincidence one interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        customerKw: { type: "number", minimum: 0 },
        customerOwnPeakKw: { type: "number", exclusiveMinimum: 0 },
        systemPeak: { type: "boolean" },
      },
      required: ["customerKw", "customerOwnPeakKw", "systemPeak"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coincidentKw: { type: "number" },
        ownPeakFraction: { type: "number" },
      },
      required: ["coincidentKw", "ownPeakFraction"],
    },
    ports: {
      inputs: [
        {
          id: "customerKw",
          label: "Customer Kw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "customerOwnPeakKw",
          label: "Customer Own Peak Kw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "systemPeak",
          label: "System Peak",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "coincidentKw",
          label: "Coincident Kw",
          valueType: { type: "number" },
        },
        {
          id: "ownPeakFraction",
          label: "Own Peak Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = peakDemandCoincidenceOneIntervalTool.execute;
export default peakDemandCoincidenceOneIntervalTool;
