import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly commonBrandName: boolean;
  readonly sharedQualityManagement: boolean;
  readonly sharedProfitsOrCosts: boolean;
  readonly commonOwnershipOrControl: boolean;
}>;
export type Output = Readonly<{
  readonly networkIndicators: number;
  readonly screenResult: string;
  readonly triggeredIndicators: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const entries = [
      ["commonBrandName", input.commonBrandName],
      ["sharedQualityManagement", input.sharedQualityManagement],
      ["sharedProfitsOrCosts", input.sharedProfitsOrCosts],
      ["commonOwnershipOrControl", input.commonOwnershipOrControl],
    ] as const,
    triggeredIndicators = entries.filter(([, on]) => on).map(([id]) => id),
    networkIndicators = triggeredIndicators.length;
  return {
    networkIndicators,
    screenResult:
      networkIndicators >= 3
        ? "likely"
        : networkIndicators >= 1
          ? "possible"
          : "unlikely",
    triggeredIndicators,
  };
};

export const exampleInput = {
  commonBrandName: true,
  sharedQualityManagement: true,
  sharedProfitsOrCosts: false,
  commonOwnershipOrControl: true,
} satisfies Input;
export const exampleOutput = {
  networkIndicators: 3,
  screenResult: "likely",
  triggeredIndicators: [
    "commonBrandName",
    "sharedQualityManagement",
    "commonOwnershipOrControl",
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      commonBrandName: input.commonBrandName as boolean,
      sharedQualityManagement: input.sharedQualityManagement as boolean,
      sharedProfitsOrCosts: input.sharedProfitsOrCosts as boolean,
      commonOwnershipOrControl: input.commonOwnershipOrControl as boolean,
    }),
  description:
    "Screen shared firm characteristics for network-firm indicators.",
  id: "auditing/network-firm-screen",
  inputs: [
    { id: "commonBrandName", label: "Common brand name", kind: "boolean" },
    {
      id: "sharedQualityManagement",
      label: "Shared quality management",
      kind: "boolean",
    },
    {
      id: "sharedProfitsOrCosts",
      label: "Shared profits or costs",
      kind: "boolean",
    },
    {
      id: "commonOwnershipOrControl",
      label: "Common ownership or control",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "networkIndicators",
      label: "Network indicators",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "screenResult",
      label: "Network-firm screen result",
      kind: "string",
      enum: ["unlikely", "possible", "likely"],
    },
    {
      id: "triggeredIndicators",
      label: "Triggered indicators",
      kind: "stringList",
    },
  ],
  title: "Network-Firm Screen",
});

export const run = tool.execute;
export default tool;
