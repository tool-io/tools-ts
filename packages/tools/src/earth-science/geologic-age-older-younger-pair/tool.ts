import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAgeBeforePresent: number;
  readonly secondAgeBeforePresent: number;
};
export type Output = {
  readonly firstOlder: boolean;
  readonly equalAge: boolean;
  readonly firstMinusSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAgeBeforePresent: { type: "number", minimum: 0 },
    secondAgeBeforePresent: { type: "number", minimum: 0 },
  },
  required: ["firstAgeBeforePresent", "secondAgeBeforePresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOlder: { type: "boolean" },
    equalAge: { type: "boolean" },
    firstMinusSecond: { type: "number" },
  },
  required: ["firstOlder", "equalAge", "firstMinusSecond"],
} as const;
/** Compare explicit compatible ages measured before a common present without assigning geologic periods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAgeBeforePresent, secondAgeBeforePresent } = request;
  const compute = (): Output => {
    H.domain(
      firstAgeBeforePresent >= 0 && secondAgeBeforePresent >= 0,
      "firstAgeBeforePresent",
    );
    return {
      firstOlder: firstAgeBeforePresent > secondAgeBeforePresent,
      equalAge: firstAgeBeforePresent === secondAgeBeforePresent,
      firstMinusSecond: firstAgeBeforePresent - secondAgeBeforePresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAgeBeforePresent: 120, secondAgeBeforePresent: 80 },
  output: { firstOlder: true, equalAge: false, firstMinusSecond: 40 },
} satisfies ToolExample<Input, Output>;
export const geologicAgeOlderyoungerPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/geologic-age-older-younger-pair",
    title: "Geologic Age Older Younger Pair",
    description:
      "Compare explicit compatible ages measured before a common present without assigning geologic periods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAgeBeforePresent: { type: "number", minimum: 0 },
        secondAgeBeforePresent: { type: "number", minimum: 0 },
      },
      required: ["firstAgeBeforePresent", "secondAgeBeforePresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOlder: { type: "boolean" },
        equalAge: { type: "boolean" },
        firstMinusSecond: { type: "number" },
      },
      required: ["firstOlder", "equalAge", "firstMinusSecond"],
    },
    ports: {
      inputs: [
        {
          id: "firstAgeBeforePresent",
          label: "First Age Before Present",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAgeBeforePresent",
          label: "Second Age Before Present",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstOlder",
          label: "First Older",
          valueType: { type: "boolean" },
        },
        { id: "equalAge", label: "Equal Age", valueType: { type: "boolean" } },
        {
          id: "firstMinusSecond",
          label: "First Minus Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geologicAgeOlderyoungerPairTool.execute;
export default geologicAgeOlderyoungerPairTool;
