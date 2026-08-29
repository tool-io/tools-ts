import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const TurnoverNumberTool = createSimpleTool({
  id: "chemistry/turnover-number",
  title: "Turnover Number Calculator",
  description:
    "Compute catalytic turnover number as TON = moles product / moles catalyst.",
  inputs: [
    { id: "molesProduct", label: "Moles product", kind: "number", minimum: 0 },
    {
      id: "molesCatalyst",
      label: "Moles catalyst",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "ton", label: "TON", kind: "number" }],
  calculate: (input) => {
    if ((input.molesCatalyst as number) === 0)
      simpleError("molesCatalyst", "> 0 required.", "invalid_cat");
    return {
      ton: (input.molesProduct as number) / (input.molesCatalyst as number),
    };
  },
});
export default TurnoverNumberTool;
export const runTurnoverNumber = TurnoverNumberTool.execute;

export type TurnoverNumberInput = {
  readonly molesProduct: number;
  readonly molesCatalyst: number;
};

export type TurnoverNumberOutput = {
  readonly ton: number;
};

export const turnoverNumberExample = {
  input: {
    molesProduct: 1,
    molesCatalyst: 1,
  },
  output: {
    ton: 1,
  },
} satisfies ToolExample<TurnoverNumberInput, TurnoverNumberOutput>;
