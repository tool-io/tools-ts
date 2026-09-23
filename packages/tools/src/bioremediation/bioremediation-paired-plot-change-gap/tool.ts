import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeTreatment: number;
  readonly afterTreatment: number;
  readonly beforeControl: number;
  readonly afterControl: number;
};
export type Output = {
  readonly treatmentChange: number;
  readonly controlChange: number;
  readonly changeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeTreatment: { type: "number" },
    afterTreatment: { type: "number" },
    beforeControl: { type: "number" },
    afterControl: { type: "number" },
  },
  required: [
    "beforeTreatment",
    "afterTreatment",
    "beforeControl",
    "afterControl",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatmentChange: { type: "number" },
    controlChange: { type: "number" },
    changeDifference: { type: "number" },
  },
  required: ["treatmentChange", "controlChange", "changeDifference"],
} as const;
/** Descriptive paired-plot change contrast without causal attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeTreatment, afterTreatment, beforeControl, afterControl } =
    request;
  const compute = (): Output => {
    return {
      treatmentChange: afterTreatment - beforeTreatment,
      controlChange: afterControl - beforeControl,
      changeDifference:
        afterTreatment - beforeTreatment - afterControl + beforeControl,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeTreatment: 10,
    afterTreatment: 6,
    beforeControl: 8,
    afterControl: 7,
  },
  output: { treatmentChange: -4, controlChange: -1, changeDifference: -3 },
} satisfies ToolExample<Input, Output>;
export const bioremediationPairedPlotChangeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/bioremediation-paired-plot-change-gap",
    title: "Bioremediation Paired Plot Change Gap Tool",
    description:
      "Descriptive paired-plot change contrast without causal attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeTreatment: { type: "number" },
        afterTreatment: { type: "number" },
        beforeControl: { type: "number" },
        afterControl: { type: "number" },
      },
      required: [
        "beforeTreatment",
        "afterTreatment",
        "beforeControl",
        "afterControl",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatmentChange: { type: "number" },
        controlChange: { type: "number" },
        changeDifference: { type: "number" },
      },
      required: ["treatmentChange", "controlChange", "changeDifference"],
    },
    ports: {
      inputs: [
        {
          id: "beforeTreatment",
          label: "Before Treatment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterTreatment",
          label: "After Treatment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeControl",
          label: "Before Control",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterControl",
          label: "After Control",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "treatmentChange",
          label: "Treatment Change",
          valueType: { type: "number" },
        },
        {
          id: "controlChange",
          label: "Control Change",
          valueType: { type: "number" },
        },
        {
          id: "changeDifference",
          label: "Change Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioremediationPairedPlotChangeGapTool.execute;
export default bioremediationPairedPlotChangeGapTool;
