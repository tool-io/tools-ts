import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CognomenElementTallyInput = {
  readonly name: string;
};

export type CognomenElementTallyOutput = {
  readonly elements: number;
  readonly likelyCognomina: number;
};

export const calculateCognomenElementTally = (
  input: CognomenElementTallyInput,
): CognomenElementTallyOutput => {
  if (!input.name.trim())
    simpleError("name", "Name must contain characters.", "empty_name");
  const elements = input.name.trim().split(/\s+/).length;
  return { elements, likelyCognomina: Math.max(0, elements - 2) };
};

export const cognomenElementTallyExample = {
  input: { name: "Marcus Aurelius Antoninus Pius" },
  output: { elements: 4, likelyCognomina: 2 },
} satisfies ToolExample<CognomenElementTallyInput, CognomenElementTallyOutput>;

export const cognomenElementTallyTool = createSimpleTool({
  id: "epigraphy/cognomen-element-tally",
  title: "Cognomen Count Onomastic Element Tally Calculator",
  description:
    "Tallies the whitespace-separated onomastic elements of a Roman name and reports how many beyond praenomen and nomen are likely cognomina.",
  inputs: [
    {
      id: "name",
      kind: "string",
      label: "Name",
      description: "Full Roman name to tally.",
    },
  ],
  outputs: [
    {
      id: "elements",
      kind: "integer",
      label: "Elements",
      description: "Number of whitespace-separated name elements.",
    },
    {
      id: "likelyCognomina",
      kind: "integer",
      label: "Likely cognomina",
      description: "Element count minus two, floored at zero.",
    },
  ],
  calculate: (input) =>
    calculateCognomenElementTally(
      input as unknown as CognomenElementTallyInput,
    ),
});

export const runCognomenElementTally = cognomenElementTallyTool.execute;
export default cognomenElementTallyTool;
