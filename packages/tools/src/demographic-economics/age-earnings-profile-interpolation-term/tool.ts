import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerAge: number;
  readonly upperAge: number;
  readonly lowerEarnings: number;
  readonly upperEarnings: number;
  readonly age: number;
};
export type Output = { readonly earnings: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerAge: { type: "number" },
    upperAge: { type: "number" },
    lowerEarnings: { type: "number" },
    upperEarnings: { type: "number" },
    age: { type: "number" },
  },
  required: ["lowerAge", "upperAge", "lowerEarnings", "upperEarnings", "age"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earnings: { type: "number" } },
  required: ["earnings"],
} as const;
/** Calculate age earnings profile interpolation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerAge, upperAge, lowerEarnings, upperEarnings, age } = request;
  const compute = (): Output => {
    H.domain(upperAge > lowerAge && age >= lowerAge && age <= upperAge);
    return {
      earnings:
        lowerEarnings +
        ((upperEarnings - lowerEarnings) * (age - lowerAge)) /
          (upperAge - lowerAge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerAge: 20,
    upperAge: 30,
    lowerEarnings: 1000,
    upperEarnings: 2000,
    age: 25,
  },
  output: { earnings: 1500 },
} satisfies ToolExample<Input, Output>;
export const ageEarningsProfileInterpolationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/age-earnings-profile-interpolation-term",
      title: "Age Earnings Profile Interpolation Term Tool",
      description:
        "Calculate age earnings profile interpolation term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerAge: { type: "number" },
          upperAge: { type: "number" },
          lowerEarnings: { type: "number" },
          upperEarnings: { type: "number" },
          age: { type: "number" },
        },
        required: [
          "lowerAge",
          "upperAge",
          "lowerEarnings",
          "upperEarnings",
          "age",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { earnings: { type: "number" } },
        required: ["earnings"],
      },
      ports: {
        inputs: [
          {
            id: "lowerAge",
            label: "Lower Age",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperAge",
            label: "Upper Age",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerEarnings",
            label: "Lower Earnings",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperEarnings",
            label: "Upper Earnings",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "age",
            label: "Age",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "earnings", label: "Earnings", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = ageEarningsProfileInterpolationTermTool.execute;
export default ageEarningsProfileInterpolationTermTool;
