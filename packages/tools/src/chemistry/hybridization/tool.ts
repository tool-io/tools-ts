import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const HYBRIDIZATIONS: Record<number, string> = {
  2: "sp",
  3: "sp2",
  4: "sp3",
  5: "sp3d",
  6: "sp3d2",
};

export const hybridizationTool = createSimpleTool({
  id: "chemistry/hybridization",
  title: "Hybridization Lookup",
  description:
    "Look up the orbital hybridization of a central atom from its steric number (bonded atoms plus lone pairs).",
  inputs: [
    {
      description: "Steric number: bonded atoms plus lone pairs.",
      id: "stericNumber",
      label: "Steric number",
      kind: "integer",
      maximum: 6,
      minimum: 1,
    },
  ],
  outputs: [{ id: "hybridization", label: "Hybridization", kind: "string" }],
  calculate: (input) => {
    const stericNumber = input.stericNumber as number;
    const hybridization = HYBRIDIZATIONS[stericNumber];
    if (!hybridization)
      simpleError(
        "stericNumber",
        "The steric number must be between two and six for standard hybridizations.",
        "unsupported_steric_number",
      );
    return { hybridization };
  },
});
export const runHybridization = hybridizationTool.execute;
export default hybridizationTool;

export type HybridizationInput = {
  readonly stericNumber: number;
};

export type HybridizationOutput = {
  readonly hybridization: string;
};

export const hybridizationExample = {
  input: {
    stericNumber: 2,
  },
  output: {
    hybridization: "sp",
  },
} satisfies ToolExample<HybridizationInput, HybridizationOutput>;
