import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const molarMassFromEffusionTool = createSimpleTool({
  id: "chemistry/molar-mass-from-effusion",
  title: "Molar Mass From Effusion Calculator",
  description:
    "Apply Graham's law to find molar mass from effusion rates M2 = M1*(r1/r2)^2.",
  inputs: [
    {
      id: "referenceMolarMassGMol",
      label: "Ref MM",
      kind: "number",
      minimum: 0,
      unit: "g/mol",
    },
    { id: "referenceRate", label: "Ref rate", kind: "number", minimum: 0 },
    { id: "unknownRate", label: "Unknown rate", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "unknownMolarMassGMol",
      label: "Unknown MM",
      kind: "number",
      unit: "g/mol",
    },
  ],
  calculate: (input) => {
    const referenceMolarMass = input.referenceMolarMassGMol as number;
    const referenceRate = input.referenceRate as number;
    const unknownRate = input.unknownRate as number;
    if (!(referenceMolarMass > 0))
      simpleError(
        "referenceMolarMassGMol",
        "Reference molar mass must be greater than zero.",
      );
    if (!(referenceRate > 0))
      simpleError("referenceRate", "Reference rate must be greater than zero.");
    if (!(unknownRate > 0))
      simpleError("unknownRate", "Unknown rate must be greater than zero.");
    return {
      unknownMolarMassGMol:
        referenceMolarMass * (referenceRate / unknownRate) ** 2,
    };
  },
});
export const runMolarMassFromEffusion = molarMassFromEffusionTool.execute;
export default molarMassFromEffusionTool;

export type MolarMassFromEffusionInput = {
  readonly referenceMolarMassGMol: number;
  readonly referenceRate: number;
  readonly unknownRate: number;
};

export type MolarMassFromEffusionOutput = {
  readonly unknownMolarMassGMol: number;
};

export const molarMassFromEffusionExample = {
  input: {
    referenceMolarMassGMol: 1,
    referenceRate: 1,
    unknownRate: 1,
  },
  output: {
    unknownMolarMassGMol: 1,
  },
} satisfies ToolExample<
  MolarMassFromEffusionInput,
  MolarMassFromEffusionOutput
>;
