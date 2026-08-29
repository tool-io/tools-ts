import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    mobilityM2PerVs: 3e-8,
    viscosityPaS: 0.001,
    permittivityFPerM: 7.08e-10,
    henryFunction: 1.5,
  },
  output: { zetaPotentialV: 0.0423728813559322 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/zeta-potential-henry",
  title: "Zeta Potential from Henry Equation",
  description:
    "Estimate zeta potential from electrophoretic mobility using Henry's equation ζ=3ημ/(2εf). Supply dynamic viscosity, absolute permittivity, and Henry function f(κa); the result depends on the electrokinetic regime.",
  inputs: [
    {
      id: "mobilityM2PerVs",
      kind: "number",
      label: "Electrophoretic mobility (m²/V·s)",
    },
    {
      id: "viscosityPaS",
      kind: "number",
      label: "Dynamic viscosity (Pa·s)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "permittivityFPerM",
      kind: "number",
      label: "Absolute permittivity (F/m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "henryFunction",
      kind: "number",
      label: "Henry function f(κa)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "zetaPotentialV", kind: "number", label: "Zeta Potential V" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      zetaPotentialV:
        (3 * i.viscosityPaS * i.mobilityM2PerVs) /
        (2 * i.permittivityFPerM * i.henryFunction),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ZetaPotentialHenryInput = Readonly<typeof example.input>;
export type ZetaPotentialHenryOutput = Readonly<typeof example.output>;
export const zetaPotentialHenryTool = tool;
export const runZetaPotentialHenry = tool.execute;
export default tool;
