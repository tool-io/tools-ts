import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hrp2DeletionConfirmed: boolean;
  readonly hrp2RdtNegative: boolean;
  readonly independentParasiteEvidence: boolean;
}>;
export type Output = Readonly<{
  readonly discordantNegative: boolean;
  readonly deletionAssociatedConcern: boolean;
}>;
export const calculate = (input: Input): Output => {
  const discordantNegative =
    input.hrp2RdtNegative && input.independentParasiteEvidence;
  return {
    discordantNegative,
    deletionAssociatedConcern:
      discordantNegative && input.hrp2DeletionConfirmed,
  };
};
export const exampleInput = {
  hrp2DeletionConfirmed: true,
  hrp2RdtNegative: true,
  independentParasiteEvidence: true,
} satisfies Input;
export const exampleOutput = {
  discordantNegative: true,
  deletionAssociatedConcern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/hrp2-negative-test-discordance",
  title: "HRP2 Negative Test Discordance",
  description:
    "Flag discordance between negative HRP2 assay results and independent parasite evidence; not a diagnosis.",
  inputs: [
    {
      id: "hrp2DeletionConfirmed",
      label: "Hrp 2 deletion confirmed",
      kind: "boolean",
    },
    { id: "hrp2RdtNegative", label: "Hrp 2 rdt negative", kind: "boolean" },
    {
      id: "independentParasiteEvidence",
      label: "Independent parasite evidence",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "discordantNegative", label: "Discordant negative", kind: "boolean" },
    {
      id: "deletionAssociatedConcern",
      label: "Deletion associated concern",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      hrp2DeletionConfirmed: value.hrp2DeletionConfirmed as boolean,
      hrp2RdtNegative: value.hrp2RdtNegative as boolean,
      independentParasiteEvidence: value.independentParasiteEvidence as boolean,
    }),
});
export const run = tool.execute;
export default tool;
