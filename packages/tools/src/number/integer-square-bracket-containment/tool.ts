import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integer: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    lower: { type: "number" },
    upper: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["integer", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Calculate integer square bracket containment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, lower, upper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      inside:
        (includeLower ? integer >= lower : integer > lower) &&
        (includeUpper ? integer <= upper : integer < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    integer: 3,
    lower: 2,
    upper: 3,
    includeLower: true,
    includeUpper: false,
  },
  output: { inside: false },
} satisfies ToolExample<Input, Output>;
export const integerSquareBracketContainmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-square-bracket-containment",
    title: "Integer Square Bracket Containment Tool",
    description:
      "Calculate integer square bracket containment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer" },
        lower: { type: "number" },
        upper: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: ["integer", "lower", "upper", "includeLower", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inside: { type: "boolean" } },
      required: ["inside"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = integerSquareBracketContainmentTool.execute;
export default integerSquareBracketContainmentTool;
