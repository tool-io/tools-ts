import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly practiceMinutes: number;
  readonly theoryMinutes: number;
  readonly breaks: number;
};
export type Output = {
  readonly contactMinutes: number;
  readonly practiceShare: number;
  readonly sessionMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    practiceMinutes: { type: "number", minimum: 0 },
    theoryMinutes: { type: "number", minimum: 0 },
    breaks: { type: "number", minimum: 0 },
  },
  required: ["practiceMinutes", "theoryMinutes", "breaks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number" },
    practiceShare: { type: "number" },
    sessionMinutes: { type: "number" },
  },
  required: ["contactMinutes", "practiceShare", "sessionMinutes"],
} as const;
/** Calculate farmer training practice theory time split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { practiceMinutes, theoryMinutes, breaks } = request;
  const compute = (): Output => {
    H.domain(
      practiceMinutes >= 0 &&
        theoryMinutes >= 0 &&
        practiceMinutes + theoryMinutes > 0 &&
        breaks >= 0,
    );
    return {
      contactMinutes: practiceMinutes + theoryMinutes,
      practiceShare: practiceMinutes / (practiceMinutes + theoryMinutes),
      sessionMinutes: practiceMinutes + theoryMinutes + breaks,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { practiceMinutes: 60, theoryMinutes: 40, breaks: 20 },
  output: { contactMinutes: 100, practiceShare: 0.6, sessionMinutes: 120 },
} satisfies ToolExample<Input, Output>;
export const farmerTrainingPracticeTheoryTimeSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/farmer-training-practice-theory-time-split",
      title: "Farmer Training Practice Theory Time Split Tool",
      description:
        "Calculate farmer training practice theory time split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          practiceMinutes: { type: "number", minimum: 0 },
          theoryMinutes: { type: "number", minimum: 0 },
          breaks: { type: "number", minimum: 0 },
        },
        required: ["practiceMinutes", "theoryMinutes", "breaks"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactMinutes: { type: "number" },
          practiceShare: { type: "number" },
          sessionMinutes: { type: "number" },
        },
        required: ["contactMinutes", "practiceShare", "sessionMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "practiceMinutes",
            label: "Practice Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "theoryMinutes",
            label: "Theory Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "breaks",
            label: "Breaks",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "contactMinutes",
            label: "Contact Minutes",
            valueType: { type: "number" },
          },
          {
            id: "practiceShare",
            label: "Practice Share",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = farmerTrainingPracticeTheoryTimeSplitTool.execute;
export default farmerTrainingPracticeTheoryTimeSplitTool;
