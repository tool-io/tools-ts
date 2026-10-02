import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSeats: number;
  readonly secondSeats: number;
  readonly switchFirstToSecond: number;
  readonly switchSecondToFirst: number;
};
export type Output = {
  readonly nextFirst: number;
  readonly nextSecond: number;
  readonly netFirst: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSeats: { type: "integer", minimum: 0 },
    secondSeats: { type: "integer", minimum: 0 },
    switchFirstToSecond: { type: "integer", minimum: 0 },
    switchSecondToFirst: { type: "integer", minimum: 0 },
  },
  required: [
    "firstSeats",
    "secondSeats",
    "switchFirstToSecond",
    "switchSecondToFirst",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextFirst: { type: "integer" },
    nextSecond: { type: "integer" },
    netFirst: { type: "integer" },
  },
  required: ["nextFirst", "nextSecond", "netFirst"],
} as const;
/** Calculate party switch seat balance update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSeats, secondSeats, switchFirstToSecond, switchSecondToFirst } =
    request;
  const compute = (): Output => {
    H.integer(firstSeats, 0);
    H.integer(secondSeats, 0);
    H.integer(switchFirstToSecond, 0, firstSeats);
    H.integer(switchSecondToFirst, 0, secondSeats);
    return {
      nextFirst: firstSeats - switchFirstToSecond + switchSecondToFirst,
      nextSecond: secondSeats + switchFirstToSecond - switchSecondToFirst,
      netFirst: switchSecondToFirst - switchFirstToSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSeats: 50,
    secondSeats: 40,
    switchFirstToSecond: 3,
    switchSecondToFirst: 1,
  },
  output: { nextFirst: 48, nextSecond: 42, netFirst: -2 },
} satisfies ToolExample<Input, Output>;
export const partySwitchSeatBalanceUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/party-switch-seat-balance-update",
    title: "Party Switch Seat Balance Update Tool",
    description:
      "Calculate party switch seat balance update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSeats: { type: "integer", minimum: 0 },
        secondSeats: { type: "integer", minimum: 0 },
        switchFirstToSecond: { type: "integer", minimum: 0 },
        switchSecondToFirst: { type: "integer", minimum: 0 },
      },
      required: [
        "firstSeats",
        "secondSeats",
        "switchFirstToSecond",
        "switchSecondToFirst",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextFirst: { type: "integer" },
        nextSecond: { type: "integer" },
        netFirst: { type: "integer" },
      },
      required: ["nextFirst", "nextSecond", "netFirst"],
    },
    ports: {
      inputs: [
        {
          id: "firstSeats",
          label: "First Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSeats",
          label: "Second Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "switchFirstToSecond",
          label: "Switch First To Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "switchSecondToFirst",
          label: "Switch Second To First",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextFirst",
          label: "Next First",
          valueType: { type: "integer" },
        },
        {
          id: "nextSecond",
          label: "Next Second",
          valueType: { type: "integer" },
        },
        { id: "netFirst", label: "Net First", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = partySwitchSeatBalanceUpdateTool.execute;
export default partySwitchSeatBalanceUpdateTool;
