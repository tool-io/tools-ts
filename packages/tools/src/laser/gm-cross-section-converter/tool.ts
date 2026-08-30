import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly crossSectionGm: number;
}>;
export type Output = Readonly<{
  readonly crossSectionCm4SPerPhoton: number;
  readonly crossSectionM4SPerPhoton: number;
}>;

export const calculate = (input: Input): Output => {
  return {
    crossSectionCm4SPerPhoton: input.crossSectionGm * 1e-50,
    crossSectionM4SPerPhoton: input.crossSectionGm * 1e-58,
  };
};

export const exampleInput = { crossSectionGm: 2 } satisfies Input;
export const exampleOutput = {
  crossSectionCm4SPerPhoton: 2e-50,
  crossSectionM4SPerPhoton: 2e-58,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      crossSectionGm: input.crossSectionGm as number,
    }),
  description:
    "Convert Goeppert–Mayer units to two-photon cross-section units.",
  id: "laser/gm-cross-section-converter",
  inputs: [
    {
      id: "crossSectionGm",
      label: "Two-photon cross section",
      kind: "number",
      minimum: 0,
      unit: "GM",
    },
  ],
  outputs: [
    {
      id: "crossSectionCm4SPerPhoton",
      label: "Cross section",
      kind: "number",
      minimum: 0,
      unit: "cm⁴·s/photon",
    },
    {
      id: "crossSectionM4SPerPhoton",
      label: "Cross section",
      kind: "number",
      minimum: 0,
      unit: "m⁴·s/photon",
    },
  ],
  title: "GM Cross-Section Converter",
});

export const run = tool.execute;
export default tool;
