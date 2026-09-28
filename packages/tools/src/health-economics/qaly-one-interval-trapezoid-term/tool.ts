import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startUtility: number;
  readonly endUtility: number;
  readonly durationYears: number;
};
export type Output = { readonly meanUtility: number; readonly qalys: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startUtility: { type: "number" },
    endUtility: { type: "number" },
    durationYears: { type: "number", minimum: 0 },
  },
  required: ["startUtility", "endUtility", "durationYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanUtility: { type: "number" }, qalys: { type: "number" } },
  required: ["meanUtility", "qalys"],
} as const;
/** Linear utility interpolation over one interval; negative health-state utilities remain allowed and no utility tariff is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startUtility, endUtility, durationYears } = request;
  const compute = (): Output => {
    H.domain(durationYears >= 0);
    return {
      meanUtility: (startUtility + endUtility) / 2,
      qalys: ((startUtility + endUtility) * durationYears) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startUtility: 0.6, endUtility: 0.8, durationYears: 2 },
  output: { meanUtility: 0.7, qalys: 1.4 },
} satisfies ToolExample<Input, Output>;
export const qalyOneIntervalTrapezoidTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/qaly-one-interval-trapezoid-term",
    title: "QALY One Interval Trapezoid Term Tool",
    description:
      "Linear utility interpolation over one interval; negative health-state utilities remain allowed and no utility tariff is supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startUtility: { type: "number" },
        endUtility: { type: "number" },
        durationYears: { type: "number", minimum: 0 },
      },
      required: ["startUtility", "endUtility", "durationYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanUtility: { type: "number" },
        qalys: { type: "number" },
      },
      required: ["meanUtility", "qalys"],
    },
    ports: {
      inputs: [
        {
          id: "startUtility",
          label: "Start Utility",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endUtility",
          label: "End Utility",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationYears",
          label: "Duration Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanUtility",
          label: "Mean Utility",
          valueType: { type: "number" },
        },
        { id: "qalys", label: "Qalys", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = qalyOneIntervalTrapezoidTermTool.execute;
export default qalyOneIntervalTrapezoidTermTool;
