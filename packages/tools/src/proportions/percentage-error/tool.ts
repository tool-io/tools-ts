import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentageErrorTool = createSimpleTool({
  id: "proportions/percentage-error",
  title: "Percentage Error Calculator",
  description:
    "Calculate absolute percentage error relative to an accepted value.",
  inputs: [
    { id: "observedValue", label: "Observed value", kind: "number" },
    { id: "acceptedValue", label: "Accepted value", kind: "number" },
  ],
  outputs: [
    {
      id: "percentError",
      label: "Percentage error",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const accepted = input.acceptedValue as number;
    if (accepted === 0)
      simpleError("acceptedValue", "Accepted value must not be zero.");
    return {
      percentError:
        (Math.abs((input.observedValue as number) - accepted) /
          Math.abs(accepted)) *
        100,
    };
  },
});
export const runPercentageError = percentageErrorTool.execute;
export default percentageErrorTool;
