import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly independentHours: number;
  readonly assistedHours: number;
  readonly assistanceWeight: number;
};
export type Output = {
  readonly creditedHours: number;
  readonly unweightedHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    independentHours: { type: "number", minimum: 0 },
    assistedHours: { type: "number", minimum: 0 },
    assistanceWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["independentHours", "assistedHours", "assistanceWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedHours: { type: "number" },
    unweightedHours: { type: "number" },
  },
  required: ["creditedHours", "unweightedHours"],
} as const;
/** Calculate farmer training assisted hour base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { independentHours, assistedHours, assistanceWeight } = request;
  const compute = (): Output => {
    H.domain(independentHours >= 0 && assistedHours >= 0);
    H.probability(assistanceWeight);
    return {
      creditedHours: independentHours + assistedHours * assistanceWeight,
      unweightedHours: independentHours + assistedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { independentHours: 10, assistedHours: 4, assistanceWeight: 0.5 },
  output: { creditedHours: 12, unweightedHours: 14 },
} satisfies ToolExample<Input, Output>;
export const farmerTrainingAssistedHourBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farmer-training-assisted-hour-base",
    title: "Farmer Training Assisted Hour Base Tool",
    description:
      "Calculate farmer training assisted hour base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        independentHours: { type: "number", minimum: 0 },
        assistedHours: { type: "number", minimum: 0 },
        assistanceWeight: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["independentHours", "assistedHours", "assistanceWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedHours: { type: "number" },
        unweightedHours: { type: "number" },
      },
      required: ["creditedHours", "unweightedHours"],
    },
    ports: {
      inputs: [
        {
          id: "independentHours",
          label: "Independent Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assistedHours",
          label: "Assisted Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assistanceWeight",
          label: "Assistance Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedHours",
          label: "Credited Hours",
          valueType: { type: "number" },
        },
        {
          id: "unweightedHours",
          label: "Unweighted Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmerTrainingAssistedHourBaseTool.execute;
export default farmerTrainingAssistedHourBaseTool;
