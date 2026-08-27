import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const shuntFractionExample = {
  input: { caO2Content: 19, cco2Content: 20, cvO2Content: 15 },
  output: { shuntFractionPercent: 20 },
} satisfies ToolExample<
  {
    readonly caO2Content: number;
    readonly cco2Content: number;
    readonly cvO2Content: number;
  },
  { readonly shuntFractionPercent: number }
>;

export const shuntFractionTool = createSimpleTool({
  id: "biology/shunt-fraction",
  title: "Shunt Fraction %",
  description:
    "Estimate the physiologic shunt fraction as (CcO2 - CaO2) / (CcO2 - CvO2) x 100, signed.",
  inputs: [
    {
      id: "cco2Content",
      label: "End-capillary O2 content",
      kind: "number",
      unit: "mL/dL",
    },
    {
      id: "caO2Content",
      label: "Arterial O2 content",
      kind: "number",
      unit: "mL/dL",
    },
    {
      id: "cvO2Content",
      label: "Mixed venous O2 content",
      kind: "number",
      unit: "mL/dL",
    },
  ],
  outputs: [
    {
      id: "shuntFractionPercent",
      label: "Shunt fraction",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const cco2Content = input.cco2Content as number;
    const caO2Content = input.caO2Content as number;
    const cvO2Content = input.cvO2Content as number;
    if (Number.isFinite(cco2Content) === false)
      simpleError("cco2Content", "O2 contents must be finite.");
    if (Number.isFinite(caO2Content) === false)
      simpleError("caO2Content", "O2 contents must be finite.");
    if (Number.isFinite(cvO2Content) === false)
      simpleError("cvO2Content", "O2 contents must be finite.");
    if (cco2Content - cvO2Content === 0)
      simpleError(
        "cvO2Content",
        "End-capillary and mixed venous O2 contents must differ.",
        "equal_contents",
      );
    return {
      shuntFractionPercent:
        ((cco2Content - caO2Content) / (cco2Content - cvO2Content)) * 100,
    };
  },
});
export const runShuntFraction = shuntFractionTool.execute;
export default shuntFractionTool;
