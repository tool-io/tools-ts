import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LifeTableEntropyKeyfitzHInput = {
  readonly lx: readonly number[];
  readonly ex: readonly number[];
};

export type LifeTableEntropyKeyfitzHOutput = {
  readonly entropyH: number;
};

export const calculateLifeTableEntropyKeyfitzH = (
  input: LifeTableEntropyKeyfitzHInput,
): LifeTableEntropyKeyfitzHOutput => {
  const lx = input.lx;
  const ex = input.ex;
  if (lx.length < 2)
    simpleError(
      "lx",
      "Provide at least two survivorship values.",
      "invalid_list",
    );
  if (lx.length !== ex.length)
    simpleError(
      "ex",
      "The expectancy list must align with the survivorship list.",
      "invalid_list",
    );
  for (const value of lx)
    if (!(typeof value === "number" && Number.isFinite(value) && value > 0))
      simpleError(
        "lx",
        "Survivorship values must be finite and positive.",
        "invalid_list",
      );
  for (const value of ex)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "ex",
        "Expectancy values must be finite and non-negative.",
        "invalid_list",
      );
  let lifeDisparity = 0;
  for (let index = 0; index < lx.length; index += 1) {
    const deaths =
      index < lx.length - 1 ? lx[index]! - lx[index + 1]! : lx[index]!;
    if (deaths < 0)
      simpleError(
        "lx",
        "Survivorship must be non-increasing across ages.",
        "invalid_list",
      );
    lifeDisparity += deaths * ex[index]!;
  }
  const denominator = lx[0]! * ex[0]!;
  if (!(denominator > 0))
    simpleError(
      "ex",
      "Initial survivors times life expectancy at the first age must be positive.",
      "invalid_list",
    );
  return { entropyH: lifeDisparity / denominator };
};

export const lifeTableEntropyKeyfitzHExample = {
  input: { lx: [100, 90, 70, 40], ex: [3.1, 2.5, 1.8, 1.0] },
  output: { entropyH: 0.5645161290322581 },
} satisfies ToolExample<
  LifeTableEntropyKeyfitzHInput,
  LifeTableEntropyKeyfitzHOutput
>;

export const lifeTableEntropyKeyfitzHTool = createSimpleTool({
  id: "demography/life-table-entropy-keyfitz-h",
  title: "Life Table Entropy Keyfitz H Calculator",
  description:
    "Compute Keyfitz' life-table entropy H = e-dagger / e0 from aligned survivor and remaining-life-expectancy columns, including deaths in the terminal age group.",
  inputs: [
    {
      description:
        "Survivors l(x) at each single age of the complete life table.",
      id: "lx",
      kind: "numberList",
      label: "l(x)",
    },
    {
      description: "Remaining life expectancy e(x) aligned with the survivors.",
      id: "ex",
      kind: "numberList",
      label: "e(x)",
    },
  ],
  outputs: [
    {
      description:
        "Entropy H measuring the sensitivity of e0 to age-specific mortality changes.",
      id: "entropyH",
      kind: "number",
      label: "H",
    },
  ],
  calculate: (input) =>
    calculateLifeTableEntropyKeyfitzH(
      input as unknown as LifeTableEntropyKeyfitzHInput,
    ),
});

export const runLifeTableEntropyKeyfitzH = lifeTableEntropyKeyfitzHTool.execute;
export default lifeTableEntropyKeyfitzHTool;
