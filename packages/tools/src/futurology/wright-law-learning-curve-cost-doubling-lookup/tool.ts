import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WrightLawInput = {
  readonly endVolume: number;
  readonly learningRatePercent: number;
  readonly startUnitCost: number;
  readonly startVolume: number;
};

export type WrightLawOutput = {
  readonly costReductionPercent: number;
  readonly estimatedEndUnitCost: number;
  readonly productionDoublings: number;
};

export const calculateWrightLawUnitCost = (
  input: WrightLawInput,
): WrightLawOutput => {
  for (const [field, value] of [
    ["startUnitCost", input.startUnitCost],
    ["startVolume", input.startVolume],
    ["endVolume", input.endVolume],
  ] as const)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "Cost and volume values must be finite and greater than zero.",
        "cost_volume_value_required",
      );
  if (
    !Number.isFinite(input.learningRatePercent) ||
    input.learningRatePercent < 0 ||
    input.learningRatePercent >= 100
  )
    simpleError(
      "learningRatePercent",
      "Learning rate must be finite and from 0 up to but not including 100 percent.",
      "invalid_learning_rate",
    );
  const productionDoublings = Math.log2(input.endVolume / input.startVolume);
  const estimatedEndUnitCost =
    input.startUnitCost *
    (1 - input.learningRatePercent / 100) ** productionDoublings;
  if (
    !Number.isFinite(productionDoublings) ||
    !Number.isFinite(estimatedEndUnitCost)
  )
    simpleError(
      "",
      "The Wright-law estimate is not finite.",
      "result_not_finite",
    );
  return {
    costReductionPercent:
      (1 - estimatedEndUnitCost / input.startUnitCost) * 100,
    estimatedEndUnitCost,
    productionDoublings,
  };
};

export const wrightLawExample = {
  input: {
    endVolume: 800,
    learningRatePercent: 20,
    startUnitCost: 100,
    startVolume: 100,
  },
  output: {
    costReductionPercent: 48.79999999999999,
    estimatedEndUnitCost: 51.20000000000001,
    productionDoublings: 3,
  },
} satisfies ToolExample<WrightLawInput, WrightLawOutput>;

export const wrightLawTool = createSimpleTool({
  calculate: (input) =>
    calculateWrightLawUnitCost({
      endVolume: input.endVolume as number,
      learningRatePercent: input.learningRatePercent as number,
      startUnitCost: input.startUnitCost as number,
      startVolume: input.startVolume as number,
    }),
  description:
    "Estimate unit cost from production doublings and a caller-supplied constant percent learning rate.",
  id: "futurology/wright-law-learning-curve-cost-doubling-lookup",
  inputs: [
    {
      id: "endVolume",
      kind: "number",
      label: "End production volume",
      minimum: 0,
    },
    {
      id: "learningRatePercent",
      kind: "number",
      label: "Learning rate percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "startUnitCost",
      kind: "number",
      label: "Start unit cost",
      minimum: 0,
    },
    {
      id: "startVolume",
      kind: "number",
      label: "Start production volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "costReductionPercent",
      kind: "number",
      label: "Estimated cost reduction percent",
      unit: "%",
    },
    {
      id: "estimatedEndUnitCost",
      kind: "number",
      label: "Estimated end unit cost",
      minimum: 0,
    },
    {
      id: "productionDoublings",
      kind: "number",
      label: "Production doublings",
    },
  ],
  title: "Wright Law Learning Curve Cost Doubling Lookup",
});

export const runWrightLaw = wrightLawTool.execute;
export default wrightLawTool;
