import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NeoVintageBoundaryInput = {
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly productionYear: number;
};

export type NeoVintageBoundaryOutput = {
  readonly classification: "afterWindow" | "beforeWindow" | "withinWindow";
  readonly definitionCaution: string;
  readonly window: readonly number[];
};

export const screenNeoVintageYear = (
  input: NeoVintageBoundaryInput,
): NeoVintageBoundaryOutput => {
  if (!Number.isSafeInteger(input.productionYear))
    simpleError(
      "productionYear",
      "Production year must be a safe integer.",
      "production_year_invalid",
    );
  if (
    !Number.isSafeInteger(input.earliestYear) ||
    !Number.isSafeInteger(input.latestYear)
  )
    simpleError(
      "",
      "Window boundaries must be safe integers.",
      "year_boundary_invalid",
    );
  if (input.earliestYear > input.latestYear)
    simpleError(
      "",
      "Earliest year must not exceed latest year.",
      "year_window_reversed",
    );
  return {
    classification:
      input.productionYear < input.earliestYear
        ? "beforeWindow"
        : input.productionYear > input.latestYear
          ? "afterWindow"
          : "withinWindow",
    definitionCaution:
      "Neo-vintage is a collector category without one universal date rule; these boundaries are caller-supplied and production year alone does not establish value or significance.",
    window: [input.earliestYear, input.latestYear],
  };
};

export const neoVintageBoundaryExample = {
  input: { earliestYear: 1980, latestYear: 2000, productionYear: 1990 },
  output: {
    classification: "withinWindow",
    definitionCaution:
      "Neo-vintage is a collector category without one universal date rule; these boundaries are caller-supplied and production year alone does not establish value or significance.",
    window: [1980, 2000],
  },
} satisfies ToolExample<NeoVintageBoundaryInput, NeoVintageBoundaryOutput>;

export const neoVintageBoundaryTool = createSimpleTool({
  calculate: (input) =>
    screenNeoVintageYear({
      earliestYear: input.earliestYear as number,
      latestYear: input.latestYear as number,
      productionYear: input.productionYear as number,
    }),
  description:
    "Screen a production year against explicit collector-supplied neo-vintage boundaries without claiming a universal 1980–2000 definition.",
  id: "horology/neo-vintage-year-boundary-screen",
  inputs: [
    {
      id: "earliestYear",
      kind: "integer",
      label: "Caller-defined earliest year",
    },
    { id: "latestYear", kind: "integer", label: "Caller-defined latest year" },
    { id: "productionYear", kind: "integer", label: "Production year" },
  ],
  outputs: [
    {
      enum: ["beforeWindow", "withinWindow", "afterWindow"],
      id: "classification",
      kind: "string",
      label: "Caller-window classification",
    },
    {
      id: "definitionCaution",
      kind: "string",
      label: "Neo-vintage definition caution",
    },
    { id: "window", kind: "numberList", label: "Caller-defined year window" },
  ],
  title: "Neo Vintage Year Boundary Screen",
});

export const runNeoVintageBoundary = neoVintageBoundaryTool.execute;
export default neoVintageBoundaryTool;
