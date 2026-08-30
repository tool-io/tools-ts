import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openLoopJitter: number;
  readonly residualJitter: number;
  readonly requiredRejectionDb: number;
}>;
export type Output = Readonly<{
  readonly rejectionDb: number;
  readonly marginDb: number;
  readonly meetsRequirement: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.openLoopJitter <= 0 || input.residualJitter <= 0)
    simpleError(
      "openLoopJitter",
      "Both jitter measurements must be positive.",
      "invalid_jitter",
    );
  const rejectionDb =
    20 * Math.log10(input.openLoopJitter / input.residualJitter);
  return {
    rejectionDb,
    marginDb: rejectionDb - input.requiredRejectionDb,
    meetsRequirement: rejectionDb >= input.requiredRejectionDb,
  };
};

export const exampleInput = {
  openLoopJitter: 100,
  residualJitter: 10,
  requiredRejectionDb: 15,
} satisfies Input;
export const exampleOutput = {
  rejectionDb: 20,
  marginDb: 5,
  meetsRequirement: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openLoopJitter: input.openLoopJitter as number,
      residualJitter: input.residualJitter as number,
      requiredRejectionDb: input.requiredRejectionDb as number,
    }),
  description:
    "Calculate fast-steering-mirror jitter rejection and margin against a caller requirement.",
  id: "laser/jitter-rejection-budget",
  inputs: [
    {
      id: "openLoopJitter",
      label: "Open-loop jitter",
      kind: "number",
      minimum: 0,
      unit: "angle",
    },
    {
      id: "residualJitter",
      label: "Residual jitter",
      kind: "number",
      minimum: 0,
      unit: "angle",
    },
    {
      id: "requiredRejectionDb",
      label: "Required rejection",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "rejectionDb",
      label: "Measured jitter rejection",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    { id: "marginDb", label: "Rejection margin", kind: "number", unit: "dB" },
    { id: "meetsRequirement", label: "Meets requirement", kind: "boolean" },
  ],
  title: "Jitter-Rejection Budget",
});

export const run = tool.execute;
export default tool;
