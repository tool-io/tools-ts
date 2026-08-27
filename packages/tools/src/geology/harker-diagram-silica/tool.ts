import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HarkerDiagramSilicaInput = {
  readonly siO2WtPercent: number;
  readonly oxideName: string;
  readonly oxideWtPercent: number;
};

export type HarkerDiagramSilicaOutput = {
  readonly xSiO2WtPercent: number;
  readonly yOxideWtPercent: number;
  readonly oxideName: string;
};

export const calculateHarkerDiagramSilica = (
  input: HarkerDiagramSilicaInput,
): HarkerDiagramSilicaOutput => {
  if (!(input.siO2WtPercent > 0 && input.siO2WtPercent <= 100))
    simpleError(
      "siO2WtPercent",
      "SiO2 must be above zero and no more than 100 wt%.",
      "invalid_oxide",
    );
  if (!(input.oxideWtPercent >= 0 && input.oxideWtPercent <= 100))
    simpleError(
      "oxideWtPercent",
      "Oxide percentage must lie between 0 and 100 wt%.",
      "invalid_oxide",
    );
  const name = input.oxideName.trim();
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name))
    simpleError(
      "oxideName",
      "Use an oxide name like MgO or Na2O.",
      "invalid_name",
    );
  return {
    xSiO2WtPercent: input.siO2WtPercent,
    yOxideWtPercent: input.oxideWtPercent,
    oxideName: name,
  };
};

export const harkerDiagramSilicaExample = {
  input: { siO2WtPercent: 57.2, oxideName: "MgO", oxideWtPercent: 3.4 },
  output: { xSiO2WtPercent: 57.2, yOxideWtPercent: 3.4, oxideName: "MgO" },
} satisfies ToolExample<HarkerDiagramSilicaInput, HarkerDiagramSilicaOutput>;

export const harkerDiagramSilicaTool = createSimpleTool({
  id: "geology/harker-diagram-silica",
  title: "Harker Diagram Silica Calculator",
  description:
    "Prepare one silica-versus-oxide point pair for a Harker variation diagram.",
  inputs: [
    {
      description: "SiO2 weight percent on the x axis.",
      id: "siO2WtPercent",
      kind: "number",
      label: "SiO2",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Oxide being plotted, e.g. MgO.",
      id: "oxideName",
      kind: "string",
      label: "Oxide name",
    },
    {
      description: "Oxide weight percent on the y axis.",
      id: "oxideWtPercent",
      kind: "number",
      label: "Oxide wt%",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "X coordinate in SiO2 wt%.",
      id: "xSiO2WtPercent",
      kind: "number",
      label: "X (SiO2)",
    },
    {
      description: "Y coordinate in oxide wt%.",
      id: "yOxideWtPercent",
      kind: "number",
      label: "Y (oxide)",
    },
    {
      description: "Trimmed oxide label.",
      id: "oxideName",
      kind: "string",
      label: "Oxide",
    },
  ],
  calculate: (input) =>
    calculateHarkerDiagramSilica(input as unknown as HarkerDiagramSilicaInput),
});

export const runHarkerDiagramSilica = harkerDiagramSilicaTool.execute;
export default harkerDiagramSilicaTool;
