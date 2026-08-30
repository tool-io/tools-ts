import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlkalinityRequirementInput = Readonly<{
  readonly tanOxidizedKilograms: number;
  readonly alkalinityKgCaco3PerKgN: number;
}>;
export type AlkalinityRequirementOutput = Readonly<{
  readonly alkalinityKgCaco3: number;
}>;

export const calculateAlkalinityRequirement = (
  x: AlkalinityRequirementInput,
): AlkalinityRequirementOutput => {
  if (!Number.isFinite(x.tanOxidizedKilograms) || x.tanOxidizedKilograms < 0)
    simpleError("tanOxidizedKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.alkalinityKgCaco3PerKgN) ||
    x.alkalinityKgCaco3PerKgN < 0
  )
    simpleError(
      "alkalinityKgCaco3PerKgN",
      "Provide a finite nonnegative number.",
    );
  const alkalinityKgCaco3 = x.tanOxidizedKilograms * x.alkalinityKgCaco3PerKgN;
  if (!Number.isFinite(alkalinityKgCaco3))
    simpleError(
      "alkalinityKgCaco3",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    alkalinityKgCaco3: Object.is(alkalinityKgCaco3, -0) ? 0 : alkalinityKgCaco3,
  };
};

export const example = {
  input: {
    tanOxidizedKilograms: 1,
    alkalinityKgCaco3PerKgN: 7.14,
  },
  output: { alkalinityKgCaco3: 7.14 },
} satisfies ToolExample<
  AlkalinityRequirementInput,
  AlkalinityRequirementOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/alkalinity-requirement",
  title: "Alkalinity Requirement",
  description:
    "Estimate alkalinity equivalent consumed by nitrification using an explicitly entered CaCO3-per-N factor.",
  inputs: [
    {
      id: "tanOxidizedKilograms",
      kind: "number",
      label: "TAN Oxidized Kilograms",
      unit: "kg TAN",
    },
    {
      id: "alkalinityKgCaco3PerKgN",
      kind: "number",
      label: "Alkalinity Kg Caco3 Per Kg N",
      unit: "kg/kg",
    },
  ],
  outputs: [
    {
      id: "alkalinityKgCaco3",
      kind: "number",
      label: "Alkalinity Kg Caco3",
      unit: "kg CaCO3",
    },
  ],
  calculate: (input) =>
    calculateAlkalinityRequirement({
      tanOxidizedKilograms: input.tanOxidizedKilograms as number,
      alkalinityKgCaco3PerKgN: input.alkalinityKgCaco3PerKgN as number,
    }),
});
export const runAlkalinityRequirement = tool.execute;
export default tool;
