import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmpacityDeratedInput = Readonly<{
  readonly baseAmperes: number;
  readonly deratingFactor: number;
}>;
export type AmpacityDeratedOutput = Readonly<{
  readonly deratedAmperes: number;
}>;

export const calculateAmpacityDerated = (
  x: AmpacityDeratedInput,
): AmpacityDeratedOutput => {
  if (!Number.isFinite(x.baseAmperes) || x.baseAmperes < 0)
    simpleError("baseAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.deratingFactor) || x.deratingFactor < 0)
    simpleError("deratingFactor", "Provide a finite number at least 0.");
  if (x.deratingFactor > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const deratedAmperes = x.baseAmperes * x.deratingFactor;
  if (!Number.isFinite(deratedAmperes))
    simpleError(
      "deratedAmperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { deratedAmperes: Object.is(deratedAmperes, -0) ? 0 : deratedAmperes };
};

export const example = {
  input: { baseAmperes: 20, deratingFactor: 0.8 },
  output: { deratedAmperes: 16 },
} satisfies ToolExample<AmpacityDeratedInput, AmpacityDeratedOutput>;

export const tool = createSimpleTool({
  id: "engineering/ampacity-derated",
  title: "Ampacity Derated",
  description:
    "Adjusted current rating from a base ampacity times a supplied 0–1 derating factor; not a code sizing result.",
  inputs: [
    {
      id: "baseAmperes",
      kind: "number",
      label: "Base Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "deratingFactor",
      kind: "number",
      label: "Derating Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "deratedAmperes",
      kind: "number",
      label: "Derated Amperes",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateAmpacityDerated({
      baseAmperes: input.baseAmperes as number,
      deratingFactor: input.deratingFactor as number,
    }),
});
export const ampacityDeratedTool = tool;
export const runAmpacityDerated = tool.execute;
export default tool;
