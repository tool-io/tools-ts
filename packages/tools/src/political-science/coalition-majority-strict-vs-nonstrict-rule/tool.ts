import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coalitionSeats: number;
  readonly totalSeats: number;
  readonly strictMajority: boolean;
};
export type Output = {
  readonly meetsRule: boolean;
  readonly halfSeatMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coalitionSeats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
    strictMajority: { type: "boolean" },
  },
  required: ["coalitionSeats", "totalSeats", "strictMajority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meetsRule: { type: "boolean" },
    halfSeatMargin: { type: "number" },
  },
  required: ["meetsRule", "halfSeatMargin"],
} as const;
/** Compare explicit coalition and total seat counts under a supplied strict or nonstrict half-seat rule without selecting parliamentary law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coalitionSeats, totalSeats, strictMajority } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalSeats) &&
        totalSeats >= 1 &&
        totalSeats <= Number.MAX_SAFE_INTEGER,
      "totalSeats",
    ),
      totalSeats);
    (H.domain(
      Number.isSafeInteger(coalitionSeats) &&
        coalitionSeats >= 0 &&
        coalitionSeats <= totalSeats,
      "coalitionSeats",
    ),
      coalitionSeats);
    return {
      meetsRule: strictMajority
        ? BigInt(coalitionSeats) * 2n > BigInt(totalSeats)
        : BigInt(coalitionSeats) * 2n >= BigInt(totalSeats),
      halfSeatMargin: coalitionSeats - totalSeats / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coalitionSeats: 51, totalSeats: 100, strictMajority: true },
  output: { meetsRule: true, halfSeatMargin: 1 },
} satisfies ToolExample<Input, Output>;
export const coalitionMajorityStrictVsNonstrictRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["political-science", "political science", "social sciences"],
        keywords: ["political science", "social sciences"],
      },
      id: "political-science/coalition-majority-strict-vs-nonstrict-rule",
      title: "Coalition Majority Strict Vs Nonstrict Rule",
      description:
        "Compare explicit coalition and total seat counts under a supplied strict or nonstrict half-seat rule without selecting parliamentary law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coalitionSeats: { type: "integer", minimum: 0 },
          totalSeats: { type: "integer", minimum: 1 },
          strictMajority: { type: "boolean" },
        },
        required: ["coalitionSeats", "totalSeats", "strictMajority"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          meetsRule: { type: "boolean" },
          halfSeatMargin: { type: "number" },
        },
        required: ["meetsRule", "halfSeatMargin"],
      },
      ports: {
        inputs: [
          {
            id: "coalitionSeats",
            label: "Coalition Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalSeats",
            label: "Total Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "strictMajority",
            label: "Strict Majority",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "meetsRule",
            label: "Meets Rule",
            valueType: { type: "boolean" },
          },
          {
            id: "halfSeatMargin",
            label: "Half Seat Margin",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coalitionMajorityStrictVsNonstrictRuleTool.execute;
export default coalitionMajorityStrictVsNonstrictRuleTool;
