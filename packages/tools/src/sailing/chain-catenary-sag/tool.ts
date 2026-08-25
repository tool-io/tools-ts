import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const standardGravity = 9.80665;

export type ChainCatenarySagInput = {
  readonly weightPerMeterKg: number;
  readonly spanMeters: number;
  readonly tensionNewtons: number;
};

export type ChainCatenarySagOutput = {
  readonly sagMeters: number;
};

export const calculateChainCatenarySag = (
  weightPerMeterKg: number,
  spanMeters: number,
  tensionNewtons: number,
): number | null =>
  spanMeters > 0 && tensionNewtons > 0 && weightPerMeterKg >= 0
    ? (weightPerMeterKg * standardGravity * spanMeters ** 2) /
      (8 * tensionNewtons)
    : null;

export const chainCatenarySagExample = {
  input: { weightPerMeterKg: 2, spanMeters: 20, tensionNewtons: 5000 },
  output: { sagMeters: 0.196133 },
} satisfies ToolExample<ChainCatenarySagInput, ChainCatenarySagOutput>;

export const chainCatenarySagTool = createSimpleTool({
  id: "sailing/chain-catenary-sag",
  title: "Chain Catenary Sag Calculator",
  description:
    "Estimate the catenary sag of anchor chain between two points from its weight per meter, span, and horizontal tension using a parabolic approximation.",
  inputs: [
    {
      id: "weightPerMeterKg",
      kind: "number",
      label: "Weight per meter",
      unit: "kg/m",
    },
    { id: "spanMeters", kind: "number", label: "Span", unit: "m" },
    { id: "tensionNewtons", kind: "number", label: "Tension", unit: "N" },
  ],
  outputs: [
    {
      format: "sag-m",
      id: "sagMeters",
      kind: "number",
      label: "Catenary sag",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const weight = input.weightPerMeterKg as number;
    const span = input.spanMeters as number;
    const tension = input.tensionNewtons as number;
    const sagMeters = calculateChainCatenarySag(weight, span, tension);
    if (sagMeters === null)
      simpleError(
        span <= 0
          ? "spanMeters"
          : tension <= 0
            ? "tensionNewtons"
            : "weightPerMeterKg",
        "Enter a positive span and tension and a non-negative weight per meter.",
        "invalid_dimensions",
      );
    return { sagMeters };
  },
});

export const runChainCatenarySag = chainCatenarySagTool.execute;
export default chainCatenarySagTool;
