import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly committedCapital: number;
  readonly annualSimpleRate: number;
  readonly delayYearFraction: number;
};
export type Output = { readonly simpleDelayInterest: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    committedCapital: { type: "number", minimum: 0 },
    annualSimpleRate: { type: "number" },
    delayYearFraction: { type: "number", minimum: 0 },
  },
  required: ["committedCapital", "annualSimpleRate", "delayYearFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { simpleDelayInterest: { type: "number" } },
  required: ["simpleDelayInterest"],
} as const;
/** Apply an explicit simple annual financing rate over a supplied grid-connection delay year fraction without compounding or estimating delay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { committedCapital, annualSimpleRate, delayYearFraction } = request;
  const compute = (): Output => {
    H.domain(
      committedCapital >= 0 && delayYearFraction >= 0,
      "committedCapital",
    );
    return {
      simpleDelayInterest:
        committedCapital * annualSimpleRate * delayYearFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    committedCapital: 100000,
    annualSimpleRate: 0.05,
    delayYearFraction: 0.5,
  },
  output: { simpleDelayInterest: 2500 },
} satisfies ToolExample<Input, Output>;
export const gridConnectionDelayInterestTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/grid-connection-delay-interest",
    title: "Grid Connection Delay Interest",
    description:
      "Apply an explicit simple annual financing rate over a supplied grid-connection delay year fraction without compounding or estimating delay.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        committedCapital: { type: "number", minimum: 0 },
        annualSimpleRate: { type: "number" },
        delayYearFraction: { type: "number", minimum: 0 },
      },
      required: ["committedCapital", "annualSimpleRate", "delayYearFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { simpleDelayInterest: { type: "number" } },
      required: ["simpleDelayInterest"],
    },
    ports: {
      inputs: [
        {
          id: "committedCapital",
          label: "Committed Capital",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualSimpleRate",
          label: "Annual Simple Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delayYearFraction",
          label: "Delay Year Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "simpleDelayInterest",
          label: "Simple Delay Interest",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gridConnectionDelayInterestTool.execute;
export default gridConnectionDelayInterestTool;
