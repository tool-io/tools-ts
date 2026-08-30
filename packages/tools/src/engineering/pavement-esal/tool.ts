import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PavementEsalInput = Readonly<{
  readonly axlePasses: number;
  readonly equivalencyFactor: number;
}>;
export type PavementEsalOutput = Readonly<{
  readonly equivalentAxleLoads: number;
}>;

export const calculatePavementEsal = (
  x: PavementEsalInput,
): PavementEsalOutput => {
  if (!Number.isFinite(x.axlePasses) || x.axlePasses < 0)
    simpleError("axlePasses", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.equivalencyFactor) || x.equivalencyFactor < 0)
    simpleError("equivalencyFactor", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.axlePasses))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const equivalentAxleLoads = x.axlePasses * x.equivalencyFactor;
  if (!Number.isFinite(equivalentAxleLoads))
    simpleError(
      "equivalentAxleLoads",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    equivalentAxleLoads: Object.is(equivalentAxleLoads, -0)
      ? 0
      : equivalentAxleLoads,
  };
};

export const example = {
  input: { axlePasses: 10000, equivalencyFactor: 1.5 },
  output: { equivalentAxleLoads: 15000 },
} satisfies ToolExample<PavementEsalInput, PavementEsalOutput>;

export const tool = createSimpleTool({
  id: "engineering/pavement-esal",
  title: "Pavement Esal",
  description:
    "Equivalent single-axle load count from traffic axle repetitions times a supplied equivalency factor; factor must come from a chosen method.",
  inputs: [
    { id: "axlePasses", kind: "integer", label: "Axle Passes", minimum: 0 },
    {
      id: "equivalencyFactor",
      kind: "number",
      label: "Equivalency Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "equivalentAxleLoads",
      kind: "number",
      label: "Equivalent Axle Loads",
    },
  ],
  calculate: (input) =>
    calculatePavementEsal({
      axlePasses: input.axlePasses as number,
      equivalencyFactor: input.equivalencyFactor as number,
    }),
});
export const pavementEsalTool = tool;
export const runPavementEsal = tool.execute;
export default tool;
