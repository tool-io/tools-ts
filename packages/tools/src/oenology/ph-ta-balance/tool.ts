import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhTaBalanceInput = {
  readonly maximumPh: number;
  readonly maximumTaGPerL: number;
  readonly minimumPh: number;
  readonly minimumTaGPerL: number;
  readonly ph: number;
  readonly taGPerL: number;
};

export type PhTaBalanceOutput = {
  readonly phStatus: string;
  readonly taStatus: string;
  readonly withinRanges: boolean;
};

export const phTaBalanceExample = {
  input: {
    maximumPh: 3.6,
    maximumTaGPerL: 8.5,
    minimumPh: 3,
    minimumTaGPerL: 5.5,
    ph: 3.3,
    taGPerL: 7,
  },
  output: {
    phStatus: "within_range",
    taStatus: "within_range",
    withinRanges: true,
  },
} satisfies ToolExample<PhTaBalanceInput, PhTaBalanceOutput>;

export const calculatePhTaBalance = (
  input: PhTaBalanceInput,
): PhTaBalanceOutput => {
  if (input.maximumPh < input.minimumPh)
    simpleError("maximumPh", "Maximum pH cannot be below minimum pH.");
  if (input.maximumTaGPerL < input.minimumTaGPerL)
    simpleError("maximumTaGPerL", "Maximum TA cannot be below minimum TA.");
  const phStatus =
    input.ph < input.minimumPh
      ? "below_range"
      : input.ph > input.maximumPh
        ? "above_range"
        : "within_range";
  const taStatus =
    input.taGPerL < input.minimumTaGPerL
      ? "below_range"
      : input.taGPerL > input.maximumTaGPerL
        ? "above_range"
        : "within_range";
  return {
    phStatus,
    taStatus,
    withinRanges: phStatus === "within_range" && taStatus === "within_range",
  };
};

export const phTaBalanceTool = createSimpleTool({
  calculate: (input) =>
    calculatePhTaBalance(input as unknown as PhTaBalanceInput),
  description:
    "Compare measured pH and titratable acidity independently with caller-supplied ranges; the result is a specification check, not a sensory balance judgment.",
  id: "oenology/ph-ta-balance",
  inputs: [
    {
      description: "Upper bound of the selected pH range.",
      id: "maximumPh",
      kind: "number",
      label: "Maximum pH",
      maximum: 14,
      minimum: 0,
    },
    {
      description: "Upper bound of the selected TA range.",
      id: "maximumTaGPerL",
      kind: "number",
      label: "Maximum TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Lower bound of the selected pH range.",
      id: "minimumPh",
      kind: "number",
      label: "Minimum pH",
      maximum: 14,
      minimum: 0,
    },
    {
      description: "Lower bound of the selected TA range.",
      id: "minimumTaGPerL",
      kind: "number",
      label: "Minimum TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Measured pH of the wine or must.",
      id: "ph",
      label: "pH",
      kind: "number",
      maximum: 14,
      minimum: 0,
    },
    {
      description: "Titratable acidity expressed as tartaric.",
      id: "taGPerL",
      kind: "number",
      label: "TA",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "Whether pH is below, within, or above its supplied range.",
      id: "phStatus",
      kind: "string",
      label: "pH status",
    },
    {
      description: "Whether TA is below, within, or above its supplied range.",
      id: "taStatus",
      kind: "string",
      label: "TA status",
    },
    {
      description:
        "Whether both measurements are inside their supplied ranges.",
      id: "withinRanges",
      kind: "boolean",
      label: "Within ranges",
    },
  ],
  title: "Wine pH and TA Range Checker",
});
export const runPhTaBalance = phTaBalanceTool.execute;
export default phTaBalanceTool;
