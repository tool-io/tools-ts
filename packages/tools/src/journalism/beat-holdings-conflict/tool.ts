import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coveredOrganizations: readonly string[];
  readonly heldSecurities: readonly string[];
}>;
export type Output = Readonly<{
  readonly conflictingHoldings: readonly string[];
  readonly conflictCount: number;
  readonly conflictFound: boolean;
}>;

export const calculate = (input: Input): Output => {
  const beat = new Set(
    input.coveredOrganizations
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  const conflictingHoldings = [
    ...new Set(
      input.heldSecurities
        .map((value) => value.trim().toLowerCase())
        .filter((value) => beat.has(value)),
    ),
  ];
  return {
    conflictingHoldings,
    conflictCount: conflictingHoldings.length,
    conflictFound: conflictingHoldings.length > 0,
  };
};

export const exampleInput = {
  coveredOrganizations: ["Acme", "Beta"],
  heldSecurities: ["Gamma", "ACME"],
} satisfies Input;
export const exampleOutput = {
  conflictingHoldings: ["acme"],
  conflictCount: 1,
  conflictFound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coveredOrganizations: input.coveredOrganizations as readonly string[],
      heldSecurities: input.heldSecurities as readonly string[],
    }),
  description:
    "Find securities holdings that overlap organizations on a reporting beat.",
  id: "journalism/beat-holdings-conflict",
  inputs: [
    {
      id: "coveredOrganizations",
      label: "Organizations on the beat",
      kind: "stringList",
    },
    {
      id: "heldSecurities",
      label: "Organizations represented in holdings",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "conflictingHoldings",
      label: "Holdings overlapping the beat",
      kind: "stringList",
    },
    {
      id: "conflictCount",
      label: "Conflict count",
      kind: "integer",
      minimum: 0,
    },
    { id: "conflictFound", label: "Conflict found", kind: "boolean" },
  ],
  title: "Beat Holdings Conflict",
});

export const run = tool.execute;
export default tool;
