import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TeuFeuEquivalentConversionInput = {
  readonly twentyFootContainers?: number;
  readonly fortyFootContainers?: number;
};

export type TeuFeuEquivalentConversionOutput = {
  readonly totalTeuEquivalent: number;
  readonly totalFeuEquivalent: number;
};

export const calculateTeuFeuEquivalentConversion = (
  input: TeuFeuEquivalentConversionInput,
): TeuFeuEquivalentConversionOutput => {
  const twentyFootContainers = input.twentyFootContainers ?? 0;
  const fortyFootContainers = input.fortyFootContainers ?? 0;
  for (const [key, value] of [
    ["twentyFootContainers", twentyFootContainers],
    ["fortyFootContainers", fortyFootContainers],
  ] as const) {
    if (!(Number.isSafeInteger(value) && value >= 0))
      return simpleError(
        key,
        "Container counts must be whole numbers of zero or more.",
        "invalid_count",
      );
  }
  const totalTeuEquivalent = twentyFootContainers + 2 * fortyFootContainers;
  if (!Number.isSafeInteger(totalTeuEquivalent))
    return simpleError(
      "fortyFootContainers",
      "The combined TEU count exceeds the safe integer range.",
      "count_out_of_range",
    );
  return { totalTeuEquivalent, totalFeuEquivalent: totalTeuEquivalent / 2 };
};

export const teuFeuEquivalentConversionExample = {
  input: { twentyFootContainers: 3, fortyFootContainers: 5 },
  output: { totalTeuEquivalent: 13, totalFeuEquivalent: 6.5 },
} satisfies ToolExample<
  TeuFeuEquivalentConversionInput,
  TeuFeuEquivalentConversionOutput
>;

export const teuFeuEquivalentConversionTool = createSimpleTool({
  id: "logistics/teu-feu-equivalent-conversion",
  title: "TEU FEU Equivalent Conversion",
  description:
    "Convert a mixed fleet of twenty- and forty-foot containers into total twenty-foot equivalent units (TEU) and forty-foot equivalents (FEU), where one FEU equals two TEU.",
  inputs: [
    {
      default: 0,
      description: "Count of twenty-foot containers.",
      id: "twentyFootContainers",
      kind: "integer",
      label: "20-ft",
      minimum: 0,
    },
    {
      default: 0,
      description: "Count of forty-foot containers.",
      id: "fortyFootContainers",
      kind: "integer",
      label: "40-ft",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Total capacity in twenty-foot equivalent units (one 40-ft box counts as two).",
      id: "totalTeuEquivalent",
      kind: "integer",
      label: "TEU",
      minimum: 0,
    },
    {
      description: "Total capacity in forty-foot equivalent units.",
      id: "totalFeuEquivalent",
      kind: "number",
      label: "FEU",
    },
  ],
  calculate: (input) =>
    calculateTeuFeuEquivalentConversion({
      fortyFootContainers: input.fortyFootContainers as number | undefined,
      twentyFootContainers: input.twentyFootContainers as number | undefined,
    }),
});

export const runTeuFeuEquivalentConversion =
  teuFeuEquivalentConversionTool.execute;
export default teuFeuEquivalentConversionTool;
