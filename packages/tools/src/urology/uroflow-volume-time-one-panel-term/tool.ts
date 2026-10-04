import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startFlow: number;
  readonly endFlow: number;
  readonly startSeconds: number;
  readonly endSeconds: number;
};
export type Output = {
  readonly meanFlow: number;
  readonly panelVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startFlow: { type: "number" },
    endFlow: { type: "number" },
    startSeconds: { type: "number" },
    endSeconds: { type: "number" },
  },
  required: ["startFlow", "endFlow", "startSeconds", "endSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanFlow: { type: "number" }, panelVolume: { type: "number" } },
  required: ["meanFlow", "panelVolume"],
} as const;
/** One signed trapezoidal flow-volume panel from supplied research waveform values, without a patient flow assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startFlow, endFlow, startSeconds, endSeconds } = request;
  const compute = (): Output => {
    H.domain(endSeconds >= startSeconds);
    return {
      meanFlow: (startFlow + endFlow) / 2,
      panelVolume: ((startFlow + endFlow) * (endSeconds - startSeconds)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startFlow: 2, endFlow: 6, startSeconds: 0, endSeconds: 5 },
  output: { meanFlow: 4, panelVolume: 20 },
} satisfies ToolExample<Input, Output>;
export const uroflowVolumeTimeOnePanelTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/uroflow-volume-time-one-panel-term",
    title: "Uroflow Volume Time One Panel Term Tool",
    description:
      "One signed trapezoidal flow-volume panel from supplied research waveform values, without a patient flow assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startFlow: { type: "number" },
        endFlow: { type: "number" },
        startSeconds: { type: "number" },
        endSeconds: { type: "number" },
      },
      required: ["startFlow", "endFlow", "startSeconds", "endSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanFlow: { type: "number" },
        panelVolume: { type: "number" },
      },
      required: ["meanFlow", "panelVolume"],
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
          id: "startSeconds",
          label: "Start Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "endSeconds",
          label: "End Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        { id: "meanFlow", label: "Mean Flow", valueType: { type: "number" } },
        {
          id: "panelVolume",
          label: "Panel Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uroflowVolumeTimeOnePanelTermTool.execute;
export default uroflowVolumeTimeOnePanelTermTool;
