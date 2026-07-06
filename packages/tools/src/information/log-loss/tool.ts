import { createSimpleTool, simpleError } from "../../core/simple.js";
export const logLossTool = createSimpleTool({
  id: "information/log-loss",
  title: "Log-Loss Calculator",
  description:
    "Calculate mean binary log-loss across labels and predicted probabilities.",
  inputs: [
    { id: "labels", label: "Labels", kind: "numberList" },
    {
      id: "probabilities",
      label: "Predicted probabilities",
      kind: "numberList",
    },
  ],
  outputs: [{ id: "logLoss", label: "Log-loss", kind: "number" }],
  calculate: (input) => {
    const labels = input.labels as number[],
      probabilities = input.probabilities as number[];
    if (labels.length === 0 || labels.length !== probabilities.length)
      simpleError(
        "probabilities",
        "Labels and probabilities must have the same nonzero length.",
      );
    let total = 0;
    for (let index = 0; index < labels.length; index++) {
      const y = labels[index]!,
        p = probabilities[index]!;
      if ((y !== 0 && y !== 1) || p <= 0 || p >= 1)
        simpleError(
          "probabilities",
          "Labels must be zero or one and probabilities strictly between zero and one.",
        );
      total -= y * Math.log(p) + (1 - y) * Math.log(1 - p);
    }
    return { logLoss: total / labels.length };
  },
});
export const runLogLoss = logLossTool.execute;
export default logLossTool;
