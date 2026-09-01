import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  bounded,
  safeText,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly usableSeatCount: number;
  readonly issuedCompSeatIds: readonly string[];
  readonly heldCompSeatIds: readonly string[];
  readonly callerCompSeatCapFraction: number;
}>;
export type Output = Readonly<{
  readonly distinctCommittedCompSeatCount: number;
  readonly maximumWholeCompSeatsUnderCallerCap: number;
  readonly compSeatsAboveCallerCap: number;
}>;
const inputFields = [
  { id: "usableSeatCount", label: "Usable seat count", kind: "number" },
  {
    id: "issuedCompSeatIds",
    label: "Issued comp seat ids",
    kind: "stringList",
  },
  { id: "heldCompSeatIds", label: "Held comp seat ids", kind: "stringList" },
  {
    id: "callerCompSeatCapFraction",
    label: "Caller comp seat cap fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.usableSeatCount, "seats", 1, 1000000);
  fraction(input.callerCompSeatCapFraction, "cap");
  [...input.issuedCompSeatIds, ...input.heldCompSeatIds].forEach((v) =>
    safeText(v, "seat"),
  );
  const count = new Set([...input.issuedCompSeatIds, ...input.heldCompSeatIds])
    .size;
  if (count > input.usableSeatCount)
    simpleError("seats", "Distinct comp commitments exceed venue inventory.");
  const cap = Math.floor(
    input.usableSeatCount * input.callerCompSeatCapFraction,
  );
  return {
    distinctCommittedCompSeatCount: count,
    maximumWholeCompSeatsUnderCallerCap: cap,
    compSeatsAboveCallerCap: Math.max(0, count - cap),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableSeatCount: 100,
  issuedCompSeatIds: ["A", "B"],
  heldCompSeatIds: ["B", "C"],
  callerCompSeatCapFraction: 0.02,
} satisfies Input;
export const exampleOutput = {
  distinctCommittedCompSeatCount: 3,
  maximumWholeCompSeatsUnderCallerCap: 2,
  compSeatsAboveCallerCap: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/house-comp-seats-percent-cap-checker",
  title: "House Comp Seats Percent Cap Checker",
  description:
    "Audit actual issued/held comp seat commitments with deduplicated seat IDs and caller whole-seat cap; not scalar occupancy ratio or automatic policy/rights to free seats.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctCommittedCompSeatCount",
      label: "Distinct committed comp seat count",
      kind: "number",
    },
    {
      id: "maximumWholeCompSeatsUnderCallerCap",
      label: "Maximum whole comp seats under caller cap",
      kind: "number",
    },
    {
      id: "compSeatsAboveCallerCap",
      label: "Comp seats above caller cap",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      usableSeatCount: value.usableSeatCount as number,
      issuedCompSeatIds: value.issuedCompSeatIds as readonly string[],
      heldCompSeatIds: value.heldCompSeatIds as readonly string[],
      callerCompSeatCapFraction: value.callerCompSeatCapFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
