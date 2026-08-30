import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly autoLiabilityLimit: number;
  readonly requiredAutoLimit: number;
  readonly homeLiabilityLimit: number;
  readonly requiredHomeLimit: number;
}>;
export type Output = Readonly<{
  readonly autoDeficit: number;
  readonly homeDeficit: number;
  readonly meetsBothRequirements: boolean;
}>;

export const calculate = (input: Input): Output => {
  const autoDeficit = Math.max(
    0,
    input.requiredAutoLimit - input.autoLiabilityLimit,
  );
  const homeDeficit = Math.max(
    0,
    input.requiredHomeLimit - input.homeLiabilityLimit,
  );
  return {
    autoDeficit,
    homeDeficit,
    meetsBothRequirements: autoDeficit === 0 && homeDeficit === 0,
  };
};

export const exampleInput = {
  autoLiabilityLimit: 300000,
  requiredAutoLimit: 300000,
  homeLiabilityLimit: 300000,
  requiredHomeLimit: 300000,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  autoLiabilityLimit: 100000,
  requiredAutoLimit: 300000,
  homeLiabilityLimit: 300000,
  requiredHomeLimit: 300000,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      autoLiabilityLimit: input.autoLiabilityLimit as number,
      requiredAutoLimit: input.requiredAutoLimit as number,
      homeLiabilityLimit: input.homeLiabilityLimit as number,
      requiredHomeLimit: input.requiredHomeLimit as number,
    }),
  description:
    "Compare underlying policy limits with caller-supplied umbrella requirements.",
  id: "insurance/umbrella-underlying-limit-check",
  inputs: [
    {
      id: "autoLiabilityLimit",
      label: "Auto liability limit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "requiredAutoLimit",
      label: "Required auto limit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "homeLiabilityLimit",
      label: "Home liability limit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "requiredHomeLimit",
      label: "Required home limit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "autoDeficit",
      label: "Auto limit deficit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "homeDeficit",
      label: "Home limit deficit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "meetsBothRequirements",
      label: "Meets both requirements",
      kind: "boolean",
    },
  ],
  title: "Umbrella Underlying Limit Check",
});

export const run = tool.execute;
export default tool;
