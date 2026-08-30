import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CenterToEscapeRatioInput = Readonly<{
  readonly driver1Teeth: number;
  readonly driven1Teeth: number;
  readonly driver2Teeth: number;
  readonly driven2Teeth: number;
}>;
export type CenterToEscapeRatioOutput = Readonly<{
  readonly speedRatio: number;
}>;

export const calculateCenterToEscapeRatio = (
  x: CenterToEscapeRatioInput,
): CenterToEscapeRatioOutput => {
  if (
    !Number.isFinite(x.driver1Teeth) ||
    !Number.isSafeInteger(x.driver1Teeth) ||
    x.driver1Teeth < 1
  )
    simpleError("driver1Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driven1Teeth) ||
    !Number.isSafeInteger(x.driven1Teeth) ||
    x.driven1Teeth < 1
  )
    simpleError("driven1Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driver2Teeth) ||
    !Number.isSafeInteger(x.driver2Teeth) ||
    x.driver2Teeth < 1
  )
    simpleError("driver2Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driven2Teeth) ||
    !Number.isSafeInteger(x.driven2Teeth) ||
    x.driven2Teeth < 1
  )
    simpleError("driven2Teeth", "Provide a positive safe integer.");
  const speedRatio =
    (x.driver1Teeth * x.driver2Teeth) / (x.driven1Teeth * x.driven2Teeth);
  if (!Number.isFinite(speedRatio))
    simpleError(
      "speedRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { speedRatio: Object.is(speedRatio, -0) ? 0 : speedRatio };
};

export const example = {
  input: {
    driver1Teeth: 60,
    driven1Teeth: 15,
    driver2Teeth: 80,
    driven2Teeth: 20,
  },
  output: { speedRatio: 16 },
} satisfies ToolExample<CenterToEscapeRatioInput, CenterToEscapeRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/center-to-escape-ratio",
  title: "Center To Escape Ratio",
  description:
    "Rotational speed ratio across two gear stages from driving and driven tooth counts.",
  inputs: [
    {
      id: "driver1Teeth",
      kind: "integer",
      label: "Driver 1 Teeth",
      minimum: 1,
    },
    {
      id: "driven1Teeth",
      kind: "integer",
      label: "Driven 1 Teeth",
      minimum: 1,
    },
    {
      id: "driver2Teeth",
      kind: "integer",
      label: "Driver 2 Teeth",
      minimum: 1,
    },
    {
      id: "driven2Teeth",
      kind: "integer",
      label: "Driven 2 Teeth",
      minimum: 1,
    },
  ],
  outputs: [{ id: "speedRatio", kind: "number", label: "Speed Ratio" }],
  calculate: (input) =>
    calculateCenterToEscapeRatio({
      driver1Teeth: input.driver1Teeth as number,
      driven1Teeth: input.driven1Teeth as number,
      driver2Teeth: input.driver2Teeth as number,
      driven2Teeth: input.driven2Teeth as number,
    }),
});
export const centerToEscapeRatioTool = tool;
export const runCenterToEscapeRatio = tool.execute;
export default tool;
