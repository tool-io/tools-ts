import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly netOutputMass: number;
};
export type Output = {
  readonly yieldFraction: number;
  readonly scrapFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", exclusiveMinimum: 0 },
    netOutputMass: { type: "number", minimum: 0 },
  },
  required: ["inputMass", "netOutputMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yieldFraction: { type: "number" },
    scrapFraction: { type: "number" },
  },
  required: ["yieldFraction", "scrapFraction"],
} as const;
/** Crosswalk yield and scrap mass fractions for a closed mass balance without byproducts or inventory change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, netOutputMass } = request;
  const compute = (): Output => {
    (H.domain(inputMass > 0, "inputMass"), inputMass);
    H.domain(netOutputMass >= 0 && netOutputMass <= inputMass, "netOutputMass");
    return {
      yieldFraction: netOutputMass / inputMass,
      scrapFraction: (inputMass - netOutputMass) / inputMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputMass: 80, netOutputMass: 60 },
  output: { yieldFraction: 0.75, scrapFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const netYieldScrapShareCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/net-yield-scrap-share-crosswalk",
    title: "Net Yield Scrap Share Crosswalk Tool",
    description:
      "Crosswalk yield and scrap mass fractions for a closed mass balance without byproducts or inventory change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", exclusiveMinimum: 0 },
        netOutputMass: { type: "number", minimum: 0 },
      },
      required: ["inputMass", "netOutputMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yieldFraction: { type: "number" },
        scrapFraction: { type: "number" },
      },
      required: ["yieldFraction", "scrapFraction"],
    },
    ports: {
      inputs: [
        {
          id: "inputMass",
          label: "Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netOutputMass",
          label: "Net Output Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          valueType: { type: "number" },
        },
        {
          id: "scrapFraction",
          label: "Scrap Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = netYieldScrapShareCrosswalkTool.execute;
export default netYieldScrapShareCrosswalkTool;
