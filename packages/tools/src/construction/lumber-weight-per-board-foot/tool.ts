import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberWeightPerBoardFootInput = Readonly<{
  readonly densityKgPerM3: number;
}>;
export type LumberWeightPerBoardFootOutput = Readonly<{
  readonly kilogramsPerBoardFoot: number;
}>;

export const calculateLumberWeightPerBoardFoot = (
  x: LumberWeightPerBoardFootInput,
): LumberWeightPerBoardFootOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  const kilogramsPerBoardFoot = x.densityKgPerM3 * 0.002359737216;
  if (!Number.isFinite(kilogramsPerBoardFoot))
    simpleError(
      "kilogramsPerBoardFoot",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    kilogramsPerBoardFoot: Object.is(kilogramsPerBoardFoot, -0)
      ? 0
      : kilogramsPerBoardFoot,
  };
};

export const example = {
  input: { densityKgPerM3: 500 },
  output: { kilogramsPerBoardFoot: 1.179868608 },
} satisfies ToolExample<
  LumberWeightPerBoardFootInput,
  LumberWeightPerBoardFootOutput
>;

export const tool = createSimpleTool({
  id: "construction/lumber-weight-per-board-foot",
  title: "Lumber Weight Per Board Foot",
  description:
    "Weight of one US board foot of lumber from density in kilograms per cubic meter; one board foot is exactly 1/12 cubic foot.",
  inputs: [
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "kilogramsPerBoardFoot",
      kind: "number",
      label: "Kilograms Per Board Foot",
      unit: "kg/BF",
    },
  ],
  calculate: (input) =>
    calculateLumberWeightPerBoardFoot({
      densityKgPerM3: input.densityKgPerM3 as number,
    }),
});
export const lumberWeightPerBoardFootTool = tool;
export const runLumberWeightPerBoardFoot = tool.execute;
export default tool;
