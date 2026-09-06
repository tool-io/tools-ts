import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  signedSum,
  rateMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly hammerMinor: number;
  readonly commissionBasisPoints: number;
  readonly fixedFeesMinor: number;
}>;
export type Output = Readonly<{
  readonly commissionMinor: number;
  readonly netProceedsMinor: number;
}>;
const inputFields = [
  { id: "hammerMinor", label: "Hammer minor", kind: "number" },
  {
    id: "commissionBasisPoints",
    label: "Commission basis points",
    kind: "number",
  },
  { id: "fixedFeesMinor", label: "Fixed fees minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.hammerMinor, "hammer");
  money(input.fixedFeesMinor, "fees");
  bounded(input.commissionBasisPoints, "rate", 0, 10000);
  const commission = rateMinor(input.hammerMinor, input.commissionBasisPoints);
  return {
    commissionMinor: commission,
    netProceedsMinor: signedSum([
      input.hammerMinor,
      -commission,
      -input.fixedFeesMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hammerMinor: 10000,
  commissionBasisPoints: 1500,
  fixedFeesMinor: 200,
} satisfies Input;
export const exampleOutput = {
  commissionMinor: 1500,
  netProceedsMinor: 8300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/seller-net-proceeds-calculator",
  title: "Auction Seller Commission Net Proceeds Calculator",
  description:
    "Subtract exact rounded seller commission and explicit fixed fees from hammer; negative proceeds retained, no buyer premium assumption. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "commissionMinor", label: "Commission minor", kind: "number" },
    { id: "netProceedsMinor", label: "Net proceeds minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      hammerMinor: value.hammerMinor as number,
      commissionBasisPoints: value.commissionBasisPoints as number,
      fixedFeesMinor: value.fixedFeesMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
