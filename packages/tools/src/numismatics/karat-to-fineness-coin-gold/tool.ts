import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KaratToFinenessCoinGoldInput = Readonly<{
  readonly karats: number;
}>;
export type KaratToFinenessCoinGoldOutput = Readonly<{
  readonly finenessPerMille: number;
}>;

export const calculateKaratToFinenessCoinGold = (
  x: KaratToFinenessCoinGoldInput,
): KaratToFinenessCoinGoldOutput => {
  if (!Number.isFinite(x.karats) || x.karats < 0 || x.karats > 24)
    simpleError(
      "karats",
      "Provide a finite nonnegative number no greater than 24.",
    );
  const finenessPerMille = (x.karats / 24) * 1000;
  if (!Number.isFinite(finenessPerMille))
    simpleError(
      "finenessPerMille",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    finenessPerMille: Object.is(finenessPerMille, -0) ? 0 : finenessPerMille,
  };
};

export const example = {
  input: {
    karats: 18,
  },
  output: { finenessPerMille: 750 },
} satisfies ToolExample<
  KaratToFinenessCoinGoldInput,
  KaratToFinenessCoinGoldOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/karat-to-fineness-coin-gold",
  title: "Karat To Fineness Coin Gold",
  description:
    "Convert gold karats to millesimal fineness; 24 karats denotes nominally pure gold.",
  inputs: [{ id: "karats", kind: "number", label: "Karats", unit: "kt" }],
  outputs: [
    {
      id: "finenessPerMille",
      kind: "number",
      label: "Fineness Per Mille",
      unit: "‰",
    },
  ],
  calculate: (input) =>
    calculateKaratToFinenessCoinGold({
      karats: input.karats as number,
    }),
});
export const runKaratToFinenessCoinGold = tool.execute;
export default tool;
