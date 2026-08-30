import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrainWheelTeethSumInput = Readonly<{
  readonly firstTeeth: number;
  readonly secondTeeth: number;
  readonly thirdTeeth: number;
}>;
export type TrainWheelTeethSumOutput = Readonly<{
  readonly totalTeeth: number;
}>;

export const calculateTrainWheelTeethSum = (
  x: TrainWheelTeethSumInput,
): TrainWheelTeethSumOutput => {
  if (
    !Number.isFinite(x.firstTeeth) ||
    !Number.isSafeInteger(x.firstTeeth) ||
    x.firstTeeth < 1
  )
    simpleError("firstTeeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.secondTeeth) ||
    !Number.isSafeInteger(x.secondTeeth) ||
    x.secondTeeth < 1
  )
    simpleError("secondTeeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.thirdTeeth) ||
    !Number.isSafeInteger(x.thirdTeeth) ||
    x.thirdTeeth < 1
  )
    simpleError("thirdTeeth", "Provide a positive safe integer.");
  const totalTeeth = x.firstTeeth + x.secondTeeth + x.thirdTeeth;
  if (!Number.isFinite(totalTeeth))
    simpleError(
      "totalTeeth",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalTeeth: Object.is(totalTeeth, -0) ? 0 : totalTeeth };
};

export const example = {
  input: {
    firstTeeth: 60,
    secondTeeth: 70,
    thirdTeeth: 80,
  },
  output: { totalTeeth: 210 },
} satisfies ToolExample<TrainWheelTeethSumInput, TrainWheelTeethSumOutput>;

export const tool = createSimpleTool({
  id: "horology/train-wheel-teeth-sum",
  title: "Train Wheel Teeth Sum",
  description:
    "Total teeth across three train wheels; bookkeeping for a gear-train design.",
  inputs: [
    { id: "firstTeeth", kind: "integer", label: "First Teeth", minimum: 1 },
    { id: "secondTeeth", kind: "integer", label: "Second Teeth", minimum: 1 },
    { id: "thirdTeeth", kind: "integer", label: "Third Teeth", minimum: 1 },
  ],
  outputs: [{ id: "totalTeeth", kind: "number", label: "Total Teeth" }],
  calculate: (input) =>
    calculateTrainWheelTeethSum({
      firstTeeth: input.firstTeeth as number,
      secondTeeth: input.secondTeeth as number,
      thirdTeeth: input.thirdTeeth as number,
    }),
});
export const trainWheelTeethSumTool = tool;
export const runTrainWheelTeethSum = tool.execute;
export default tool;
