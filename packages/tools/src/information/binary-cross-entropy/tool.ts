import { createSimpleTool, simpleError } from "../../core/simple.js";
export const binaryCrossEntropyTool = createSimpleTool({
  id: "information/binary-cross-entropy",
  title: "Binary Cross-Entropy Calculator",
  description:
    "Calculate binary cross-entropy for one observed label and predicted probability.",
  inputs: [
    {
      id: "label",
      label: "Observed label",
      kind: "integer",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "probability",
      label: "Predicted probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [{ id: "crossEntropy", label: "Cross-entropy", kind: "number" }],
  calculate: (input) => {
    const p = input.probability as number,
      y = input.label as number;
    if (p <= 0 || p >= 1)
      simpleError(
        "probability",
        "Predicted probability must be strictly between zero and one.",
      );
    return { crossEntropy: -(y * Math.log(p) + (1 - y) * Math.log(1 - p)) };
  },
});
export const runBinaryCrossEntropy = binaryCrossEntropyTool.execute;
export default binaryCrossEntropyTool;
