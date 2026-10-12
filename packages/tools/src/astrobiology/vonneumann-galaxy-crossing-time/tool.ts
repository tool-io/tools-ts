import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly galaxyDistanceLightyears: number;
  readonly shipFractionOfC: number;
  readonly stops: number;
  readonly replicationYearsPerStop: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "galaxyDistanceLightyears",
    label: "Galaxy distance lightyears",
    kind: "number",
  },
  { id: "shipFractionOfC", label: "Ship fraction of c", kind: "number" },
  { id: "stops", label: "Stops", kind: "number" },
  {
    id: "replicationYearsPerStop",
    label: "Replication years per stop",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.galaxyDistanceLightyears, "distance");
  positive(i.shipFractionOfC, "speed");
  fraction(i.shipFractionOfC, "speed");
  bounded(i.stops, "stops", 0, 1000000);
  nonnegative(i.replicationYearsPerStop, "delay");
  return {
    serialCrossingMillionYears:
      (i.galaxyDistanceLightyears / i.shipFractionOfC +
        i.stops * i.replicationYearsPerStop) /
      1e6,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    galaxyDistanceLightyears: 100000,
    shipFractionOfC: 0.1,
    stops: 100,
    replicationYearsPerStop: 1000,
  },
  output: { result: { serialCrossingMillionYears: 1.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/vonneumann-galaxy-crossing-time",
  title: "Von Neumann Probe Galaxy Crossing Time Million-Years Calculator",
  description:
    "Serial-route galaxy crossing travel plus independently assumed per-stop replication delays, million years; no branching probe wave simulation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { serialCrossingMillionYears: { type: "number" } },
        required: ["serialCrossingMillionYears"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
