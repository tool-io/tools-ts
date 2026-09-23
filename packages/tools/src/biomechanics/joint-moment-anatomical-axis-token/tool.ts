import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moment: number;
  readonly sourceAxis: string;
  readonly targetAxis: string;
  readonly suppliedSign: number;
};
export type Output = {
  readonly transformedMoment: number;
  readonly reference: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moment: { type: "number" },
    sourceAxis: { type: "string", maxLength: 8192 },
    targetAxis: { type: "string", maxLength: 8192 },
    suppliedSign: { type: "integer" },
  },
  required: ["moment", "sourceAxis", "targetAxis", "suppliedSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformedMoment: { type: "number" },
    reference: { type: "string", maxLength: 8192 },
  },
  required: ["transformedMoment", "reference"],
} as const;
/** Retain an explicitly supplied anatomical-axis mapping rather than infer a joint sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moment, sourceAxis, targetAxis, suppliedSign } = request;
  const compute = (): Output => {
    H.domain(
      [1, -1].includes(suppliedSign) &&
        sourceAxis.length > 0 &&
        targetAxis.length > 0,
    );
    return {
      transformedMoment: moment * suppliedSign,
      reference: JSON.stringify([sourceAxis, targetAxis]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moment: 20,
    sourceAxis: "lab-z",
    targetAxis: "flexion",
    suppliedSign: -1,
  },
  output: { transformedMoment: -20, reference: '["lab-z","flexion"]' },
} satisfies ToolExample<Input, Output>;
export const jointMomentAnatomicalAxisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/joint-moment-anatomical-axis-token",
    title: "Joint Moment Anatomical Axis Token Tool",
    description:
      "Retain an explicitly supplied anatomical-axis mapping rather than infer a joint sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moment: { type: "number" },
        sourceAxis: { type: "string", maxLength: 8192 },
        targetAxis: { type: "string", maxLength: 8192 },
        suppliedSign: { type: "integer" },
      },
      required: ["moment", "sourceAxis", "targetAxis", "suppliedSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transformedMoment: { type: "number" },
        reference: { type: "string", maxLength: 8192 },
      },
      required: ["transformedMoment", "reference"],
    },
    ports: {
      inputs: [
        {
          id: "moment",
          label: "Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceAxis",
          label: "Source Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetAxis",
          label: "Target Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSign",
          label: "Supplied Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "transformedMoment",
          label: "Transformed Moment",
          valueType: { type: "number" },
        },
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jointMomentAnatomicalAxisTokenTool.execute;
export default jointMomentAnatomicalAxisTokenTool;
