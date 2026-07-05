import { createSimpleTool } from "../../core/simple.js";
export const linearTool = createSimpleTool({
  id: "interpolation/linear",
  title: "Linear Interpolation Calculator",
  description: "Interpolate between two values using a finite parameter.",
  inputs: [
    { id: "start", label: "Start value", kind: "number" },
    { id: "end", label: "End value", kind: "number" },
    { id: "parameter", label: "Parameter", kind: "number" },
  ],
  outputs: [{ id: "value", label: "Interpolated value", kind: "number" }],
  calculate: (input) => {
    return {
      value:
        (input.start as number) +
        ((input.end as number) - (input.start as number)) *
          (input.parameter as number),
    };
  },
});
export const runLinear = linearTool.execute;
export default linearTool;
