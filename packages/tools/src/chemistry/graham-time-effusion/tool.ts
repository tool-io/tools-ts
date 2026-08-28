import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const grahamTimeEffusionTool = createSimpleTool({
  id: "chemistry/graham-time-effusion",
  title: "Graham Time of Effusion Calculator",
  description:
    "Compare effusion times of two gases via Graham's law t₂/t₁ = √(M₂/M₁).",
  inputs: [
    {
      description:
        "Molar mass of the reference gas; must be greater than zero.",
      id: "referenceMolarMassGMol",
      label: "Reference molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      description: "Molar mass of the test gas; must be greater than zero.",
      id: "testMolarMassGMol",
      label: "Test molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      description:
        "Effusion time of the reference gas; must be greater than zero.",
      id: "referenceTimeS",
      label: "Reference time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Predicted effusion time of the test gas.",
      id: "testTimeS",
      label: "Test effusion time",
      kind: "number",
      unit: "s",
    },
  ],
  calculate: (input) => {
    const refMass = input.referenceMolarMassGMol as number;
    const testMass = input.testMolarMassGMol as number;
    const refTime = input.referenceTimeS as number;
    if (refMass <= 0 || testMass <= 0 || refTime <= 0)
      simpleError(
        "referenceMolarMassGMol",
        "All molar masses and the reference time must be greater than zero.",
        "invalid_graham_input",
      );
    return {
      testTimeS: refTime * Math.sqrt(testMass / refMass),
    };
  },
});
export const runGrahamTimeEffusion = grahamTimeEffusionTool.execute;
export default grahamTimeEffusionTool;

export type GrahamTimeEffusionInput = {
  readonly referenceMolarMassGMol: number;
  readonly testMolarMassGMol: number;
  readonly referenceTimeS: number;
};

export type GrahamTimeEffusionOutput = {
  readonly testTimeS: number;
};

export const grahamTimeEffusionExample = {
  input: {
    referenceMolarMassGMol: 1,
    testMolarMassGMol: 1,
    referenceTimeS: 1,
  },
  output: {
    testTimeS: 1,
  },
} satisfies ToolExample<GrahamTimeEffusionInput, GrahamTimeEffusionOutput>;
