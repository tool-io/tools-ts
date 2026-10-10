import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly missingDuration: number;
  readonly stormObservationDuration: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingDuration: { type: "number", minimum: 0 },
    stormObservationDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["missingDuration", "stormObservationDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied storm observation missing-duration fraction and observed remainder without estimating missing rainfall. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { missingDuration, stormObservationDuration } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(stormObservationDuration) && stormObservationDuration > 0,
      "stormObservationDuration",
    ),
      stormObservationDuration);
    H.domain(
      missingDuration >= 0 && missingDuration <= stormObservationDuration,
      "missingDuration",
    );
    return {
      fraction: missingDuration / stormObservationDuration,
      remainder: stormObservationDuration - missingDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { missingDuration: 30, stormObservationDuration: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const stormTotalMissingIntervalFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/storm-total-missing-interval-fraction",
    title: "Storm Total Missing Interval Fraction Tool",
    description:
      "Calculate supplied storm observation missing-duration fraction and observed remainder without estimating missing rainfall.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingDuration: { type: "number", minimum: 0 },
        stormObservationDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["missingDuration", "stormObservationDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "missingDuration",
          label: "Missing Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stormObservationDuration",
          label: "Storm Observation Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stormTotalMissingIntervalFractionTool.execute;
export default stormTotalMissingIntervalFractionTool;
