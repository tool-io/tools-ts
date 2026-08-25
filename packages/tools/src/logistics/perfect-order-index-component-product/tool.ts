import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PerfectOrderIndexComponentProductInput = {
  readonly correctDocumentationPercent?: number;
  readonly damageFreePercent?: number;
  readonly inFullPercent?: number;
  readonly onTimePercent?: number;
};

export type PerfectOrderIndexComponentProductOutput = {
  readonly perfectOrderIndexPercent: number;
};

export const calculatePerfectOrderIndexComponentProduct = (
  input: PerfectOrderIndexComponentProductInput,
): PerfectOrderIndexComponentProductOutput => {
  for (const key of [
    "onTimePercent",
    "inFullPercent",
    "damageFreePercent",
    "correctDocumentationPercent",
  ] as const) {
    const value = input[key] ?? 100;
    if (!Number.isFinite(value) || value < 0 || value > 100)
      return simpleError(
        key,
        "Each perfect-order component must be between zero and one hundred percent.",
        "invalid_percent",
      );
  }
  const product =
    (input.onTimePercent ?? 100) *
    (input.inFullPercent ?? 100) *
    (input.damageFreePercent ?? 100) *
    (input.correctDocumentationPercent ?? 100);
  return { perfectOrderIndexPercent: product / 1_000_000 };
};

export const perfectOrderIndexComponentProductExample = {
  input: {
    correctDocumentationPercent: 97.4,
    damageFreePercent: 99.1,
    inFullPercent: 98.2,
    onTimePercent: 96.5,
  },
  output: { perfectOrderIndexPercent: 91.46846954200001 },
} satisfies ToolExample<
  PerfectOrderIndexComponentProductInput,
  PerfectOrderIndexComponentProductOutput
>;

export const perfectOrderIndexComponentProductTool = createSimpleTool({
  id: "logistics/perfect-order-index-component-product",
  title: "Perfect Order Index Component Product",
  description:
    "Multiply on-time, in-full, damage-free and documentation-accuracy percentages into the perfect order index, where each component multiplies the probability of a flawless order.",
  inputs: [
    {
      default: 100,
      description: "Orders with accurate documents in percent.",
      id: "correctDocumentationPercent",
      kind: "number",
      label: "Docs accuracy",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 100,
      description: "Orders delivered without damage in percent.",
      id: "damageFreePercent",
      kind: "number",
      label: "Damage free",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 100,
      description: "Orders delivered complete in percent.",
      id: "inFullPercent",
      kind: "number",
      label: "In full",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 100,
      description: "Orders delivered on time in percent.",
      id: "onTimePercent",
      kind: "number",
      label: "On time",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Perfect order index in percent.",
      id: "perfectOrderIndexPercent",
      kind: "number",
      label: "Perfect order index",
    },
  ],
  calculate: (input) =>
    calculatePerfectOrderIndexComponentProduct({
      correctDocumentationPercent: input.correctDocumentationPercent as
        number | undefined,
      damageFreePercent: input.damageFreePercent as number | undefined,
      inFullPercent: input.inFullPercent as number | undefined,
      onTimePercent: input.onTimePercent as number | undefined,
    }),
});

export const runPerfectOrderIndexComponentProduct =
  perfectOrderIndexComponentProductTool.execute;
export default perfectOrderIndexComponentProductTool;
