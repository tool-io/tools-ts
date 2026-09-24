import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCharacters: number;
  readonly secondCharacters: number;
  readonly separatorCharacters: number;
  readonly lineLimit: number;
};
export type Output = {
  readonly used: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCharacters: { type: "integer", minimum: 0 },
    secondCharacters: { type: "integer", minimum: 0 },
    separatorCharacters: { type: "integer", minimum: 0 },
    lineLimit: { type: "integer", minimum: 0 },
  },
  required: [
    "firstCharacters",
    "secondCharacters",
    "separatorCharacters",
    "lineLimit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["used", "remaining", "fits"],
} as const;
/** Calculate subtitle two speaker line budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCharacters, secondCharacters, separatorCharacters, lineLimit } =
    request;
  const compute = (): Output => {
    H.integer(firstCharacters, 0);
    H.integer(secondCharacters, 0);
    H.integer(separatorCharacters, 0);
    H.integer(lineLimit, 0);
    return {
      used: firstCharacters + secondCharacters + separatorCharacters,
      remaining:
        lineLimit - firstCharacters - secondCharacters - separatorCharacters,
      fits:
        firstCharacters + secondCharacters + separatorCharacters <= lineLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCharacters: 15,
    secondCharacters: 20,
    separatorCharacters: 3,
    lineLimit: 42,
  },
  output: { used: 38, remaining: 4, fits: true },
} satisfies ToolExample<Input, Output>;
export const subtitleTwoSpeakerLineBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/subtitle-two-speaker-line-budget",
    title: "Subtitle Two Speaker Line Budget Tool",
    description:
      "Calculate subtitle two speaker line budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCharacters: { type: "integer", minimum: 0 },
        secondCharacters: { type: "integer", minimum: 0 },
        separatorCharacters: { type: "integer", minimum: 0 },
        lineLimit: { type: "integer", minimum: 0 },
      },
      required: [
        "firstCharacters",
        "secondCharacters",
        "separatorCharacters",
        "lineLimit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        used: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["used", "remaining", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "firstCharacters",
          label: "First Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondCharacters",
          label: "Second Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separatorCharacters",
          label: "Separator Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lineLimit",
          label: "Line Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = subtitleTwoSpeakerLineBudgetTool.execute;
export default subtitleTwoSpeakerLineBudgetTool;
