import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const flotacTwoChamberEpgExample = {
  input: { eggsChamberOneInt: 30, eggsChamberTwoInt: 20 },
} satisfies ToolExample<{
  readonly eggsChamberOneInt: number;
  readonly eggsChamberTwoInt: number;
  readonly flotationFactor?: number;
}>;

export const flotacTwoChamberEpgTool = createSimpleTool({
  id: "parasitology/flotac-two-chamber-epg",
  title: "Flotac Two-Chamber EPG",
  description:
    "Compute Flotac eggs per gram as the summed egg counts of both chambers multiplied by the flotation factor divided by two.",
  inputs: [
    {
      id: "eggsChamberOneInt",
      label: "Eggs chamber one",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "eggsChamberTwoInt",
      label: "Eggs chamber two",
      kind: "integer",
      minimum: 0,
    },
    {
      default: 5,
      id: "flotationFactor",
      label: "Flotation factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [{ id: "eggsPerGram", label: "Eggs per gram", kind: "number" }],
  calculate: (input) => ({
    eggsPerGram:
      (((input.eggsChamberOneInt as number) +
        (input.eggsChamberTwoInt as number)) *
        (input.flotationFactor as number)) /
      2,
  }),
});
export const runFlotacTwoChamberEpg = flotacTwoChamberEpgTool.execute;
export default flotacTwoChamberEpgTool;
