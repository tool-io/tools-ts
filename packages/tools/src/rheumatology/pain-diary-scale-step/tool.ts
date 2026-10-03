import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstValue: number;
  readonly secondValue: number;
  readonly suppliedStep: number;
  readonly reverseDirection: boolean;
};
export type Output = { readonly stepChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstValue: { type: "number" },
    secondValue: { type: "number" },
    suppliedStep: { type: "number", exclusiveMinimum: 0 },
    reverseDirection: { type: "boolean" },
  },
  required: ["firstValue", "secondValue", "suppliedStep", "reverseDirection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stepChange: { type: "number" } },
  required: ["stepChange"],
} as const;
/** Express a supplied diary response difference in explicit scale steps without validated severity interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstValue, secondValue, suppliedStep, reverseDirection } = request;
  const compute = (): Output => {
    H.positive(suppliedStep);
    return {
      stepChange:
        ((secondValue - firstValue) / suppliedStep) *
        (reverseDirection ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstValue: 3,
    secondValue: 5,
    suppliedStep: 0.5,
    reverseDirection: false,
  },
  output: { stepChange: 4 },
} satisfies ToolExample<Input, Output>;
export const painDiaryScaleStepTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "rheumatology/pain-diary-scale-step",
    title: "Pain Diary Scale Step Tool",
    description:
      "Express a supplied diary response difference in explicit scale steps without validated severity interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstValue: { type: "number" },
        secondValue: { type: "number" },
        suppliedStep: { type: "number", exclusiveMinimum: 0 },
        reverseDirection: { type: "boolean" },
      },
      required: [
        "firstValue",
        "secondValue",
        "suppliedStep",
        "reverseDirection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stepChange: { type: "number" } },
      required: ["stepChange"],
    },
    ports: {
      inputs: [
        {
          id: "firstValue",
          label: "First Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondValue",
          label: "Second Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedStep",
          label: "Supplied Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseDirection",
          label: "Reverse Direction",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "stepChange",
          label: "Step Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = painDiaryScaleStepTool.execute;
export default painDiaryScaleStepTool;
