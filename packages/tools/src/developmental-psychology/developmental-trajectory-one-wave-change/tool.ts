import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScore: number;
  readonly secondScore: number;
  readonly firstAgeMonths: number;
  readonly secondAgeMonths: number;
};
export type Output = {
  readonly change: number;
  readonly changePerMonth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstScore: { type: "number" },
    secondScore: { type: "number" },
    firstAgeMonths: { type: "number", minimum: 0 },
    secondAgeMonths: { type: "number" },
  },
  required: ["firstScore", "secondScore", "firstAgeMonths", "secondAgeMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    change: { type: "number" },
    changePerMonth: { type: "number" },
  },
  required: ["change", "changePerMonth"],
} as const;
/** Descriptive within-person score change per elapsed month; does not supply age norms or a developmental trajectory model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstScore, secondScore, firstAgeMonths, secondAgeMonths } = request;
  const compute = (): Output => {
    H.domain(firstAgeMonths >= 0 && secondAgeMonths > firstAgeMonths);
    return {
      change: secondScore - firstScore,
      changePerMonth:
        (secondScore - firstScore) / (secondAgeMonths - firstAgeMonths),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstScore: 20,
    secondScore: 26,
    firstAgeMonths: 12,
    secondAgeMonths: 18,
  },
  output: { change: 6, changePerMonth: 1 },
} satisfies ToolExample<Input, Output>;
export const developmentalTrajectoryOneWaveChangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/developmental-trajectory-one-wave-change",
      title: "Developmental Trajectory One Wave Change Tool",
      description:
        "Descriptive within-person score change per elapsed month; does not supply age norms or a developmental trajectory model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstScore: { type: "number" },
          secondScore: { type: "number" },
          firstAgeMonths: { type: "number", minimum: 0 },
          secondAgeMonths: { type: "number" },
        },
        required: [
          "firstScore",
          "secondScore",
          "firstAgeMonths",
          "secondAgeMonths",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          change: { type: "number" },
          changePerMonth: { type: "number" },
        },
        required: ["change", "changePerMonth"],
      },
      ports: {
        inputs: [
          {
            id: "firstScore",
            label: "First Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondScore",
            label: "Second Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstAgeMonths",
            label: "First Age Months",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondAgeMonths",
            label: "Second Age Months",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "change", label: "Change", valueType: { type: "number" } },
          {
            id: "changePerMonth",
            label: "Change Per Month",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalTrajectoryOneWaveChangeTool.execute;
export default developmentalTrajectoryOneWaveChangeTool;
