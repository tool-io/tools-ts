import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exhausted: number;
  readonly continuing: number;
  readonly excluded: number;
  readonly includeExcluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly exhaustedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exhausted: { type: "integer", minimum: 0 },
    continuing: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    includeExcluded: { type: "boolean" },
  },
  required: ["exhausted", "continuing", "excluded", "includeExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    exhaustedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "exhaustedShare", "defined"],
} as const;
/** Audit supplied ballot disposition counts under an explicit denominator convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exhausted, continuing, excluded, includeExcluded } = request;
  const compute = (): Output => {
    H.integer(exhausted, 0);
    H.integer(continuing, 0);
    H.integer(excluded, 0);
    return {
      denominator: exhausted + continuing + (includeExcluded ? excluded : 0),
      exhaustedShare:
        exhausted + continuing + (includeExcluded ? excluded : 0) > 0
          ? exhausted /
            (exhausted + continuing + (includeExcluded ? excluded : 0))
          : 0,
      defined: exhausted + continuing + (includeExcluded ? excluded : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exhausted: 20,
    continuing: 80,
    excluded: 10,
    includeExcluded: false,
  },
  output: { denominator: 100, exhaustedShare: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const ballotExhaustionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/ballot-exhaustion-share",
    title: "Ballot Exhaustion Share Tool",
    description:
      "Audit supplied ballot disposition counts under an explicit denominator convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exhausted: { type: "integer", minimum: 0 },
        continuing: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        includeExcluded: { type: "boolean" },
      },
      required: ["exhausted", "continuing", "excluded", "includeExcluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        exhaustedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "exhaustedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "exhausted",
          label: "Exhausted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "continuing",
          label: "Continuing",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeExcluded",
          label: "Include Excluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "exhaustedShare",
          label: "Exhausted Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ballotExhaustionShareTool.execute;
export default ballotExhaustionShareTool;
