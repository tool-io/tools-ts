import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HalyardTensionJibInput = {
  readonly apparentWindKt: number;
};

export type HalyardTensionJibOutput = {
  readonly halyardTensionNewtons: number;
};

const KGF_PER_KNOT = 8;
const NEWTONS_PER_KGF = 9.80665;

export const halyardTensionJibExample = {
  input: { apparentWindKt: 15 },
  output: { halyardTensionNewtons: 1176.798 },
} satisfies ToolExample<HalyardTensionJibInput, HalyardTensionJibOutput>;

export const calculateHalyardTensionJib = (
  input: HalyardTensionJibInput,
): HalyardTensionJibOutput => {
  const tensionKgf = input.apparentWindKt * KGF_PER_KNOT;
  return {
    halyardTensionNewtons: tensionKgf * NEWTONS_PER_KGF,
  };
};

export const halyardTensionJibTool = createSimpleTool({
  calculate: (input) =>
    calculateHalyardTensionJib(input as unknown as HalyardTensionJibInput),
  description:
    "Guide jib halyard tension using a rule of thumb of eight kilograms force per knot of apparent wind converted to newtons.",
  id: "sailing/halyard-tension-jib",
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
      description: "Recommended jib halyard tension in newtons.",
      format: "force",
      id: "halyardTensionNewtons",
      kind: "number",
      label: "Halyard tension",
      unit: "N",
    },
  ],
  title: "Jib Halyard Tension Guide",
});
export const runHalyardTensionJib = halyardTensionJibTool.execute;
export default halyardTensionJibTool;
