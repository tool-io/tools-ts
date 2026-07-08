import { createSimpleTool, simpleError } from "../../core/simple.js";
export const riskDifferenceTool = createSimpleTool({
  id: "statistics/risk-difference",
  title: "Risk Difference Calculator",
  description:
    "Calculate treatment risk minus control risk from event and total counts.",
  inputs: [
    {
      id: "treatmentEvents",
      label: "Treatment events",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "treatmentTotal",
      label: "Treatment total",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "controlEvents",
      label: "Control events",
      kind: "integer",
      minimum: 0,
    },
    { id: "controlTotal", label: "Control total", kind: "integer", minimum: 1 },
  ],
  outputs: [{ id: "riskDifference", label: "Risk difference", kind: "number" }],
  calculate: (input) => {
    if (
      (input.treatmentEvents as number) > (input.treatmentTotal as number) ||
      (input.controlEvents as number) > (input.controlTotal as number)
    )
      simpleError("treatmentEvents", "Events must not exceed totals.");
    return {
      riskDifference:
        (input.treatmentEvents as number) / (input.treatmentTotal as number) -
        (input.controlEvents as number) / (input.controlTotal as number),
    };
  },
});
export const runRiskDifference = riskDifferenceTool.execute;
export default riskDifferenceTool;
