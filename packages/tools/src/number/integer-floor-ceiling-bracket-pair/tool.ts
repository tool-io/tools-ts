import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number };
export type Output = {
  readonly floorInteger: number;
  readonly ceilingInteger: number;
  readonly isInteger: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorInteger: { type: "integer" },
    ceilingInteger: { type: "integer" },
    isInteger: { type: "boolean" },
  },
  required: ["floorInteger", "ceilingInteger", "isInteger"],
} as const;
/** Return explicit real-value floor and ceiling brackets, rejecting outputs outside safe integer range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value } = request;
  const compute = (): Output => {
    return {
      floorInteger: Math.floor(value),
      ceilingInteger: Math.ceil(value),
      isInteger: Number.isInteger(value),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: -2.25 },
  output: { floorInteger: -3, ceilingInteger: -2, isInteger: false },
} satisfies ToolExample<Input, Output>;
export const integerFloorCeilingBracketPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["number", "mathematics"],
      keywords: ["number", "mathematics"],
    },
    id: "number/integer-floor-ceiling-bracket-pair",
    title: "Integer Floor Ceiling Bracket Pair",
    description:
      "Return explicit real-value floor and ceiling brackets, rejecting outputs outside safe integer range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorInteger: { type: "integer" },
        ceilingInteger: { type: "integer" },
        isInteger: { type: "boolean" },
      },
      required: ["floorInteger", "ceilingInteger", "isInteger"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "floorInteger",
          label: "Floor Integer",
          valueType: { type: "integer" },
        },
        {
          id: "ceilingInteger",
          label: "Ceiling Integer",
          valueType: { type: "integer" },
        },
        {
          id: "isInteger",
          label: "Is Integer",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerFloorCeilingBracketPairTool.execute;
export default integerFloorCeilingBracketPairTool;
