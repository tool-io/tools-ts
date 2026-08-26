import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TabulaAnsataNoteGeneratorInput = {
  readonly topEdgeCm: number;
  readonly bottomEdgeCm: number;
  readonly heightCm: number;
};

export type TabulaAnsataNoteGeneratorOutput = {
  readonly insetPerSideCm: number;
  readonly areaCm2: number;
  readonly note: string;
};

export const calculateTabulaAnsataNoteGenerator = (
  input: TabulaAnsataNoteGeneratorInput,
): TabulaAnsataNoteGeneratorOutput => {
  for (const key of ["topEdgeCm", "bottomEdgeCm", "heightCm"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Panel dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  if (input.topEdgeCm < input.bottomEdgeCm)
    return simpleError(
      "topEdgeCm",
      "The top edge must be at least as long as the bottom edge.",
      "invalid_edge_order",
    );
  const insetPerSideCm = (input.topEdgeCm - input.bottomEdgeCm) / 2;
  const areaCm2 = ((input.topEdgeCm + input.bottomEdgeCm) / 2) * input.heightCm;
  const note = `Tabula ansata panel: parallel edges of ${input.topEdgeCm} cm and ${input.bottomEdgeCm} cm over a height of ${input.heightCm} cm; each side tapers ${insetPerSideCm} cm inward.`;
  return { insetPerSideCm, areaCm2, note };
};

export const tabulaAnsataNoteGeneratorExample = {
  input: { topEdgeCm: 40, bottomEdgeCm: 30, heightCm: 25 },
  output: {
    insetPerSideCm: 5,
    areaCm2: 875,
    note: "Tabula ansata panel: parallel edges of 40 cm and 30 cm over a height of 25 cm; each side tapers 5 cm inward.",
  },
} satisfies ToolExample<
  TabulaAnsataNoteGeneratorInput,
  TabulaAnsataNoteGeneratorOutput
>;

export const tabulaAnsataNoteGeneratorTool = createSimpleTool({
  id: "epigraphy/tabula-ansata-note-generator",
  title: "Tabula Ansata Panel Shape Coordinate Note Generator",
  description:
    "Generate a descriptive cataloguing note plus side inset and trapezoid area for a tabula ansata panel from its parallel edge lengths and height.",
  inputs: [
    {
      description: "Longer (top) parallel edge in centimetres.",
      id: "topEdgeCm",
      kind: "number",
      label: "Top edge",
      minimum: 0,
    },
    {
      description: "Shorter (bottom) parallel edge in centimetres.",
      id: "bottomEdgeCm",
      kind: "number",
      label: "Bottom edge",
      minimum: 0,
    },
    {
      description:
        "Perpendicular height between the parallel edges in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Horizontal taper of each sloping side in centimetres.",
      id: "insetPerSideCm",
      kind: "number",
      label: "Inset per side",
    },
    {
      description: "Trapezoid panel area in square centimetres.",
      id: "areaCm2",
      kind: "number",
      label: "Area",
    },
    {
      description: "Catalogue note describing the panel shape.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  calculate: (input) =>
    calculateTabulaAnsataNoteGenerator(
      input as unknown as TabulaAnsataNoteGeneratorInput,
    ),
});

export const runTabulaAnsataNoteGenerator =
  tabulaAnsataNoteGeneratorTool.execute;
export default tabulaAnsataNoteGeneratorTool;
