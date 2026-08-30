import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly priorCarrierRisk: number;
  readonly detectionSensitivity: number;
  readonly testSpecificity: number;
}>;
export type Output = Readonly<{
  readonly residualCarrierRisk: number;
  readonly negativeResultProbability: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.priorCarrierRisk, "priorCarrierRisk");
  fraction(input.detectionSensitivity, "detectionSensitivity");
  fraction(input.testSpecificity, "testSpecificity");
  const missed = input.priorCarrierRisk * (1 - input.detectionSensitivity),
    negativeResultProbability =
      missed + (1 - input.priorCarrierRisk) * input.testSpecificity;
  positive(negativeResultProbability, "testSpecificity");
  return {
    residualCarrierRisk: missed / negativeResultProbability,
    negativeResultProbability,
  };
};
export const exampleInput = {
  priorCarrierRisk: 0.1,
  detectionSensitivity: 0.9,
  testSpecificity: 1,
} satisfies Input;
export const exampleOutput = {
  residualCarrierRisk: 0.01098901098901099,
  negativeResultProbability: 0.91,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/negative-screen-residual-risk",
  title: "Negative Screen Residual Risk",
  description:
    "Update carrier risk after a negative screen using explicit prior risk, sensitivity, and specificity.",
  inputs: [
    { id: "priorCarrierRisk", label: "Prior carrier risk", kind: "number" },
    {
      id: "detectionSensitivity",
      label: "Detection sensitivity",
      kind: "number",
    },
    { id: "testSpecificity", label: "Test specificity", kind: "number" },
  ],
  outputs: [
    {
      id: "residualCarrierRisk",
      label: "Residual carrier risk",
      kind: "number",
    },
    {
      id: "negativeResultProbability",
      label: "Negative result probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorCarrierRisk: value.priorCarrierRisk as number,
      detectionSensitivity: value.detectionSensitivity as number,
      testSpecificity: value.testSpecificity as number,
    }),
});
export const run = tool.execute;
export default tool;
