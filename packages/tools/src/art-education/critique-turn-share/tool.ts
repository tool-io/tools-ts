import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerTurns: number;
  readonly facilitatorTurns: number;
  readonly uncodedTurns: number;
  readonly countUncoded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly learnerShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerTurns: { type: "integer", minimum: 0 },
    facilitatorTurns: { type: "integer", minimum: 0 },
    uncodedTurns: { type: "integer", minimum: 0 },
    countUncoded: { type: "boolean" },
  },
  required: [
    "learnerTurns",
    "facilitatorTurns",
    "uncodedTurns",
    "countUncoded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    learnerShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "learnerShare", "defined"],
} as const;
/** Calculate critique turn share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerTurns, facilitatorTurns, uncodedTurns, countUncoded } =
    request;
  const compute = (): Output => {
    H.integer(learnerTurns, 0);
    H.integer(facilitatorTurns, 0);
    H.integer(uncodedTurns, 0);
    return {
      denominator:
        learnerTurns + facilitatorTurns + (countUncoded ? uncodedTurns : 0),
      learnerShare:
        learnerTurns + facilitatorTurns + (countUncoded ? uncodedTurns : 0) > 0
          ? learnerTurns /
            (learnerTurns +
              facilitatorTurns +
              (countUncoded ? uncodedTurns : 0))
          : 0,
      defined:
        learnerTurns + facilitatorTurns + (countUncoded ? uncodedTurns : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    learnerTurns: 12,
    facilitatorTurns: 4,
    uncodedTurns: 4,
    countUncoded: true,
  },
  output: { denominator: 20, learnerShare: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const critiqueTurnShareTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "art-education/critique-turn-share",
    title: "Critique Turn Share Tool",
    description:
      "Calculate critique turn share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        learnerTurns: { type: "integer", minimum: 0 },
        facilitatorTurns: { type: "integer", minimum: 0 },
        uncodedTurns: { type: "integer", minimum: 0 },
        countUncoded: { type: "boolean" },
      },
      required: [
        "learnerTurns",
        "facilitatorTurns",
        "uncodedTurns",
        "countUncoded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        learnerShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "learnerShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "learnerTurns",
          label: "Learner Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "facilitatorTurns",
          label: "Facilitator Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uncodedTurns",
          label: "Uncoded Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countUncoded",
          label: "Count Uncoded",
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
          id: "learnerShare",
          label: "Learner Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = critiqueTurnShareTool.execute;
export default critiqueTurnShareTool;
