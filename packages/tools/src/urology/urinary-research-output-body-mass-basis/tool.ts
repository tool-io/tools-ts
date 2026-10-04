import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outputVolume: number;
  readonly observedHours: number;
  readonly bodyMass: number;
  readonly excludedHours: number;
};
export type Output = {
  readonly effectiveHours: number;
  readonly perHour: number;
  readonly perMassHour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputVolume: { type: "number", minimum: 0 },
    observedHours: { type: "number" },
    bodyMass: { type: "number", exclusiveMinimum: 0 },
    excludedHours: { type: "number", minimum: 0 },
  },
  required: ["outputVolume", "observedHours", "bodyMass", "excludedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveHours: { type: "number" },
    perHour: { type: "number" },
    perMassHour: { type: "number" },
  },
  required: ["effectiveHours", "perHour", "perMassHour"],
} as const;
/** Research collection output per explicitly observed body-mass time, without urine-output thresholds or medical decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outputVolume, observedHours, bodyMass, excludedHours } = request;
  const compute = (): Output => {
    H.domain(
      outputVolume >= 0 && excludedHours >= 0 && observedHours > excludedHours,
    );
    H.positive(bodyMass);
    return {
      effectiveHours: observedHours - excludedHours,
      perHour: outputVolume / (observedHours - excludedHours),
      perMassHour: outputVolume / (bodyMass * (observedHours - excludedHours)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outputVolume: 400,
    observedHours: 10,
    bodyMass: 50,
    excludedHours: 2,
  },
  output: { effectiveHours: 8, perHour: 50, perMassHour: 1 },
} satisfies ToolExample<Input, Output>;
export const urinaryResearchOutputBodyMassBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/urinary-research-output-body-mass-basis",
    title: "Urinary Research Output Body Mass Basis Tool",
    description:
      "Research collection output per explicitly observed body-mass time, without urine-output thresholds or medical decisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputVolume: { type: "number", minimum: 0 },
        observedHours: { type: "number" },
        bodyMass: { type: "number", exclusiveMinimum: 0 },
        excludedHours: { type: "number", minimum: 0 },
      },
      required: ["outputVolume", "observedHours", "bodyMass", "excludedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveHours: { type: "number" },
        perHour: { type: "number" },
        perMassHour: { type: "number" },
      },
      required: ["effectiveHours", "perHour", "perMassHour"],
    },
    ports: {
      inputs: [
        {
          id: "outputVolume",
          label: "Output Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedHours",
          label: "Observed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyMass",
          label: "Body Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedHours",
          label: "Excluded Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveHours",
          label: "Effective Hours",
          valueType: { type: "number" },
        },
        { id: "perHour", label: "Per Hour", valueType: { type: "number" } },
        {
          id: "perMassHour",
          label: "Per Mass Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urinaryResearchOutputBodyMassBasisTool.execute;
export default urinaryResearchOutputBodyMassBasisTool;
