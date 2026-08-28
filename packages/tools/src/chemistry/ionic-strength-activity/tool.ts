import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ionicStrengthActivityTool = createSimpleTool({
  id: "chemistry/ionic-strength-activity",
  title: "Ionic Strength Activity Calculator",
  description:
    "Compute ionic strength I = 0.5 * sum(ci * zi^2) for two ion species.",
  inputs: [
    { id: "conc1MolL", label: "Ion 1 conc", kind: "number", minimum: 0 },
    { id: "charge1", label: "Ion 1 charge", kind: "integer", minimum: 1 },
    { id: "conc2MolL", label: "Ion 2 conc", kind: "number", minimum: 0 },
    { id: "charge2", label: "Ion 2 charge", kind: "integer", minimum: 1 },
  ],
  outputs: [
    { id: "ionicStrengthMolL", label: "Ionic strength", kind: "number" },
  ],
  calculate: (input) => {
    return {
      ionicStrengthMolL:
        0.5 *
        ((input.conc1MolL as number) * (input.charge1 as number) ** 2 +
          (input.conc2MolL as number) * (input.charge2 as number) ** 2),
    };
  },
});
export const runIonicStrengthActivity = ionicStrengthActivityTool.execute;
export default ionicStrengthActivityTool;

export type IonicStrengthActivityInput = {
  readonly conc1MolL: number;
  readonly charge1: number;
  readonly conc2MolL: number;
  readonly charge2: number;
};

export type IonicStrengthActivityOutput = {
  readonly ionicStrengthMolL: number;
};

export const ionicStrengthActivityExample = {
  input: {
    conc1MolL: 1,
    charge1: 1,
    conc2MolL: 1,
    charge2: 1,
  },
  output: {
    ionicStrengthMolL: 1,
  },
} satisfies ToolExample<
  IonicStrengthActivityInput,
  IonicStrengthActivityOutput
>;
