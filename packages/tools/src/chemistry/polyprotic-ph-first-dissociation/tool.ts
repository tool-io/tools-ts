import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const polyproticPhFirstDissociationExample = {
  input: { concM: 0.1, ka1: 7.5e-7 },
} satisfies ToolExample<{
  readonly concM: number;
  readonly ka1: number;
}>;

export const polyproticPhFirstDissociationTool = createSimpleTool({
  id: "chemistry/polyprotic-ph-first-dissociation",
  title: "Polyprotic pH First Step",
  description:
    "Compute the pH of a polyprotic acid solution from its first dissociation step as the negative log10 of the square root of ka1 times concentration.",
  inputs: [
    { id: "ka1", label: "First dissociation constant Ka1", kind: "number" },
    { id: "concM", label: "Acid concentration", kind: "number", unit: "M" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const ka1 = input.ka1 as number;
    const concM = input.concM as number;
    if (!(ka1 > 0)) simpleError("ka1", "Ka1 must be positive.");
    if (!(concM > 0)) simpleError("concM", "Concentration must be positive.");
    return { ph: -Math.log10(Math.sqrt(ka1 * concM)) };
  },
});
export const runPolyproticPhFirstDissociation =
  polyproticPhFirstDissociationTool.execute;
export default polyproticPhFirstDissociationTool;
