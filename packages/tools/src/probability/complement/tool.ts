import { createSimpleTool } from "../../core/simple.js";
export const complementTool = createSimpleTool({
  id: "probability/complement",
  title: "Probability Complement Calculator",
  description: "Calculate the complement of a probability.",
  inputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "complement",
      label: "Complement",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    return { complement: 1 - (input.probability as number) };
  },
});
export const runComplement = complementTool.execute;
export default complementTool;
