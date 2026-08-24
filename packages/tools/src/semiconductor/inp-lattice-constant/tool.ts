import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type InpLatticeConstantInput = {
  readonly temperatureC?: number;
};

export type InpLatticeConstantOutput = {
  readonly latticeConstantAngstrom: number;
};

export const inpLatticeConstantExample = {
  input: { temperatureC: 100 },
  output: { latticeConstantAngstrom: 5.871007198 },
} satisfies ToolExample<InpLatticeConstantInput, InpLatticeConstantOutput>;

export const inpLatticeConstantTool = createSimpleTool({
  calculate: (input) => ({
    latticeConstantAngstrom:
      5.869 * (1 + 4.56e-6 * ((input.temperatureC as number) - 25)),
  }),
  description:
    "Compute the InP lattice constant at a temperature using the 25 degrees Celsius reference value 5.869 angstrom and a documented thermal expansion coefficient of 4.56e-6 per kelvin.",
  id: "semiconductor/inp-lattice-constant",
  inputs: [
    {
      default: 25,
      id: "temperatureC",
      kind: "number",
      label: "Temperature",
      maximum: 300,
      minimum: -50,
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "latticeConstantAngstrom",
      kind: "number",
      label: "Lattice constant",
      unit: "Å",
    },
  ],
  title: "InP Lattice Constant Calculator",
});
export const runInpLatticeConstant = inpLatticeConstantTool.execute;
export default inpLatticeConstantTool;
