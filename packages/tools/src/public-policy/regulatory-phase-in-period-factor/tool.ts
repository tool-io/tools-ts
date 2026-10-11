import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedPeriods: number;
  readonly suppliedPhaseInPeriods: number;
};
export type Output = { readonly phaseInFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedPeriods: { type: "number" },
    suppliedPhaseInPeriods: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elapsedPeriods", "suppliedPhaseInPeriods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseInFactor: { type: "number" } },
  required: ["phaseInFactor"],
} as const;
/** Calculate a clamped linear phase-in factor from explicit elapsed periods and a supplied duration without selecting regulatory schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedPeriods, suppliedPhaseInPeriods } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedPhaseInPeriods) && suppliedPhaseInPeriods > 0,
      "suppliedPhaseInPeriods",
    ),
      suppliedPhaseInPeriods);
    return {
      phaseInFactor: Math.min(
        1,
        Math.max(0, elapsedPeriods / suppliedPhaseInPeriods),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedPeriods: 3, suppliedPhaseInPeriods: 12 },
  output: { phaseInFactor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const regulatoryPhaseInPeriodFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/regulatory-phase-in-period-factor",
    title: "Regulatory Phase In Period Factor",
    description:
      "Calculate a clamped linear phase-in factor from explicit elapsed periods and a supplied duration without selecting regulatory schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedPeriods: { type: "number" },
        suppliedPhaseInPeriods: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["elapsedPeriods", "suppliedPhaseInPeriods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseInFactor: { type: "number" } },
      required: ["phaseInFactor"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedPeriods",
          label: "Elapsed Periods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPhaseInPeriods",
          label: "Supplied Phase In Periods",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseInFactor",
          label: "Phase In Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regulatoryPhaseInPeriodFactorTool.execute;
export default regulatoryPhaseInPeriodFactorTool;
