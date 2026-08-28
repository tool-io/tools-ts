import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DilutionM1V1Input = {
  readonly m1: number;
  readonly m2: number;
  readonly v1: number;
};

export type DilutionM1V1Output = {
  readonly finalVolumeLiters: number;
};

export const dilutionM1V1Example = {
  input: { m1: 2, v1: 0.5, m2: 1 },
  output: { finalVolumeLiters: 1 },
} satisfies ToolExample<DilutionM1V1Input, DilutionM1V1Output>;

export const dilutionM1V1Tool = createSimpleTool({
  id: "chemistry/dilution-m1v1",
  title: "Dilution M1V1=M2V2 Calculator",
  description:
    "Solve V2 from the dilution relation M1V1=M2V2 given stock and target concentrations.",
  inputs: [
    {
      description: "Stock concentration before dilution.",
      id: "m1",
      kind: "number",
      label: "Initial concentration M1",
      unit: "mol/L",
    },
    {
      description: "Volume of stock solution used.",
      id: "v1",
      kind: "number",
      label: "Initial volume V1",
      unit: "L",
    },
    {
      description: "Target concentration after dilution.",
      id: "m2",
      kind: "number",
      label: "Final concentration M2",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Final solution volume after dilution.",
      id: "finalVolumeLiters",
      kind: "number",
      label: "Final volume V2",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const m1 = input.m1 as number;
    if (!(m1 > 0))
      simpleError("m1", "The initial concentration must be greater than zero.");
    const v1 = input.v1 as number;
    if (!(v1 > 0))
      simpleError("v1", "The initial volume must be greater than zero.");
    const m2 = input.m2 as number;
    if (!(m2 > 0))
      simpleError("m2", "The final concentration must be greater than zero.");
    return { finalVolumeLiters: (m1 * v1) / m2 };
  },
});
export const runDilutionM1V1 = dilutionM1V1Tool.execute;
export default dilutionM1V1Tool;
