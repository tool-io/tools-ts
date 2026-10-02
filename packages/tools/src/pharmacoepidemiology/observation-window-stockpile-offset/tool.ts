import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalEndDay: number;
  readonly suppliedCarriedDays: number;
  readonly observationEndDay: number;
  readonly countStockpile: boolean;
};
export type Output = {
  readonly adjustedEnd: number;
  readonly observedEnd: number;
  readonly beyondObservation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalEndDay: { type: "integer" },
    suppliedCarriedDays: { type: "integer", minimum: 0 },
    observationEndDay: { type: "integer" },
    countStockpile: { type: "boolean" },
  },
  required: [
    "nominalEndDay",
    "suppliedCarriedDays",
    "observationEndDay",
    "countStockpile",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedEnd: { type: "integer" },
    observedEnd: { type: "integer" },
    beyondObservation: { type: "integer" },
  },
  required: ["adjustedEnd", "observedEnd", "beyondObservation"],
} as const;
/** Apply a supplied stockpile-day scenario and observation censor boundary without inferring adherence or prescribing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    nominalEndDay,
    suppliedCarriedDays,
    observationEndDay,
    countStockpile,
  } = request;
  const compute = (): Output => {
    H.integer(suppliedCarriedDays, 0);
    return {
      adjustedEnd: nominalEndDay + (countStockpile ? suppliedCarriedDays : 0),
      observedEnd: Math.min(
        observationEndDay,
        nominalEndDay + (countStockpile ? suppliedCarriedDays : 0),
      ),
      beyondObservation: Math.max(
        0,
        nominalEndDay +
          (countStockpile ? suppliedCarriedDays : 0) -
          observationEndDay,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalEndDay: 100,
    suppliedCarriedDays: 20,
    observationEndDay: 110,
    countStockpile: true,
  },
  output: { adjustedEnd: 120, observedEnd: 110, beyondObservation: 10 },
} satisfies ToolExample<Input, Output>;
export const observationWindowStockpileOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/observation-window-stockpile-offset",
    title: "Observation Window Stockpile Offset Tool",
    description:
      "Apply a supplied stockpile-day scenario and observation censor boundary without inferring adherence or prescribing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalEndDay: { type: "integer" },
        suppliedCarriedDays: { type: "integer", minimum: 0 },
        observationEndDay: { type: "integer" },
        countStockpile: { type: "boolean" },
      },
      required: [
        "nominalEndDay",
        "suppliedCarriedDays",
        "observationEndDay",
        "countStockpile",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedEnd: { type: "integer" },
        observedEnd: { type: "integer" },
        beyondObservation: { type: "integer" },
      },
      required: ["adjustedEnd", "observedEnd", "beyondObservation"],
    },
    ports: {
      inputs: [
        {
          id: "nominalEndDay",
          label: "Nominal End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCarriedDays",
          label: "Supplied Carried Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationEndDay",
          label: "Observation End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countStockpile",
          label: "Count Stockpile",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "adjustedEnd",
          label: "Adjusted End",
          valueType: { type: "integer" },
        },
        {
          id: "observedEnd",
          label: "Observed End",
          valueType: { type: "integer" },
        },
        {
          id: "beyondObservation",
          label: "Beyond Observation",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = observationWindowStockpileOffsetTool.execute;
export default observationWindowStockpileOffsetTool;
