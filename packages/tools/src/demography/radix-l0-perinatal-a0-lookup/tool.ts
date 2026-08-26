import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadixL0PerinatalA0LookupInput = {
  readonly radix?: "standard" | "unit";
  readonly a0Rule?: "midpoint" | "coaleDemenyInfant";
  readonly n?: number;
  readonly m0?: number;
};

export type RadixL0PerinatalA0LookupOutput = {
  readonly radixL0: number;
  readonly a0Years: number;
};

export const calculateRadixL0PerinatalA0Lookup = (
  input: RadixL0PerinatalA0LookupInput,
): RadixL0PerinatalA0LookupOutput => {
  const n = input.n ?? 1;
  const m0 = input.m0 ?? 0.005;
  if (!(n > 0))
    simpleError(
      "n",
      "The first-interval width must be greater than zero.",
      "invalid_interval",
    );
  if (input.a0Rule === "coaleDemenyInfant" && !(m0 > 0))
    simpleError(
      "m0",
      "The Coale-Demeny infant rule needs a positive infant death rate.",
      "invalid_rate",
    );
  return {
    radixL0: input.radix === "unit" ? 1 : 100000,
    a0Years: input.a0Rule === "coaleDemenyInfant" ? 0.07 + 1.7 * m0 : n / 2,
  };
};

export const radixL0PerinatalA0LookupExample = {
  input: { radix: "standard", a0Rule: "midpoint", n: 1, m0: 0.005 },
  output: { radixL0: 100000, a0Years: 0.5 },
} satisfies ToolExample<
  RadixL0PerinatalA0LookupInput,
  RadixL0PerinatalA0LookupOutput
>;

export const radixL0PerinatalA0LookupTool = createSimpleTool({
  id: "demography/radix-l0-perinatal-a0-lookup",
  title: "Radix L0 Perinatal A0 Lookup",
  description:
    "Look up the conventional life-table radix l0 (100000 for the HMD/UN standard or 1 for a unit radix) and the first-interval separation factor a0 under the midpoint rule (n/2) or the Coale-Demeny infant rule (0.07 + 1.7 m0).",
  inputs: [
    {
      default: "standard",
      description:
        "Radix convention: standard 100000 survivors at birth, or a unit radix of 1.",
      enum: ["standard", "unit"],
      id: "radix",
      kind: "string",
      label: "Radix",
    },
    {
      default: "midpoint",
      description: "Separation factor convention for the first interval.",
      enum: ["midpoint", "coaleDemenyInfant"],
      id: "a0Rule",
      kind: "string",
      label: "a0 rule",
    },
    {
      default: 1,
      description: "Width of the first age interval in years.",
      id: "n",
      kind: "number",
      label: "Width n",
      minimum: 0,
    },
    {
      default: 0.005,
      description: "Infant death rate m0 used only by the Coale-Demeny rule.",
      id: "m0",
      kind: "number",
      label: "m0",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Conventional life-table radix l0.",
      id: "radixL0",
      kind: "number",
      label: "l0",
    },
    {
      description:
        "Average years lived by those dying in the first interval, in years.",
      id: "a0Years",
      kind: "number",
      label: "a0",
    },
  ],
  calculate: (input) =>
    calculateRadixL0PerinatalA0Lookup(
      input as unknown as RadixL0PerinatalA0LookupInput,
    ),
});

export const runRadixL0PerinatalA0Lookup = radixL0PerinatalA0LookupTool.execute;
export default radixL0PerinatalA0LookupTool;
