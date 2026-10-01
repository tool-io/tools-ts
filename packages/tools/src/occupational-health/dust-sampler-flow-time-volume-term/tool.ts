import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startFlow: number;
  readonly endFlow: number;
  readonly minutes: number;
  readonly blankVolume: number;
};
export type Output = {
  readonly grossVolume: number;
  readonly correctedVolume: number;
  readonly meanFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startFlow: { type: "number", minimum: 0 },
    endFlow: { type: "number", minimum: 0 },
    minutes: { type: "number", minimum: 0 },
    blankVolume: { type: "number", minimum: 0 },
  },
  required: ["startFlow", "endFlow", "minutes", "blankVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolume: { type: "number" },
    correctedVolume: { type: "number" },
    meanFlow: { type: "number" },
  },
  required: ["grossVolume", "correctedVolume", "meanFlow"],
} as const;
/** Trapezoidal sampler flow integration with an explicit volume correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startFlow, endFlow, minutes, blankVolume } = request;
  const compute = (): Output => {
    H.domain(
      startFlow >= 0 && endFlow >= 0 && minutes >= 0 && blankVolume >= 0,
    );
    return {
      grossVolume: ((startFlow + endFlow) * minutes) / 2,
      correctedVolume: ((startFlow + endFlow) * minutes) / 2 - blankVolume,
      meanFlow: (startFlow + endFlow) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startFlow: 2, endFlow: 2.2, minutes: 60, blankVolume: 1 },
  output: { grossVolume: 126, correctedVolume: 125, meanFlow: 2.1 },
} satisfies ToolExample<Input, Output>;
export const dustSamplerFlowTimeVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/dust-sampler-flow-time-volume-term",
    title: "Dust Sampler Flow Time Volume Term Tool",
    description:
      "Trapezoidal sampler flow integration with an explicit volume correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startFlow: { type: "number", minimum: 0 },
        endFlow: { type: "number", minimum: 0 },
        minutes: { type: "number", minimum: 0 },
        blankVolume: { type: "number", minimum: 0 },
      },
      required: ["startFlow", "endFlow", "minutes", "blankVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossVolume: { type: "number" },
        correctedVolume: { type: "number" },
        meanFlow: { type: "number" },
      },
      required: ["grossVolume", "correctedVolume", "meanFlow"],
    },
    ports: {
      inputs: [
        {
          id: "startFlow",
          label: "Start Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endFlow",
          label: "End Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minutes",
          label: "Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankVolume",
          label: "Blank Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossVolume",
          label: "Gross Volume",
          valueType: { type: "number" },
        },
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
        { id: "meanFlow", label: "Mean Flow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dustSamplerFlowTimeVolumeTermTool.execute;
export default dustSamplerFlowTimeVolumeTermTool;
