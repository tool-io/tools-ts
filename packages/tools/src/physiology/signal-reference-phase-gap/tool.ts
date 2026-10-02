import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signalPhase: number;
  readonly referencePhase: number;
  readonly period: number;
  readonly radiansPerPeriod: number;
};
export type Output = { readonly phaseGap: number; readonly angularGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signalPhase: { type: "number" },
    referencePhase: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
    radiansPerPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["signalPhase", "referencePhase", "period", "radiansPerPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseGap: { type: "number" }, angularGap: { type: "number" } },
  required: ["phaseGap", "angularGap"],
} as const;
/** Calculate signal reference phase gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signalPhase, referencePhase, period, radiansPerPeriod } = request;
  const compute = (): Output => {
    H.positive(period);
    H.positive(radiansPerPeriod);
    return (() => {
      const r = ((signalPhase % period) - (referencePhase % period)) % period,
        p = r < 0 ? r + period : r,
        phaseGap = p > period / 2 ? p - period : p;
      return { phaseGap, angularGap: (phaseGap / period) * radiansPerPeriod };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signalPhase: 9,
    referencePhase: 1,
    period: 10,
    radiansPerPeriod: 6.283185307179586,
  },
  output: { phaseGap: -2, angularGap: -1.2566370614359172 },
} satisfies ToolExample<Input, Output>;
export const signalReferencePhaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/signal-reference-phase-gap",
    title: "Signal Reference Phase Gap Tool",
    description:
      "Calculate signal reference phase gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signalPhase: { type: "number" },
        referencePhase: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
        radiansPerPeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["signalPhase", "referencePhase", "period", "radiansPerPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseGap: { type: "number" },
        angularGap: { type: "number" },
      },
      required: ["phaseGap", "angularGap"],
    },
    ports: {
      inputs: [
        {
          id: "signalPhase",
          label: "Signal Phase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePhase",
          label: "Reference Phase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radiansPerPeriod",
          label: "Radians Per Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phaseGap", label: "Phase Gap", valueType: { type: "number" } },
        {
          id: "angularGap",
          label: "Angular Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = signalReferencePhaseGapTool.execute;
export default signalReferencePhaseGapTool;
