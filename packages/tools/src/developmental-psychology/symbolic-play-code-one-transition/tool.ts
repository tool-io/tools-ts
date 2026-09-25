import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codes: readonly string[];
  readonly fromCode: string;
  readonly toCode: string;
};
export type Output = {
  readonly opportunities: number;
  readonly transitions: number;
  readonly conditionalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fromCode: { type: "string", maxLength: 8192 },
    toCode: { type: "string", maxLength: 8192 },
  },
  required: ["codes", "fromCode", "toCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: { type: "integer" },
    transitions: { type: "integer" },
    conditionalFraction: { type: "number" },
  },
  required: ["opportunities", "transitions", "conditionalFraction"],
} as const;
/** Count one directed transition in explicit sequential play codes, excluding the final code from predecessor opportunities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codes, fromCode, toCode } = request;
  const compute = (): Output => {
    let opportunities = 0,
      transitions = 0;
    for (let i = 0; i + 1 < codes.length; i++)
      if (codes[i] === fromCode) {
        opportunities++;
        if (codes[i + 1] === toCode) transitions++;
      }
    H.domain(opportunities > 0);
    return {
      opportunities,
      transitions,
      conditionalFraction: transitions / opportunities,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codes: ["A", "B", "A", "A", "B"], fromCode: "A", toCode: "B" },
  output: {
    opportunities: 3,
    transitions: 2,
    conditionalFraction: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const symbolicPlayCodeOneTransitionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/symbolic-play-code-one-transition",
    title: "Symbolic Play Code One Transition Tool",
    description:
      "Count one directed transition in explicit sequential play codes, excluding the final code from predecessor opportunities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        fromCode: { type: "string", maxLength: 8192 },
        toCode: { type: "string", maxLength: 8192 },
      },
      required: ["codes", "fromCode", "toCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opportunities: { type: "integer" },
        transitions: { type: "integer" },
        conditionalFraction: { type: "number" },
      },
      required: ["opportunities", "transitions", "conditionalFraction"],
    },
    ports: {
      inputs: [
        {
          id: "codes",
          label: "Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "fromCode",
          label: "From Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "toCode",
          label: "To Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "opportunities",
          label: "Opportunities",
          valueType: { type: "integer" },
        },
        {
          id: "transitions",
          label: "Transitions",
          valueType: { type: "integer" },
        },
        {
          id: "conditionalFraction",
          label: "Conditional Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = symbolicPlayCodeOneTransitionTool.execute;
export default symbolicPlayCodeOneTransitionTool;
