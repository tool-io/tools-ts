import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstFilterCenterNanometers: number;
  readonly secondFilterCenterNanometers: number;
  readonly firstFilterWidthNanometers: number;
  readonly secondFilterWidthNanometers: number;
}>;
export type Output = Readonly<{
  readonly centerSeparationNanometers: number;
  readonly passbandGapNanometers: number;
  readonly passbandsOverlap: boolean;
}>;

export const calculate = (input: Input): Output => {
  const centerSeparationNanometers = Math.abs(
    input.secondFilterCenterNanometers - input.firstFilterCenterNanometers,
  );
  const passbandGapNanometers =
    centerSeparationNanometers -
    (input.firstFilterWidthNanometers + input.secondFilterWidthNanometers) / 2;
  return {
    centerSeparationNanometers,
    passbandGapNanometers,
    passbandsOverlap: passbandGapNanometers <= 0,
  };
};

export const exampleInput = {
  firstFilterCenterNanometers: 1030,
  secondFilterCenterNanometers: 1050,
  firstFilterWidthNanometers: 10,
  secondFilterWidthNanometers: 10,
} satisfies Input;
export const exampleOutput = {
  centerSeparationNanometers: 20,
  passbandGapNanometers: 10,
  passbandsOverlap: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstFilterCenterNanometers: input.firstFilterCenterNanometers as number,
      secondFilterCenterNanometers:
        input.secondFilterCenterNanometers as number,
      firstFilterWidthNanometers: input.firstFilterWidthNanometers as number,
      secondFilterWidthNanometers: input.secondFilterWidthNanometers as number,
    }),
  description: "Calculate Mamyshev filter separation and passband overlap.",
  id: "laser/mamyshev-filter-separation",
  inputs: [
    {
      id: "firstFilterCenterNanometers",
      label: "First filter center",
      kind: "number",
      unit: "nm",
    },
    {
      id: "secondFilterCenterNanometers",
      label: "Second filter center",
      kind: "number",
      unit: "nm",
    },
    {
      id: "firstFilterWidthNanometers",
      label: "First filter width",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "secondFilterWidthNanometers",
      label: "Second filter width",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "centerSeparationNanometers",
      label: "Center separation",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "passbandGapNanometers",
      label: "Passband gap",
      kind: "number",
      unit: "nm",
    },
    { id: "passbandsOverlap", label: "Passbands overlap", kind: "boolean" },
  ],
  title: "Mamyshev Filter Separation",
});

export const run = tool.execute;
export default tool;
