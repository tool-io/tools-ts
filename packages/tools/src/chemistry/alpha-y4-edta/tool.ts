import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const alphaY4EdtaExample = {
  input: { ph: 10 },
  output: { alphaY4: 0.3546144704794824 },
} satisfies ToolExample<
  {
    readonly ph: number;
    readonly pka1?: number;
    readonly pka2?: number;
    readonly pka3?: number;
    readonly pka4?: number;
  },
  { readonly alphaY4: number }
>;

export const alphaY4EdtaTool = createSimpleTool({
  id: "chemistry/alpha-y4-edta",
  title: "EDTA Alpha Y4 Fraction",
  description:
    "Compute the fraction of uncomplexed EDTA present as fully deprotonated Y4-minus from pH and all four acid dissociation constants.",
  inputs: [
    {
      id: "ph",
      label: "pH",
      kind: "number",
    },
    {
      default: 2,
      id: "pka1",
      label: "pKa1",
      kind: "number",
      required: false,
    },
    {
      default: 2.67,
      id: "pka2",
      label: "pKa2",
      kind: "number",
      required: false,
    },
    {
      default: 6.16,
      id: "pka3",
      label: "pKa3",
      kind: "number",
      required: false,
    },
    {
      default: 10.26,
      id: "pka4",
      label: "pKa4",
      kind: "number",
      required: false,
    },
  ],
  outputs: [
    {
      id: "alphaY4",
      label: "Alpha Y4 fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ph = input.ph as number;
    const pka1 = input.pka1 as number;
    const pka2 = input.pka2 as number;
    const pka3 = input.pka3 as number;
    const pka4 = input.pka4 as number;
    if (!(pka1 < pka2 && pka2 < pka3 && pka3 < pka4))
      simpleError(
        "pka1",
        "EDTA pKa values must be in strictly increasing order.",
        "invalid_pka_order",
      );
    const h = 10 ** -ph;
    const k1 = 10 ** -pka1;
    const k2 = 10 ** -pka2;
    const k3 = 10 ** -pka3;
    const k4 = 10 ** -pka4;
    const fullyDeprotonatedTerm = k1 * k2 * k3 * k4;
    const denominator =
      h ** 4 +
      k1 * h ** 3 +
      k1 * k2 * h ** 2 +
      k1 * k2 * k3 * h +
      fullyDeprotonatedTerm;
    return {
      alphaY4: fullyDeprotonatedTerm / denominator,
    };
  },
});
export const runAlphaY4Edta = alphaY4EdtaTool.execute;
export default alphaY4EdtaTool;
