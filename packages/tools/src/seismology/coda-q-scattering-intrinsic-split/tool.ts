import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codaQScatteringIntrinsicSplitExample = {
  input: { qIntrinsic: 1000, qScattering: 1500 },
  output: { qualityFactorTotal: 600, scatteringFractionPercent: 40 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const codaQScatteringIntrinsicSplitTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ qIntrinsic, qScattering }) => {
      if (qIntrinsic <= 0 || qScattering <= 0)
        simpleError("qIntrinsic", "Q values must be positive.");
      const invTotal = 1 / qIntrinsic + 1 / qScattering;
      return {
        qualityFactorTotal: 1 / invTotal,
        scatteringFractionPercent: (1 / qScattering / invTotal) * 100,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Split total attenuation into intrinsic and scattering parts via 1/Q_total = 1/Q_intrinsic + 1/Q_scattering.",
  id: "seismology/coda-q-scattering-intrinsic-split",
  inputs: [
    {
      minimum: 0,
      description: "Intrinsic quality factor.",
      id: "qIntrinsic",
      kind: "number",
      label: "Qi",
    },
    {
      minimum: 0,
      description: "Scattering quality factor.",
      id: "qScattering",
      kind: "number",
      label: "Qs",
    },
  ],
  outputs: [
    {
      description: "Total quality factor.",
      id: "qualityFactorTotal",
      kind: "number",
      label: "Qt",
    },
    {
      description: "Scattering share of total attenuation.",
      id: "scatteringFractionPercent",
      kind: "number",
      label: "Qs%",
      unit: "%",
    },
  ],
  title: "Coda Q Scattering Intrinsic Split Calculator",
});
export const runCodaQScatteringIntrinsicSplit =
  codaQScatteringIntrinsicSplitTool.execute;
export { codaQScatteringIntrinsicSplitExample as example };
export default codaQScatteringIntrinsicSplitTool;
