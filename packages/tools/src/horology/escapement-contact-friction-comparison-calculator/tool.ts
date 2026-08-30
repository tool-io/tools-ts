import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EscapementFrictionComparisonInput = {
  readonly lubricatedContactFrictionMillinewtons: number;
  readonly referenceUnlubricatedFrictionMillinewtons: number;
  readonly siliconContactFrictionMillinewtons: number;
};

export type EscapementFrictionComparisonOutput = {
  readonly frictionReductionPercent: number;
  readonly reductionVersusLubricatedMillinewtons: number;
  readonly relativeToUnlubricatedFriction: number;
};

export const compareEscapementContactFriction = (
  input: EscapementFrictionComparisonInput,
): EscapementFrictionComparisonOutput => {
  for (const [field, value] of [
    [
      "lubricatedContactFrictionMillinewtons",
      input.lubricatedContactFrictionMillinewtons,
    ],
    [
      "referenceUnlubricatedFrictionMillinewtons",
      input.referenceUnlubricatedFrictionMillinewtons,
    ],
    [
      "siliconContactFrictionMillinewtons",
      input.siliconContactFrictionMillinewtons,
    ],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Friction measurements must be finite and nonnegative.",
        "friction_measurement_invalid",
      );
  if (
    input.referenceUnlubricatedFrictionMillinewtons <=
    input.lubricatedContactFrictionMillinewtons
  )
    simpleError(
      "referenceUnlubricatedFrictionMillinewtons",
      "Reference unlubricated friction must exceed the lubricated baseline.",
      "friction_baseline_invalid",
    );
  return {
    frictionReductionPercent:
      (100 *
        (input.referenceUnlubricatedFrictionMillinewtons -
          input.siliconContactFrictionMillinewtons)) /
      input.referenceUnlubricatedFrictionMillinewtons,
    reductionVersusLubricatedMillinewtons:
      input.lubricatedContactFrictionMillinewtons -
      input.siliconContactFrictionMillinewtons,
    relativeToUnlubricatedFriction:
      input.siliconContactFrictionMillinewtons /
      input.referenceUnlubricatedFrictionMillinewtons,
  };
};

export const escapementFrictionComparisonExample = {
  input: {
    lubricatedContactFrictionMillinewtons: 0.2,
    referenceUnlubricatedFrictionMillinewtons: 1,
    siliconContactFrictionMillinewtons: 0.05,
  },
  output: {
    frictionReductionPercent: 95,
    reductionVersusLubricatedMillinewtons: 0.15000000000000002,
    relativeToUnlubricatedFriction: 0.05,
  },
} satisfies ToolExample<
  EscapementFrictionComparisonInput,
  EscapementFrictionComparisonOutput
>;

export const escapementFrictionComparisonTool = createSimpleTool({
  calculate: (input) =>
    compareEscapementContactFriction({
      lubricatedContactFrictionMillinewtons:
        input.lubricatedContactFrictionMillinewtons as number,
      referenceUnlubricatedFrictionMillinewtons:
        input.referenceUnlubricatedFrictionMillinewtons as number,
      siliconContactFrictionMillinewtons:
        input.siliconContactFrictionMillinewtons as number,
    }),
  description:
    "Compare caller-measured lubricated, unlubricated, and silicon-contact friction; lubricant-free operation does not mean zero friction or universal superiority.",
  id: "horology/escapement-contact-friction-comparison-calculator",
  inputs: [
    {
      id: "lubricatedContactFrictionMillinewtons",
      kind: "number",
      label: "Lubricated reference contact friction",
      minimum: 0,
      unit: "mN",
    },
    {
      id: "referenceUnlubricatedFrictionMillinewtons",
      kind: "number",
      label: "Reference unlubricated contact friction",
      minimum: 0,
      unit: "mN",
    },
    {
      id: "siliconContactFrictionMillinewtons",
      kind: "number",
      label: "Silicon contact friction measurement",
      minimum: 0,
      unit: "mN",
    },
  ],
  outputs: [
    {
      id: "frictionReductionPercent",
      kind: "number",
      label: "Reduction versus unlubricated reference",
      unit: "%",
    },
    {
      id: "reductionVersusLubricatedMillinewtons",
      kind: "number",
      label: "Reduction versus lubricated baseline",
      unit: "mN",
    },
    {
      id: "relativeToUnlubricatedFriction",
      kind: "number",
      label: "Silicon friction relative to unlubricated reference",
      minimum: 0,
    },
  ],
  title: "Escapement Contact Friction Comparison Calculator",
});

export const runEscapementFrictionComparison =
  escapementFrictionComparisonTool.execute;
export default escapementFrictionComparisonTool;
