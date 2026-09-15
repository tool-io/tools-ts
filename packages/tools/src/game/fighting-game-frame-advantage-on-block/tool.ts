import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly defenderBlockstunFrames: number;
  readonly attackerRemainingRecoveryFrames: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "defenderBlockstunFrames",
    label: "Defender blockstun frames",
    kind: "number",
  },
  {
    id: "attackerRemainingRecoveryFrames",
    label: "Attacker remaining recovery frames",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.defenderBlockstunFrames, "blockstun", 0, 1000000);
  bounded(i.attackerRemainingRecoveryFrames, "recovery", 0, 1000000);
  return {
    signedFrameAdvantage:
      i.defenderBlockstunFrames - i.attackerRemainingRecoveryFrames,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { defenderBlockstunFrames: 20, attackerRemainingRecoveryFrames: 15 },
  output: { result: { signedFrameAdvantage: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/fighting-game-frame-advantage-on-block",
  title: "Frame Advantage On Block Calculator",
  description:
    "Signed on-block frame advantage from actual same-hit-frame blockstun/recovery measurements; hitstop and game-specific rules external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
