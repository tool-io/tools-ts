import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly riverInflowM3PerSecond: number;
  readonly riverSalinity: number;
  readonly inflowingOceanSalinity: number;
  readonly outflowingEstuarySalinity: number;
}>;
export type Output = Readonly<{
  readonly oceanInflowM3PerSecond: number;
  readonly estuaryOutflowM3PerSecond: number;
  readonly saltBalanceResidualSalinityM3PerSecond: number;
}>;
const inputFields = [
  {
    id: "riverInflowM3PerSecond",
    label: "River inflow m3 per second",
    kind: "number",
  },
  { id: "riverSalinity", label: "River salinity", kind: "number" },
  {
    id: "inflowingOceanSalinity",
    label: "Inflowing ocean salinity",
    kind: "number",
  },
  {
    id: "outflowingEstuarySalinity",
    label: "Outflowing estuary salinity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.riverInflowM3PerSecond, "riverInflowM3PerSecond");
  nonnegative(input.riverSalinity, "riverSalinity");
  nonnegative(input.inflowingOceanSalinity, "inflowingOceanSalinity");
  nonnegative(input.outflowingEstuarySalinity, "outflowingEstuarySalinity");
  if (
    input.riverSalinity > input.outflowingEstuarySalinity ||
    input.outflowingEstuarySalinity >= input.inflowingOceanSalinity
  )
    simpleError(
      "salinities",
      "River ≤ estuary outflow < ocean inflow salinity required.",
    );
  const oceanInflowM3PerSecond =
      (input.riverInflowM3PerSecond *
        (input.outflowingEstuarySalinity - input.riverSalinity)) /
      (input.inflowingOceanSalinity - input.outflowingEstuarySalinity),
    estuaryOutflowM3PerSecond =
      input.riverInflowM3PerSecond + oceanInflowM3PerSecond;
  return {
    oceanInflowM3PerSecond,
    estuaryOutflowM3PerSecond,
    saltBalanceResidualSalinityM3PerSecond:
      input.riverInflowM3PerSecond * input.riverSalinity +
      oceanInflowM3PerSecond * input.inflowingOceanSalinity -
      estuaryOutflowM3PerSecond * input.outflowingEstuarySalinity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  riverInflowM3PerSecond: 10,
  riverSalinity: 1,
  inflowingOceanSalinity: 35,
  outflowingEstuarySalinity: 20,
} satisfies Input;
export const exampleOutput = {
  oceanInflowM3PerSecond: 12.666666666666666,
  estuaryOutflowM3PerSecond: 22.666666666666664,
  saltBalanceResidualSalinityM3PerSecond: 5.684341886080802e-14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/knudsen-relationship-flow-ratio",
  title: "Knudsen Relationship Flow Ratio",
  description:
    "Solve steady two-layer Knudsen volume/salt balances including nonzero river salinity, excluding evaporation/storage; salinities must share the same conservative concentration basis.",
  inputs: inputFields,
  outputs: [
    {
      id: "oceanInflowM3PerSecond",
      label: "Ocean inflow m3 per second",
      kind: "number",
    },
    {
      id: "estuaryOutflowM3PerSecond",
      label: "Estuary outflow m3 per second",
      kind: "number",
    },
    {
      id: "saltBalanceResidualSalinityM3PerSecond",
      label: "Salt balance residual salinity m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      riverInflowM3PerSecond: value.riverInflowM3PerSecond as number,
      riverSalinity: value.riverSalinity as number,
      inflowingOceanSalinity: value.inflowingOceanSalinity as number,
      outflowingEstuarySalinity: value.outflowingEstuarySalinity as number,
    }),
});
export const run = tool.execute;
export default tool;
