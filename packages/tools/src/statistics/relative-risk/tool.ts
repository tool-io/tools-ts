import { createSimpleTool, simpleError } from "../../core/simple.js";
export const relativeRiskTool = createSimpleTool({
  id: "statistics/relative-risk",
  title: "Relative Risk Calculator",
  description:
    "Calculate relative risk from event and total counts in two groups.",
  inputs: [
    {
      id: "exposedEvents",
      label: "Exposed events",
      kind: "integer",
      minimum: 0,
    },
    { id: "exposedTotal", label: "Exposed total", kind: "integer", minimum: 1 },
    {
      id: "controlEvents",
      label: "Control events",
      kind: "integer",
      minimum: 0,
    },
    { id: "controlTotal", label: "Control total", kind: "integer", minimum: 1 },
  ],
  outputs: [{ id: "relativeRisk", label: "Relative risk", kind: "number" }],
  calculate: (input) => {
    if (
      (input.exposedEvents as number) > (input.exposedTotal as number) ||
      (input.controlEvents as number) > (input.controlTotal as number)
    )
      simpleError("exposedEvents", "Events must not exceed totals.");
    const controlRisk =
      (input.controlEvents as number) / (input.controlTotal as number);
    if (controlRisk === 0)
      simpleError("controlEvents", "Control risk must be nonzero.");
    return {
      relativeRisk:
        (input.exposedEvents as number) /
        (input.exposedTotal as number) /
        controlRisk,
    };
  },
});
export const runRelativeRisk = relativeRiskTool.execute;
export default relativeRiskTool;
