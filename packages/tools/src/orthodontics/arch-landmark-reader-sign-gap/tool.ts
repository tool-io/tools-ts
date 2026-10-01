import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoordinate: number;
  readonly secondCoordinate: number;
  readonly firstReversed: boolean;
  readonly secondReversed: boolean;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoordinate: { type: "number" },
    secondCoordinate: { type: "number" },
    firstReversed: { type: "boolean" },
    secondReversed: { type: "boolean" },
  },
  required: [
    "firstCoordinate",
    "secondCoordinate",
    "firstReversed",
    "secondReversed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Compare supplied reader coordinates after explicit sign normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoordinate, secondCoordinate, firstReversed, secondReversed } =
    request;
  const compute = (): Output => {
    return {
      signedGap:
        secondCoordinate * (secondReversed ? -1 : 1) -
        firstCoordinate * (firstReversed ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCoordinate: 3,
    secondCoordinate: -4,
    firstReversed: false,
    secondReversed: true,
  },
  output: { signedGap: 1 },
} satisfies ToolExample<Input, Output>;
export const archLandmarkReaderSignGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/arch-landmark-reader-sign-gap",
    title: "Arch Landmark Reader Sign Gap Tool",
    description:
      "Compare supplied reader coordinates after explicit sign normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoordinate: { type: "number" },
        secondCoordinate: { type: "number" },
        firstReversed: { type: "boolean" },
        secondReversed: { type: "boolean" },
      },
      required: [
        "firstCoordinate",
        "secondCoordinate",
        "firstReversed",
        "secondReversed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCoordinate",
          label: "Second Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReversed",
          label: "First Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondReversed",
          label: "Second Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = archLandmarkReaderSignGapTool.execute;
export default archLandmarkReaderSignGapTool;
