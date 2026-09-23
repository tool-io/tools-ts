import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: string; readonly laneWidth: number };
export type Output = {
  readonly nonzeroLanes: number;
  readonly exactlyOne: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    laneWidth: { type: "integer", minimum: 1, maximum: 8192 },
  },
  required: ["word", "laneWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonzeroLanes: { type: "integer" },
    exactlyOne: { type: "boolean" },
  },
  required: ["nonzeroLanes", "exactlyOne"],
} as const;
/** Count nonzero fixed-width lanes, with the first lane at the supplied most-significant end. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { word, laneWidth } = request;
  const compute = (): Output => {
    H.domain(/^[01]+(?![\s\S])/.test(word));
    H.integer(laneWidth, 1, 8192);
    H.domain(word.length % laneWidth === 0);
    let nonzeroLanes = 0;
    for (let i = 0; i < word.length; i += laneWidth)
      if (word.slice(i, i + laneWidth).includes("1")) nonzeroLanes++;
    return { nonzeroLanes, exactlyOne: nonzeroLanes === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { word: "00001100", laneWidth: 4 },
  output: { nonzeroLanes: 1, exactlyOne: true },
} satisfies ToolExample<Input, Output>;
export const bitmaskExactOneLaneFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitmask-exact-one-lane-flag",
    title: "Bitmask Exact One Lane Flag Tool",
    description:
      "Count nonzero fixed-width lanes, with the first lane at the supplied most-significant end.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "string", maxLength: 8192 },
        laneWidth: { type: "integer", minimum: 1, maximum: 8192 },
      },
      required: ["word", "laneWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonzeroLanes: { type: "integer" },
        exactlyOne: { type: "boolean" },
      },
      required: ["nonzeroLanes", "exactlyOne"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "laneWidth",
          label: "Lane Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nonzeroLanes",
          label: "Nonzero Lanes",
          valueType: { type: "integer" },
        },
        {
          id: "exactlyOne",
          label: "Exactly One",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bitmaskExactOneLaneFlagTool.execute;
export default bitmaskExactOneLaneFlagTool;
