import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly founderSeats: number;
  readonly investorSeats: number;
  readonly independentSeats: number;
}>;
export type Output = Readonly<{
  readonly totalSeats: number;
  readonly majoritySeats: number;
  readonly control: string;
}>;
export const calculate = (input: Input): Output => {
  count(input.founderSeats, "founderSeats");
  count(input.investorSeats, "investorSeats");
  count(input.independentSeats, "independentSeats");
  const totalSeats =
    input.founderSeats + input.investorSeats + input.independentSeats;
  count(totalSeats, "totalSeats", 1);
  const majoritySeats = Math.floor(totalSeats / 2) + 1;
  return {
    totalSeats,
    majoritySeats,
    control:
      input.founderSeats >= majoritySeats
        ? "founders"
        : input.investorSeats >= majoritySeats
          ? "investors"
          : "neither",
  };
};
export const exampleInput = {
  founderSeats: 2,
  investorSeats: 2,
  independentSeats: 1,
} satisfies Input;
export const exampleOutput = {
  totalSeats: 5,
  majoritySeats: 3,
  control: "neither",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/board-voting-control",
  title: "Board Voting Control",
  description:
    "Determine simple board-vote majority assuming one vote per seat and no special rights.",
  inputs: [
    { id: "founderSeats", label: "Founder seats", kind: "integer" },
    { id: "investorSeats", label: "Investor seats", kind: "integer" },
    { id: "independentSeats", label: "Independent seats", kind: "integer" },
  ],
  outputs: [
    { id: "totalSeats", label: "Total seats", kind: "integer" },
    { id: "majoritySeats", label: "Majority seats", kind: "integer" },
    { id: "control", label: "Control", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      founderSeats: value.founderSeats as number,
      investorSeats: value.investorSeats as number,
      independentSeats: value.independentSeats as number,
    }),
});
export const run = tool.execute;
export default tool;
