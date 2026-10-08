import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly boolean[];
  readonly stepIndex: number;
};
export type Output = {
  readonly dropout: boolean;
  readonly consecutiveMissingThroughStep: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    stepIndex: { type: "integer", minimum: 0 },
  },
  required: ["observed", "stepIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dropout: { type: "boolean" },
    consecutiveMissingThroughStep: { type: "integer" },
  },
  required: ["dropout", "consecutiveMissingThroughStep"],
} as const;
/** Inspect an explicit sample-availability mask at one step and count the immediately preceding consecutive dropout run. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, stepIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(stepIndex) &&
        stepIndex >= 0 &&
        stepIndex <= observed.length - 1,
      "stepIndex",
    ),
      stepIndex);
    let consecutiveMissingThroughStep = 0;
    for (let i = stepIndex; i >= 0 && !observed[i]; i--)
      consecutiveMissingThroughStep++;
    return { dropout: !observed[stepIndex], consecutiveMissingThroughStep };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [true, false, false, true], stepIndex: 2 },
  output: { dropout: true, consecutiveMissingThroughStep: 2 },
} satisfies ToolExample<Input, Output>;
export const sensorDropoutTimeStepFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/sensor-dropout-time-step-flag",
    title: "Sensor Dropout Time Step Flag",
    description:
      "Inspect an explicit sample-availability mask at one step and count the immediately preceding consecutive dropout run.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        stepIndex: { type: "integer", minimum: 0 },
      },
      required: ["observed", "stepIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dropout: { type: "boolean" },
        consecutiveMissingThroughStep: { type: "integer" },
      },
      required: ["dropout", "consecutiveMissingThroughStep"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "stepIndex",
          label: "Step Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "dropout", label: "Dropout", valueType: { type: "boolean" } },
        {
          id: "consecutiveMissingThroughStep",
          label: "Consecutive Missing Through Step",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sensorDropoutTimeStepFlagTool.execute;
export default sensorDropoutTimeStepFlagTool;
