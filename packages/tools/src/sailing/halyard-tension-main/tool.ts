import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HalyardTensionMainInput = {
  readonly apparentWindKt: number;
};

export type HalyardTensionMainOutput = {
  readonly halyardTensionNewtons: number;
};

export const halyardTensionMainExample = {
  input: { apparentWindKt: 15 },
  output: { halyardTensionNewtons: 1765.197 },
} satisfies ToolExample<HalyardTensionMainInput, HalyardTensionMainOutput>;

const KGF_PER_KNOT = 12;
const NEWTONS_PER_KGF = 9.80665;

export const calculateHalyardTensionMain = (
  input: HalyardTensionMainInput,
): HalyardTensionMainOutput => {
  const tensionKgf = input.apparentWindKt * KGF_PER_KNOT;
  return {
    halyardTensionNewtons: tensionKgf * NEWTONS_PER_KGF,
  };
};

export const halyardTensionMainTool = createSimpleTool({
  calculate: (input) =>
    calculateHalyardTensionMain(input as unknown as HalyardTensionMainInput),
  description:
    "Guide mainsail halyard tension using a rule of thumb of twelve kilograms force per knot of apparent wind converted to newtons.",
  id: "sailing/halyard-tension-main",
  inputs: [
    {
      description: "Apparent wind speed the halyard must hold.",
      format: "speed-kt",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Recommended mainsail halyard tension in newtons.",
      format: "force",
      id: "halyardTensionNewtons",
      kind: "number",
      label: "Halyard tension",
      unit: "N",
    },
  ],
  title: "Main Halyard Tension Guide",
});
export const runHalyardTensionMain = halyardTensionMainTool.execute;
export default halyardTensionMainTool;
