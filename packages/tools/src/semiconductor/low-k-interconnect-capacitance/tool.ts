import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LowKInterconnectCapacitanceInput = {
  readonly dielectricThicknessUm: number;
  readonly lineAreaUm2: number;
  readonly lowKPermittivity: number;
};

export type LowKInterconnectCapacitanceOutput = {
  readonly capacitanceFF: number;
};

export const lowKInterconnectCapacitanceExample = {
  input: { dielectricThicknessUm: 0.5, lineAreaUm2: 1, lowKPermittivity: 2 },
  output: { capacitanceFF: 0.0354167512512 },
} satisfies ToolExample<
  LowKInterconnectCapacitanceInput,
  LowKInterconnectCapacitanceOutput
>;

export const lowKInterconnectCapacitanceTool = createSimpleTool({
  calculate: (input) => {
    const lowKPermittivity = input.lowKPermittivity as number;
    const lineAreaUm2 = input.lineAreaUm2 as number;
    const dielectricThicknessUm = input.dielectricThicknessUm as number;
    if (!(lowKPermittivity > 1))
      simpleError(
        "lowKPermittivity",
        "Low-K permittivity must exceed the vacuum permittivity of 1.",
        "insufficient_permittivity",
      );
    if (!(lineAreaUm2 > 0))
      simpleError(
        "lineAreaUm2",
        "Line area must be positive.",
        "degenerate_input",
      );
    if (!(dielectricThicknessUm > 0))
      simpleError(
        "dielectricThicknessUm",
        "Dielectric thickness must be positive.",
        "degenerate_input",
      );
    return {
      capacitanceFF:
        (lowKPermittivity * 0.0088541878128 * lineAreaUm2) /
        dielectricThicknessUm,
    };
  },
  description:
    "Compute parallel-plate capacitance of a low-K interconnect dielectric in femtofarads.",
  id: "semiconductor/low-k-interconnect-capacitance",
  inputs: [
    {
      id: "lowKPermittivity",
      kind: "number",
      label: "Low-K permittivity",
      minimum: 1 + Number.EPSILON,
    },
    {
      id: "lineAreaUm2",
      kind: "number",
      label: "Line plate area",
      minimum: Number.MIN_VALUE,
      unit: "um^2",
    },
    {
      id: "dielectricThicknessUm",
      kind: "number",
      label: "Dielectric thickness",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  outputs: [
    {
      id: "capacitanceFF",
      kind: "number",
      label: "Line capacitance",
      minimum: Number.MIN_VALUE,
      unit: "fF",
    },
  ],
  title: "Low-K Line Capacitance Calculator",
});
export const runLowKInterconnectCapacitance =
  lowKInterconnectCapacitanceTool.execute;
export default lowKInterconnectCapacitanceTool;
