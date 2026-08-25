import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ampliconLengthExample = {
  input: { forwardPositionBp: 100, reversePositionBp: 520 },
} satisfies ToolExample<{
  readonly forwardPositionBp: number;
  readonly reversePositionBp: number;
}>;

export const ampliconLengthTool = createSimpleTool({
  id: "biology/amplicon-length",
  title: "Amplicon Length",
  description:
    "Calculate the amplicon length in base pairs spanned by forward and reverse primer positions.",
  inputs: [
    {
      id: "forwardPositionBp",
      label: "Forward position",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
    {
      id: "reversePositionBp",
      label: "Reverse position",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "ampliconLengthBp",
      label: "Amplicon length",
      kind: "integer",
      unit: "bp",
    },
  ],
  calculate: (input) => ({
    ampliconLengthBp:
      Math.abs(
        (input.reversePositionBp as number) -
          (input.forwardPositionBp as number),
      ) + 1,
  }),
});
export const runAmpliconLength = ampliconLengthTool.execute;
export default ampliconLengthTool;
