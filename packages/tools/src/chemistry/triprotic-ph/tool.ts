import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const triproticPhTool = createSimpleTool({
  id: "chemistry/triprotic-ph",
  title: "Triprotic Amphiprotic Species pH Estimate",
  description:
    "Estimate the pH of either intermediate amphiprotic form of a triprotic acid from the average of its adjacent pKa values.",
  inputs: [
    { id: "pka1", label: "pKa1", kind: "number" },
    { id: "pka2", label: "pKa2", kind: "number" },
    { id: "pka3", label: "pKa3", kind: "number" },
    {
      id: "species",
      label: "Amphiprotic species",
      kind: "string",
      enum: ["H2A-", "HA2-"],
    },
  ],
  outputs: [{ id: "ph", label: "Isoelectric pH", kind: "number" }],
  calculate: (input) => {
    const lowerPka =
      input.species === "H2A-"
        ? (input.pka1 as number)
        : (input.pka2 as number);
    const upperPka =
      input.species === "H2A-"
        ? (input.pka2 as number)
        : (input.pka3 as number);
    return { ph: (lowerPka + upperPka) / 2 };
  },
});
export default triproticPhTool;
export const runTriproticPh = triproticPhTool.execute;

export type TriproticPhInput = {
  readonly pka1: number;
  readonly pka2: number;
  readonly pka3: number;
  readonly species: "H2A-" | "HA2-";
};

export type TriproticPhOutput = {
  readonly ph: number;
};

export const triproticPhExample = {
  input: {
    pka1: 2.15,
    pka2: 7.2,
    pka3: 12.35,
    species: "HA2-",
  },
  output: {
    ph: 9.775,
  },
} satisfies ToolExample<TriproticPhInput, TriproticPhOutput>;
