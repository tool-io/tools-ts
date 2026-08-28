import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const rateDeterminingStepCheckerTool = createSimpleTool({
  id: "chemistry/rate-determining-step-checker",
  title: "Rate Determining Step Checker",
  description:
    "Compare two directly comparable elementary-step rate constants; the smaller constant identifies the slower step, while equal constants have no unique slower step.",
  inputs: [
    {
      description: "Step 1 k.",
      id: "rateConstantStep1",
      kind: "number",
      label: "Step 1 k",
      minimum: 0,
    },
    {
      description: "Step 2 k.",
      id: "rateConstantStep2",
      kind: "number",
      label: "Step 2 k",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Which step is RDS.",
      id: "rateDeterminingStep",
      kind: "string",
      label: "RDS",
    },
  ],
  calculate: (input) => {
    if (
      (input.rateConstantStep1 as number) <= 0 ||
      (input.rateConstantStep2 as number) <= 0
    )
      simpleError("rateConstantStep1", ">0 required.", "invalid_rate");
    const step1 = input.rateConstantStep1 as number;
    const step2 = input.rateConstantStep2 as number;
    const rds =
      step1 === step2
        ? "no unique slower step"
        : step1 < step2
          ? "step 1"
          : "step 2";
    return { rateDeterminingStep: rds };
  },
});
export default rateDeterminingStepCheckerTool;
export const runRateDeterminingStepChecker =
  rateDeterminingStepCheckerTool.execute;

export type RateDeterminingStepCheckerInput = {
  readonly rateConstantStep1: number;
  readonly rateConstantStep2: number;
};

export type RateDeterminingStepCheckerOutput = {
  readonly rateDeterminingStep: string;
};

export const rateDeterminingStepCheckerExample = {
  input: {
    rateConstantStep1: 1,
    rateConstantStep2: 1,
  },
  output: {
    rateDeterminingStep: "no unique slower step",
  },
} satisfies ToolExample<
  RateDeterminingStepCheckerInput,
  RateDeterminingStepCheckerOutput
>;
