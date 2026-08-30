import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingEncumbranceMinor: number;
  readonly newCommitmentsMinor: readonly number[];
  readonly liquidatedCommitmentsMinor: readonly number[];
  readonly cancelledCommitmentsMinor: readonly number[];
  readonly reportedOutstandingCommitmentsMinor: number;
}>;
export type Output = Readonly<{
  readonly modeledOutstandingEncumbranceMinor: number;
  readonly signedReportedMinusModeledCommitmentsMinor: number;
}>;
const inputFields = [
  {
    id: "openingEncumbranceMinor",
    label: "Opening encumbrance minor",
    kind: "number",
  },
  {
    id: "newCommitmentsMinor",
    label: "New commitments minor",
    kind: "numberList",
  },
  {
    id: "liquidatedCommitmentsMinor",
    label: "Liquidated commitments minor",
    kind: "numberList",
  },
  {
    id: "cancelledCommitmentsMinor",
    label: "Cancelled commitments minor",
    kind: "numberList",
  },
  {
    id: "reportedOutstandingCommitmentsMinor",
    label: "Reported outstanding commitments minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.openingEncumbranceMinor, "openingEncumbranceMinor");
  input.newCommitmentsMinor.forEach((v) => money(v, "newCommitmentsMinor"));
  input.liquidatedCommitmentsMinor.forEach((v) =>
    money(v, "liquidatedCommitmentsMinor"),
  );
  input.cancelledCommitmentsMinor.forEach((v) =>
    money(v, "cancelledCommitmentsMinor"),
  );
  money(
    input.reportedOutstandingCommitmentsMinor,
    "reportedOutstandingCommitmentsMinor",
  );
  const outstanding = signedSum([
    input.openingEncumbranceMinor,
    sumMoney(input.newCommitmentsMinor),
    -sumMoney(input.liquidatedCommitmentsMinor),
    -sumMoney(input.cancelledCommitmentsMinor),
  ]);
  if (outstanding < 0)
    simpleError(
      "commitments",
      "Liquidations/cancellations exceed supported commitments.",
    );
  return {
    modeledOutstandingEncumbranceMinor: outstanding,
    signedReportedMinusModeledCommitmentsMinor: integer(
      input.reportedOutstandingCommitmentsMinor - outstanding,
      "difference",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingEncumbranceMinor: 100,
  newCommitmentsMinor: [50, 20],
  liquidatedCommitmentsMinor: [80],
  cancelledCommitmentsMinor: [10],
  reportedOutstandingCommitmentsMinor: 70,
} satisfies Input;
export const exampleOutput = {
  modeledOutstandingEncumbranceMinor: 80,
  signedReportedMinusModeledCommitmentsMinor: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/encumbrance-outstanding-commitment-entry-checker",
  title: "Encumbrance Outstanding Commitment Entry Checker",
  description:
    "Audit outstanding budget commitments from actual additions/liquidations/cancellations and reported encumbrance, without treating commitments as expense or cash disbursement.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledOutstandingEncumbranceMinor",
      label: "Modeled outstanding encumbrance minor",
      kind: "number",
    },
    {
      id: "signedReportedMinusModeledCommitmentsMinor",
      label: "Signed reported minus modeled commitments minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      openingEncumbranceMinor: value.openingEncumbranceMinor as number,
      newCommitmentsMinor: value.newCommitmentsMinor as readonly number[],
      liquidatedCommitmentsMinor:
        value.liquidatedCommitmentsMinor as readonly number[],
      cancelledCommitmentsMinor:
        value.cancelledCommitmentsMinor as readonly number[],
      reportedOutstandingCommitmentsMinor:
        value.reportedOutstandingCommitmentsMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
