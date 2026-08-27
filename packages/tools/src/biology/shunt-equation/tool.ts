import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const shuntEquationExample = {
  input: { caO2MlDl: 19, ccO2MlDl: 20, cvO2MlDl: 15 },
  output: { shuntFraction: 0.2 },
} satisfies ToolExample<
  {
    readonly caO2MlDl: number;
    readonly ccO2MlDl: number;
    readonly cvO2MlDl: number;
  },
  { readonly shuntFraction: number }
>;

export const shuntEquationTool = createSimpleTool({
  id: "biology/shunt-equation",
  title: "Classic Shunt Equation",
  description:
    "Compute the physiologic shunt fraction as the classic shunt equation Qs/Qt = (CcO2 - CaO2) / (CcO2 - CvO2).",
  inputs: [
    {
      id: "ccO2MlDl",
      label: "End-capillary O2 content",
      kind: "number",
      unit: "mL/dL",
    },
    {
      id: "caO2MlDl",
      label: "Arterial O2 content",
      kind: "number",
      unit: "mL/dL",
    },
    {
      id: "cvO2MlDl",
      label: "Mixed venous O2 content",
      kind: "number",
      unit: "mL/dL",
    },
  ],
  outputs: [
    {
      id: "shuntFraction",
      label: "Shunt fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ccO2MlDl = input.ccO2MlDl as number;
    const caO2MlDl = input.caO2MlDl as number;
    const cvO2MlDl = input.cvO2MlDl as number;
    const denominator = ccO2MlDl - cvO2MlDl;
    if (denominator === 0)
      simpleError(
        "cvO2MlDl",
        "End-capillary and mixed venous contents must differ.",
        "equal_contents",
      );
    return {
      shuntFraction: (ccO2MlDl - caO2MlDl) / denominator,
    };
  },
});
export const runShuntEquation = shuntEquationTool.execute;
export default shuntEquationTool;
