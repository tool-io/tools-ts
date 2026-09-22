import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedMass: number;
  readonly oldMoisture: number;
  readonly newMoisture: number;
};
export type Output = { readonly newMass: number; readonly change: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMass: { type: "number", minimum: 0 },
    oldMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    newMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["recordedMass", "oldMoisture", "newMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newMass: { type: "number" }, change: { type: "number" } },
  required: ["newMass", "change"],
} as const;
/** Calculate feed batch dry mass adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedMass, oldMoisture, newMoisture } = request;
  const compute = (): Output => {
    H.domain(
      recordedMass >= 0 &&
        oldMoisture >= 0 &&
        oldMoisture < 1 &&
        newMoisture >= 0 &&
        newMoisture < 1,
    );
    return {
      newMass: (recordedMass * (1 - oldMoisture)) / (1 - newMoisture),
      change:
        (recordedMass * (1 - oldMoisture)) / (1 - newMoisture) - recordedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedMass: 100, oldMoisture: 0.2, newMoisture: 0.1 },
  output: { newMass: 88.88888888888889, change: -11.111111111111114 },
} satisfies ToolExample<Input, Output>;
export const feedBatchDryMassAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/feed-batch-dry-mass-adjustment",
    title: "Feed Batch Dry Mass Adjustment Tool",
    description:
      "Calculate feed batch dry mass adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedMass: { type: "number", minimum: 0 },
        oldMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        newMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["recordedMass", "oldMoisture", "newMoisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newMass: { type: "number" }, change: { type: "number" } },
      required: ["newMass", "change"],
    },
    ports: {
      inputs: [
        {
          id: "recordedMass",
          label: "Recorded Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldMoisture",
          label: "Old Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newMoisture",
          label: "New Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newMass", label: "New Mass", valueType: { type: "number" } },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = feedBatchDryMassAdjustmentTool.execute;
export default feedBatchDryMassAdjustmentTool;
