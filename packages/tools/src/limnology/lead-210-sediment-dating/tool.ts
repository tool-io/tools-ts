import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly totalUnsupportedInventory: number;
  readonly unsupportedInventoryBelowDepth: number;
  readonly decayConstantPerYear: number;
  readonly totalInventoryVariance: number;
  readonly remainingInventoryVariance: number;
  readonly inventoryCovariance: number;
}>;
export type Output = Readonly<{
  readonly crsAgeYears: number;
  readonly approximateAgeStandardErrorYears: number;
}>;
const inputFields = [
  {
    id: "totalUnsupportedInventory",
    label: "Total unsupported inventory",
    kind: "number",
  },
  {
    id: "unsupportedInventoryBelowDepth",
    label: "Unsupported inventory below depth",
    kind: "number",
  },
  {
    id: "decayConstantPerYear",
    label: "Decay constant per year",
    kind: "number",
  },
  {
    id: "totalInventoryVariance",
    label: "Total inventory variance",
    kind: "number",
  },
  {
    id: "remainingInventoryVariance",
    label: "Remaining inventory variance",
    kind: "number",
  },
  { id: "inventoryCovariance", label: "Inventory covariance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalUnsupportedInventory, "totalUnsupportedInventory");
  positive(
    input.unsupportedInventoryBelowDepth,
    "unsupportedInventoryBelowDepth",
  );
  positive(input.decayConstantPerYear, "decayConstantPerYear");
  nonnegative(input.totalInventoryVariance, "totalInventoryVariance");
  nonnegative(input.remainingInventoryVariance, "remainingInventoryVariance");
  if (
    input.unsupportedInventoryBelowDepth > input.totalUnsupportedInventory ||
    input.inventoryCovariance ** 2 >
      input.totalInventoryVariance * input.remainingInventoryVariance
  )
    simpleError(
      "unsupportedInventoryBelowDepth",
      "Remaining inventory cannot exceed total; positive-semidefinite inventory covariance required.",
    );
  const a = input.totalUnsupportedInventory,
    b = input.unsupportedInventoryBelowDepth,
    v =
      input.totalInventoryVariance / a ** 2 +
      input.remainingInventoryVariance / b ** 2 -
      (2 * input.inventoryCovariance) / (a * b);
  return {
    crsAgeYears: Math.log(a / b) / input.decayConstantPerYear,
    approximateAgeStandardErrorYears:
      Math.sqrt(Math.max(0, v)) / input.decayConstantPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalUnsupportedInventory: 100,
  unsupportedInventoryBelowDepth: 25,
  decayConstantPerYear: 0.03465735902799726,
  totalInventoryVariance: 4,
  remainingInventoryVariance: 1,
  inventoryCovariance: 0,
} satisfies Input;
export const exampleOutput = {
  crsAgeYears: 40,
  approximateAgeStandardErrorYears: 1.2903856728918244,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/lead-210-sediment-dating",
  title: "Lead 210 Sediment Dating",
  description:
    "Evaluate unsupported Pb-210 constant-rate-of-supply inventory chronology and covariance-aware first-order age uncertainty; supply decay constant, supported-activity correction and complete inventory externally.",
  inputs: inputFields,
  outputs: [
    { id: "crsAgeYears", label: "Crs age years", kind: "number" },
    {
      id: "approximateAgeStandardErrorYears",
      label: "Approximate age standard error years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalUnsupportedInventory: value.totalUnsupportedInventory as number,
      unsupportedInventoryBelowDepth:
        value.unsupportedInventoryBelowDepth as number,
      decayConstantPerYear: value.decayConstantPerYear as number,
      totalInventoryVariance: value.totalInventoryVariance as number,
      remainingInventoryVariance: value.remainingInventoryVariance as number,
      inventoryCovariance: value.inventoryCovariance as number,
    }),
});
export const run = tool.execute;
export default tool;
