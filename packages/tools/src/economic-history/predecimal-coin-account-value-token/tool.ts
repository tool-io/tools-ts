import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly major: number;
  readonly middle: number;
  readonly minor: number;
  readonly middlePerMajor: number;
  readonly minorPerMiddle: number;
};
export type Output = {
  readonly minorTotal: number;
  readonly majorEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    major: { type: "integer", minimum: 0 },
    middle: { type: "integer", minimum: 0 },
    minor: { type: "integer", minimum: 0 },
    middlePerMajor: { type: "integer", minimum: 1 },
    minorPerMiddle: { type: "integer", minimum: 1 },
  },
  required: ["major", "middle", "minor", "middlePerMajor", "minorPerMiddle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minorTotal: { type: "integer" },
    majorEquivalent: { type: "number" },
  },
  required: ["minorTotal", "majorEquivalent"],
} as const;
/** Aggregate an explicit three-level currency denomination system; radices are supplied from the historical source. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { major, middle, minor, middlePerMajor, minorPerMiddle } = request;
  const compute = (): Output => {
    H.integer(major, 0);
    H.integer(middle, 0);
    H.integer(minor, 0);
    H.integer(middlePerMajor, 1);
    H.integer(minorPerMiddle, 1);
    return {
      minorTotal: (major * middlePerMajor + middle) * minorPerMiddle + minor,
      majorEquivalent:
        major +
        middle / middlePerMajor +
        minor / (middlePerMajor * minorPerMiddle),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    major: 2,
    middle: 3,
    minor: 6,
    middlePerMajor: 20,
    minorPerMiddle: 12,
  },
  output: { minorTotal: 522, majorEquivalent: 2.175 },
} satisfies ToolExample<Input, Output>;
export const predecimalCoinAccountValueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/predecimal-coin-account-value-token",
    title: "Predecimal Coin Account Value Token Tool",
    description:
      "Aggregate an explicit three-level currency denomination system; radices are supplied from the historical source.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        major: { type: "integer", minimum: 0 },
        middle: { type: "integer", minimum: 0 },
        minor: { type: "integer", minimum: 0 },
        middlePerMajor: { type: "integer", minimum: 1 },
        minorPerMiddle: { type: "integer", minimum: 1 },
      },
      required: [
        "major",
        "middle",
        "minor",
        "middlePerMajor",
        "minorPerMiddle",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minorTotal: { type: "integer" },
        majorEquivalent: { type: "number" },
      },
      required: ["minorTotal", "majorEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "major",
          label: "Major",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "middle",
          label: "Middle",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minor",
          label: "Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "middlePerMajor",
          label: "Middle Per Major",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minorPerMiddle",
          label: "Minor Per Middle",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minorTotal",
          label: "Minor Total",
          valueType: { type: "integer" },
        },
        {
          id: "majorEquivalent",
          label: "Major Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = predecimalCoinAccountValueTokenTool.execute;
export default predecimalCoinAccountValueTokenTool;
