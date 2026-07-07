import { createSimpleTool, simpleError } from "../../core/simple.js";
export const numberNeededToTreatTool = createSimpleTool({
  id: "statistics/number-needed-to-treat",
  title: "Number Needed to Treat Calculator",
  description:
    "Calculate number needed to treat from treatment and control event rates.",
  inputs: [
    {
      id: "treatmentRate",
      label: "Treatment event rate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "controlRate",
      label: "Control event rate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "numberNeededToTreat",
      label: "Number needed to treat",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const difference = Math.abs(
      (input.treatmentRate as number) - (input.controlRate as number),
    );
    if (difference === 0)
      simpleError("treatmentRate", "Event rates must differ.");
    return { numberNeededToTreat: 1 / difference };
  },
});
export const runNumberNeededToTreat = numberNeededToTreatTool.execute;
export default numberNeededToTreatTool;
