import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const hallmarks = [
  {
    name: "Genomic instability",
    system: "genome",
    question: "What damage, repair, or mutation pattern is changing?",
  },
  {
    name: "Telomere attrition",
    system: "chromosome",
    question: "What telomere change is being observed?",
  },
  {
    name: "Epigenetic alterations",
    system: "gene regulation",
    question: "Which regulatory pattern is being altered?",
  },
  {
    name: "Loss of proteostasis",
    system: "protein quality control",
    question: "Which protein-quality process is declining?",
  },
  {
    name: "Deregulated nutrient-sensing",
    system: "metabolic sensing",
    question: "Which nutrient-sensing pathway is deregulated?",
  },
  {
    name: "Mitochondrial dysfunction",
    system: "energy metabolism",
    question: "What mitochondrial function is impaired?",
  },
  {
    name: "Cellular senescence",
    system: "cell lifecycle",
    question: "Which persistent senescent-cell population changes?",
  },
  {
    name: "Stem cell exhaustion",
    system: "tissue renewal",
    question: "Which regenerative stem-cell function declines?",
  },
  {
    name: "Altered intercellular communication",
    system: "intercellular signaling",
    question: "Which signaling or inflammatory interaction is altered?",
  },
] as const;

export type HallmarkLookupInput = {
  readonly hallmarkNumber: number;
};

export type HallmarkLookupOutput = {
  readonly hallmarkName: (typeof hallmarks)[number]["name"];
  readonly hallmarkNumber: number;
  readonly investigativeQuestion: string;
  readonly system: string;
};

export const lookupHallmarkOfAging = (
  input: HallmarkLookupInput,
): HallmarkLookupOutput => {
  if (
    !Number.isSafeInteger(input.hallmarkNumber) ||
    input.hallmarkNumber < 1 ||
    input.hallmarkNumber > hallmarks.length
  )
    simpleError(
      "hallmarkNumber",
      "Hallmark number must be an integer from 1 through 9.",
      "hallmark_number_out_of_range",
    );
  const hallmark = hallmarks[input.hallmarkNumber - 1]!;
  return {
    hallmarkName: hallmark.name,
    hallmarkNumber: input.hallmarkNumber,
    investigativeQuestion: hallmark.question,
    system: hallmark.system,
  };
};

export const hallmarkLookupExample = {
  input: { hallmarkNumber: 6 },
  output: {
    hallmarkName: "Mitochondrial dysfunction",
    hallmarkNumber: 6,
    investigativeQuestion: "What mitochondrial function is impaired?",
    system: "energy metabolism",
  },
} satisfies ToolExample<HallmarkLookupInput, HallmarkLookupOutput>;

export const hallmarkLookupTool = createSimpleTool({
  calculate: (input) =>
    lookupHallmarkOfAging({ hallmarkNumber: input.hallmarkNumber as number }),
  description:
    "Look up one of the nine original hallmarks of aging with its system and an investigative question.",
  id: "futurology/hallmarks-of-aging-nine-list-lookup",
  inputs: [
    {
      id: "hallmarkNumber",
      kind: "integer",
      label: "Hallmark number",
      maximum: 9,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "hallmarkName", kind: "string", label: "Hallmark name" },
    {
      id: "hallmarkNumber",
      kind: "integer",
      label: "Hallmark number",
      maximum: 9,
      minimum: 1,
    },
    {
      id: "investigativeQuestion",
      kind: "string",
      label: "Investigative question",
    },
    { id: "system", kind: "string", label: "Biological system" },
  ],
  title: "Hallmarks of Aging Nine List Lookup",
});

export const runHallmarkLookup = hallmarkLookupTool.execute;
export default hallmarkLookupTool;
