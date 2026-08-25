import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlveolarArterialGradient2Input = {
  readonly fiO2Fraction?: number;
  readonly paco2Mmhg: number;
  readonly pao2Mmhg: number;
};

export type AlveolarArterialGradient2Output = {
  readonly aaGradientSeaLevelMmhg: number;
};

export const alveolarArterialGradient2Example = {
  input: { paco2Mmhg: 40, pao2Mmhg: 95 },
  output: { aaGradientSeaLevelMmhg: 4.72999999999999 },
} satisfies ToolExample<
  AlveolarArterialGradient2Input,
  AlveolarArterialGradient2Output
>;

export const alveolarArterialGradient2Tool = createSimpleTool({
  id: "biology/alveolar-arterial-gradient-2",
  title: "A-a Gradient Sea Level",
  description:
    "Compute the sea level alveolar-arterial oxygen gradient as fiO2 x (760 - 47) - paco2 / 0.8 - pao2.",
  inputs: [
    {
      default: 0.21,
      description: "Inspired oxygen fraction.",
      id: "fiO2Fraction",
      label: "Inspired oxygen fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "paco2Mmhg",
      label: "Arterial CO2",
      kind: "number",
      unit: "mmHg",
    },
    {
      id: "pao2Mmhg",
      label: "Arterial O2",
      kind: "number",
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "aaGradientSeaLevelMmhg",
      label: "A-a gradient",
      kind: "number",
      unit: "mmHg",
    },
  ],
  calculate: (input) => {
    const paco2Mmhg = input.paco2Mmhg as number;
    const pao2Mmhg = input.pao2Mmhg as number;
    if (paco2Mmhg <= 0)
      simpleError("paco2Mmhg", "Arterial CO2 must be positive.");
    if (pao2Mmhg <= 0) simpleError("pao2Mmhg", "Arterial O2 must be positive.");
    return {
      aaGradientSeaLevelMmhg:
        (input.fiO2Fraction as number) * (760 - 47) -
        paco2Mmhg / 0.8 -
        pao2Mmhg,
    };
  },
});
export const runAlveolarArterialGradient2 =
  alveolarArterialGradient2Tool.execute;
export default alveolarArterialGradient2Tool;
