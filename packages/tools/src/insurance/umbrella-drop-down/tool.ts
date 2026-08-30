import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coveredLoss: number;
  readonly underlyingLimit: number;
  readonly underlyingRecovery: number;
  readonly umbrellaLimit: number;
  readonly dropDownAllowed: boolean;
}>;
export type Output = Readonly<{
  readonly underlyingGap: number;
  readonly umbrellaRecovery: number;
  readonly uninsuredLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const underlyingGap = Math.max(
      0,
      Math.min(input.coveredLoss, input.underlyingLimit) -
        input.underlyingRecovery,
    ),
    excessLoss = Math.max(0, input.coveredLoss - input.underlyingLimit),
    umbrellaRecovery = Math.min(
      input.umbrellaLimit,
      excessLoss + (input.dropDownAllowed ? underlyingGap : 0),
    );
  return {
    underlyingGap,
    umbrellaRecovery,
    uninsuredLoss: Math.max(
      0,
      input.coveredLoss - input.underlyingRecovery - umbrellaRecovery,
    ),
  };
};

export const exampleInput = {
  coveredLoss: 1000,
  underlyingLimit: 500,
  underlyingRecovery: 300,
  umbrellaLimit: 600,
  dropDownAllowed: true,
} satisfies Input;
export const exampleOutput = {
  underlyingGap: 200,
  umbrellaRecovery: 600,
  uninsuredLoss: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coveredLoss: input.coveredLoss as number,
      underlyingLimit: input.underlyingLimit as number,
      underlyingRecovery: input.underlyingRecovery as number,
      umbrellaLimit: input.umbrellaLimit as number,
      dropDownAllowed: input.dropDownAllowed as boolean,
    }),
  description:
    "Calculate umbrella recovery with an optional underlying drop-down.",
  id: "insurance/umbrella-drop-down",
  inputs: [
    { id: "coveredLoss", label: "Covered loss", kind: "number", minimum: 0 },
    {
      id: "underlyingLimit",
      label: "Underlying policy limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "underlyingRecovery",
      label: "Underlying recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "umbrellaLimit",
      label: "Umbrella limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "dropDownAllowed",
      label: "Drop-down coverage allowed",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "underlyingGap",
      label: "Unpaid amount below underlying limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "umbrellaRecovery",
      label: "Umbrella recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "uninsuredLoss",
      label: "Remaining uninsured loss",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Umbrella Drop-Down",
});

export const run = tool.execute;
export default tool;
