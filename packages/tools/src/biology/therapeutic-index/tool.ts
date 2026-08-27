import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const therapeuticIndexExample = {
  input: { ed50Dose: 50, td50Dose: 500 },
} satisfies ToolExample<{
  readonly ed50Dose: number;
  readonly td50Dose: number;
}>;

export const therapeuticIndexTool = createSimpleTool({
  id: "biology/therapeutic-index",
  title: "Therapeutic Index",
  description:
    "Compute the ratio of the toxic dose TD50 to the effective dose ED50.",
  inputs: [
    { id: "ed50Dose", label: "Effective dose ED50", kind: "number" },
    { id: "td50Dose", label: "Toxic dose TD50", kind: "number" },
  ],
  outputs: [
    { id: "therapeuticIndex", label: "Therapeutic index", kind: "number" },
  ],
  calculate: (input) => {
    const ed50Dose = input.ed50Dose as number;
    const td50Dose = input.td50Dose as number;
    if (ed50Dose <= 0 || td50Dose <= 0)
      simpleError(
        "ed50Dose",
        "Doses must be greater than zero.",
        "invalid_dose",
      );
    return { therapeuticIndex: td50Dose / ed50Dose };
  },
});
export const runTherapeuticIndex = therapeuticIndexTool.execute;
export default therapeuticIndexTool;
