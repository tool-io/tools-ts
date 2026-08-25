import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DecantingTimeStyleInput = {
  readonly matureRedMinutes: number;
  readonly whiteMinutes: number;
  readonly wineCondition: "none" | "young_red" | "mature_red" | "white";
  readonly youngRedMinutes: number;
};

export type DecantingTimeStyleOutput = {
  readonly decantingMinutes: number;
};

export const decantingTimeStyleExample = {
  input: {
    matureRedMinutes: 30,
    whiteMinutes: 15,
    wineCondition: "young_red",
    youngRedMinutes: 120,
  },
  output: {
    decantingMinutes: 120,
  },
} satisfies ToolExample<DecantingTimeStyleInput, DecantingTimeStyleOutput>;

export const calculateDecantingTime = (
  input: DecantingTimeStyleInput,
): DecantingTimeStyleOutput => {
  const minutes = {
    mature_red: input.matureRedMinutes,
    none: 0,
    white: input.whiteMinutes,
    young_red: input.youngRedMinutes,
  }[input.wineCondition];
  return { decantingMinutes: minutes };
};

export const decantingTimeStyleTool = createSimpleTool({
  calculate: (input) =>
    calculateDecantingTime(input as unknown as DecantingTimeStyleInput),
  description:
    "Select a planned decanting time by wine condition using caller-supplied service guidelines; bottle age, condition, and tasting observations still determine whether decanting is appropriate.",
  id: "oenology/decanting-time-style",
  inputs: [
    {
      description:
        "Planned time for a mature red when decanting is appropriate.",
      id: "matureRedMinutes",
      kind: "number",
      label: "Mature red time",
      minimum: 0,
      unit: "min",
    },
    {
      description: "Planned time for a white wine selected for decanting.",
      id: "whiteMinutes",
      kind: "number",
      label: "White wine time",
      minimum: 0,
      unit: "min",
    },
    {
      description: "One of none, young_red, mature_red, or white.",
      enum: ["none", "young_red", "mature_red", "white"],
      id: "wineCondition",
      kind: "string",
      label: "Wine condition",
    },
    {
      description: "Planned time for a young red under the service guideline.",
      id: "youngRedMinutes",
      kind: "number",
      label: "Young red time",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Suggested minutes in decanter before service.",
      id: "decantingMinutes",
      kind: "number",
      label: "Decanting time",
      unit: "min",
    },
  ],
  title: "Decanting Time by Style Calculator",
});
export const runDecantingTimeStyle = decantingTimeStyleTool.execute;
export default decantingTimeStyleTool;
