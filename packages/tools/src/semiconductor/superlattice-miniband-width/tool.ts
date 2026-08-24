import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuperlatticeMinibandWidthInput = {
  readonly barrierWidthNm: number;
  readonly couplingAtContactMeV: number;
  readonly decayLengthNm: number;
};

export type SuperlatticeMinibandWidthOutput = {
  readonly minibandWidthMeV: number;
};

export const superlatticeMinibandWidthExample = {
  input: { barrierWidthNm: 2, couplingAtContactMeV: 5, decayLengthNm: 1 },
  output: { minibandWidthMeV: 2.706705664732254 },
} satisfies ToolExample<
  SuperlatticeMinibandWidthInput,
  SuperlatticeMinibandWidthOutput
>;

export const superlatticeMinibandWidthTool = createSimpleTool({
  id: "semiconductor/superlattice-miniband-width",
  title: "Superlattice Miniband Width Calculator",
  description:
    "Estimate the superlattice miniband width from the contact coupling and the tunneling decay across the barrier.",
  inputs: [
    {
      description: "Barrier width between adjacent wells.",
      id: "barrierWidthNm",
      kind: "number",
      label: "Barrier width",
      unit: "nm",
    },
    {
      description: "Coupling energy when the wells are in contact.",
      id: "couplingAtContactMeV",
      kind: "number",
      label: "Coupling at contact",
      unit: "meV",
    },
    {
      description:
        "Evanescent decay length of the wave function in the barrier.",
      id: "decayLengthNm",
      kind: "number",
      label: "Decay length",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Nearest-neighbor tight-binding miniband width, 4|t|.",
      id: "minibandWidthMeV",
      kind: "number",
      label: "Miniband width",
      unit: "meV",
    },
  ],
  calculate: (input) => {
    const barrierWidthNm = input.barrierWidthNm as number;
    const couplingAtContactMeV = input.couplingAtContactMeV as number;
    const decayLengthNm = input.decayLengthNm as number;
    if (!(barrierWidthNm >= 0))
      simpleError(
        "barrierWidthNm",
        "Barrier width cannot be negative.",
        "must_be_nonnegative",
      );
    if (!(couplingAtContactMeV > 0))
      simpleError(
        "couplingAtContactMeV",
        "Coupling at contact must be positive.",
        "must_be_positive",
      );
    if (!(decayLengthNm > 0))
      simpleError(
        "decayLengthNm",
        "Decay length must be positive.",
        "must_be_positive",
      );
    const minibandWidthMeV =
      4 * couplingAtContactMeV * Math.exp(-barrierWidthNm / decayLengthNm);
    if (minibandWidthMeV === 0)
      simpleError(
        "barrierWidthNm",
        "Miniband width underflows to zero for this barrier-to-decay ratio.",
        "result_underflow",
      );
    return { minibandWidthMeV };
  },
});
export const runSuperlatticeMinibandWidth =
  superlatticeMinibandWidthTool.execute;
export default superlatticeMinibandWidthTool;
