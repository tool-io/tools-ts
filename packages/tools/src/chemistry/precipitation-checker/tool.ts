import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const precipitationCheckerExample = {
  input: { anionM: 0.001, ksp: 1e-10, metalIonM: 0.001 },
} satisfies ToolExample<{
  readonly anionM: number;
  readonly ksp: number;
  readonly metalIonM: number;
}>;

export const precipitationCheckerTool = createSimpleTool({
  id: "chemistry/precipitation-checker",
  title: "Precipitation Checker",
  description:
    "Determine whether a precipitate forms by comparing the ion product Q to the solubility product Ksp.",
  inputs: [
    {
      id: "metalIonM",
      label: "Metal ion concentration",
      kind: "number",
      unit: "M",
    },
    { id: "anionM", label: "Anion concentration", kind: "number", unit: "M" },
    { id: "ksp", label: "Solubility product Ksp", kind: "number" },
  ],
  outputs: [
    { id: "willPrecipitate", label: "Will precipitate", kind: "boolean" },
    { id: "ionProductQ", label: "Ion product Q", kind: "number" },
  ],
  calculate: (input) => {
    const metalIonM = input.metalIonM as number;
    const anionM = input.anionM as number;
    const ksp = input.ksp as number;
    if (!(metalIonM > 0))
      simpleError("metalIonM", "Metal ion concentration must be positive.");
    if (!(anionM > 0))
      simpleError("anionM", "Anion concentration must be positive.");
    if (!(ksp > 0)) simpleError("ksp", "Ksp must be positive.");
    const ionProductQ = metalIonM * anionM;
    return { willPrecipitate: ionProductQ > ksp, ionProductQ };
  },
});
export const runPrecipitationChecker = precipitationCheckerTool.execute;
export default precipitationCheckerTool;
