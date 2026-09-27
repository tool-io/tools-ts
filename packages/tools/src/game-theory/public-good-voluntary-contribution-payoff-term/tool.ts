import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endowment: number;
  readonly ownContribution: number;
  readonly othersContribution: number;
  readonly benefitPerTotalUnit: number;
};
export type Output = {
  readonly totalContribution: number;
  readonly privateRemainder: number;
  readonly payoff: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endowment: { type: "number", minimum: 0 },
    ownContribution: { type: "number", minimum: 0 },
    othersContribution: { type: "number", minimum: 0 },
    benefitPerTotalUnit: { type: "number", minimum: 0 },
  },
  required: [
    "endowment",
    "ownContribution",
    "othersContribution",
    "benefitPerTotalUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalContribution: { type: "number" },
    privateRemainder: { type: "number" },
    payoff: { type: "number" },
  },
  required: ["totalContribution", "privateRemainder", "payoff"],
} as const;
/** Calculate public good voluntary contribution payoff term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    endowment,
    ownContribution,
    othersContribution,
    benefitPerTotalUnit,
  } = request;
  const compute = (): Output => {
    H.domain(
      endowment >= 0 &&
        ownContribution >= 0 &&
        ownContribution <= endowment &&
        othersContribution >= 0 &&
        benefitPerTotalUnit >= 0,
    );
    return {
      totalContribution: ownContribution + othersContribution,
      privateRemainder: endowment - ownContribution,
      payoff:
        endowment -
        ownContribution +
        benefitPerTotalUnit * (ownContribution + othersContribution),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    endowment: 20,
    ownContribution: 5,
    othersContribution: 15,
    benefitPerTotalUnit: 0.4,
  },
  output: { totalContribution: 20, privateRemainder: 15, payoff: 23 },
} satisfies ToolExample<Input, Output>;
export const publicGoodVoluntaryContributionPayoffTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/public-good-voluntary-contribution-payoff-term",
      title: "Public Good Voluntary Contribution Payoff Term Tool",
      description:
        "Calculate public good voluntary contribution payoff term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          endowment: { type: "number", minimum: 0 },
          ownContribution: { type: "number", minimum: 0 },
          othersContribution: { type: "number", minimum: 0 },
          benefitPerTotalUnit: { type: "number", minimum: 0 },
        },
        required: [
          "endowment",
          "ownContribution",
          "othersContribution",
          "benefitPerTotalUnit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalContribution: { type: "number" },
          privateRemainder: { type: "number" },
          payoff: { type: "number" },
        },
        required: ["totalContribution", "privateRemainder", "payoff"],
      },
      ports: {
        inputs: [
          {
            id: "endowment",
            label: "Endowment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ownContribution",
            label: "Own Contribution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "othersContribution",
            label: "Others Contribution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "benefitPerTotalUnit",
            label: "Benefit Per Total Unit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalContribution",
            label: "Total Contribution",
            valueType: { type: "number" },
          },
          {
            id: "privateRemainder",
            label: "Private Remainder",
            valueType: { type: "number" },
          },
          { id: "payoff", label: "Payoff", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = publicGoodVoluntaryContributionPayoffTermTool.execute;
export default publicGoodVoluntaryContributionPayoffTermTool;
