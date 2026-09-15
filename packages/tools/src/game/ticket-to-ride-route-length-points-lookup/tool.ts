import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly routeLength: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "routeLength", label: "Route length", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.routeLength,
      { "1": 1, "2": 2, "3": 4, "4": 7, "5": 10, "6": 15 },
      "routeLength",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { routeLength: "4" },
  output: { result: { reference: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/ticket-to-ride-route-length-points-lookup",
  title: "Ticket to Ride Route Length Points",
  description:
    "Base Ticket to Ride route-length score schedule for lengths 1–6; expansions/variant bonuses excluded.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
