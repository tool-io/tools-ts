import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedReference: number;
  readonly suppliedReference: number;
  readonly observedSample: number;
};
export type Output = {
  readonly offset: number;
  readonly correctedSample: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedReference: { type: "number" },
    suppliedReference: { type: "number" },
    observedSample: { type: "number" },
  },
  required: ["observedReference", "suppliedReference", "observedSample"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "number" },
    correctedSample: { type: "number" },
  },
  required: ["offset", "correctedSample"],
} as const;
/** One-point additive correction without uncertainty or calibration certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedReference, suppliedReference, observedSample } = request;
  const compute = (): Output => {
    return {
      offset: observedReference - suppliedReference,
      correctedSample: observedSample - observedReference + suppliedReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedReference: 0.5, suppliedReference: 0, observedSample: 20 },
  output: { offset: 0.5, correctedSample: 19.5 },
} satisfies ToolExample<Input, Output>;
export const foodThermometerIcePointOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-thermometer-ice-point-offset-term",
    title: "Food Thermometer Ice Point Offset Term Tool",
    description:
      "One-point additive correction without uncertainty or calibration certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedReference: { type: "number" },
        suppliedReference: { type: "number" },
        observedSample: { type: "number" },
      },
      required: ["observedReference", "suppliedReference", "observedSample"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        correctedSample: { type: "number" },
      },
      required: ["offset", "correctedSample"],
    },
    ports: {
      inputs: [
        {
          id: "observedReference",
          label: "Observed Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReference",
          label: "Supplied Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSample",
          label: "Observed Sample",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        {
          id: "correctedSample",
          label: "Corrected Sample",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodThermometerIcePointOffsetTermTool.execute;
export default foodThermometerIcePointOffsetTermTool;
