import { createSimpleTool, simpleError } from "../../core/simple.js";
export const inverseLinearTool = createSimpleTool({
  id: "interpolation/inverse-linear",
  title: "Inverse Linear Interpolation Calculator",
  description:
    "Find the interpolation parameter corresponding to a value between two endpoints.",
  inputs: [
    { id: "start", label: "Start value", kind: "number" },
    { id: "end", label: "End value", kind: "number" },
    { id: "value", label: "Value", kind: "number" },
  ],
  outputs: [{ id: "parameter", label: "Parameter", kind: "number" }],
  calculate: (input) => {
    const span = (input.end as number) - (input.start as number);
    if (span === 0) simpleError("end", "Endpoints must differ.");
    return {
      parameter: ((input.value as number) - (input.start as number)) / span,
    };
  },
});
export const runInverseLinear = inverseLinearTool.execute;
export default inverseLinearTool;
