import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prevalence: number;
  readonly incidencePerTime: number;
  readonly meanDuration: number;
};
export type Output = {
  readonly approximatePrevalence: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prevalence: { type: "number", minimum: 0, maximum: 1 },
    incidencePerTime: { type: "number", minimum: 0 },
    meanDuration: { type: "number", minimum: 0 },
  },
  required: ["prevalence", "incidencePerTime", "meanDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approximatePrevalence: { type: "number" },
    residual: { type: "number" },
  },
  required: ["approximatePrevalence", "residual"],
} as const;
/** Compare prevalence against the rare-disease stationary approximation P≈I*D; outputs are not a prevalence estimate outside those assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prevalence, incidencePerTime, meanDuration } = request;
  const compute = (): Output => {
    H.probability(prevalence);
    H.domain(incidencePerTime >= 0 && meanDuration >= 0);
    return {
      approximatePrevalence: incidencePerTime * meanDuration,
      residual: prevalence - incidencePerTime * meanDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prevalence: 0.1, incidencePerTime: 0.02, meanDuration: 4 },
  output: { approximatePrevalence: 0.08, residual: 0.020000000000000004 },
} satisfies ToolExample<Input, Output>;
export const prevalenceIncidenceDurationResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/prevalence-incidence-duration-residual",
      title: "Prevalence Incidence Duration Residual Tool",
      description:
        "Compare prevalence against the rare-disease stationary approximation P≈I*D; outputs are not a prevalence estimate outside those assumptions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prevalence: { type: "number", minimum: 0, maximum: 1 },
          incidencePerTime: { type: "number", minimum: 0 },
          meanDuration: { type: "number", minimum: 0 },
        },
        required: ["prevalence", "incidencePerTime", "meanDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          approximatePrevalence: { type: "number" },
          residual: { type: "number" },
        },
        required: ["approximatePrevalence", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "prevalence",
            label: "Prevalence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incidencePerTime",
            label: "Incidence Per Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "meanDuration",
            label: "Mean Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "approximatePrevalence",
            label: "Approximate Prevalence",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = prevalenceIncidenceDurationResidualTool.execute;
export default prevalenceIncidenceDurationResidualTool;
