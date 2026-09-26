import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tranche: number;
  readonly achieved: boolean;
  readonly holdbackFraction: number;
  readonly previouslyReleased: number;
};
export type Output = {
  readonly authorized: number;
  readonly releaseNow: number;
  readonly heldBack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tranche: { type: "number", minimum: 0 },
    achieved: { type: "boolean" },
    holdbackFraction: { type: "number", minimum: 0, maximum: 1 },
    previouslyReleased: { type: "number", minimum: 0 },
  },
  required: ["tranche", "achieved", "holdbackFraction", "previouslyReleased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorized: { type: "number" },
    releaseNow: { type: "number" },
    heldBack: { type: "number" },
  },
  required: ["authorized", "releaseNow", "heldBack"],
} as const;
/** Calculate venture milestone tranche release term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tranche, achieved, holdbackFraction, previouslyReleased } = request;
  const compute = (): Output => {
    H.domain(
      tranche >= 0 && previouslyReleased >= 0 && previouslyReleased <= tranche,
    );
    H.probability(holdbackFraction);
    return {
      authorized: achieved ? tranche * (1 - holdbackFraction) : 0,
      releaseNow: Math.max(
        0,
        (achieved ? tranche * (1 - holdbackFraction) : 0) - previouslyReleased,
      ),
      heldBack: achieved ? tranche * holdbackFraction : tranche,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tranche: 100000,
    achieved: true,
    holdbackFraction: 0.1,
    previouslyReleased: 20000,
  },
  output: { authorized: 90000, releaseNow: 70000, heldBack: 10000 },
} satisfies ToolExample<Input, Output>;
export const ventureMilestoneTrancheReleaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/venture-milestone-tranche-release-term",
    title: "Venture Milestone Tranche Release Term Tool",
    description:
      "Calculate venture milestone tranche release term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tranche: { type: "number", minimum: 0 },
        achieved: { type: "boolean" },
        holdbackFraction: { type: "number", minimum: 0, maximum: 1 },
        previouslyReleased: { type: "number", minimum: 0 },
      },
      required: [
        "tranche",
        "achieved",
        "holdbackFraction",
        "previouslyReleased",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorized: { type: "number" },
        releaseNow: { type: "number" },
        heldBack: { type: "number" },
      },
      required: ["authorized", "releaseNow", "heldBack"],
    },
    ports: {
      inputs: [
        {
          id: "tranche",
          label: "Tranche",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "achieved",
          label: "Achieved",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "holdbackFraction",
          label: "Holdback Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previouslyReleased",
          label: "Previously Released",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "authorized",
          label: "Authorized",
          valueType: { type: "number" },
        },
        {
          id: "releaseNow",
          label: "Release Now",
          valueType: { type: "number" },
        },
        { id: "heldBack", label: "Held Back", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ventureMilestoneTrancheReleaseTermTool.execute;
export default ventureMilestoneTrancheReleaseTermTool;
