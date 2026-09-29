import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly goodProductMass: number;
  readonly scrapMass: number;
  readonly recoveredFraction: number;
};
export type Output = {
  readonly recoveredMass: number;
  readonly unrecoveredScrap: number;
  readonly otherLoss: number;
  readonly netMaterialUse: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", minimum: 0 },
    goodProductMass: { type: "number", minimum: 0 },
    scrapMass: { type: "number", minimum: 0 },
    recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["inputMass", "goodProductMass", "scrapMass", "recoveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredMass: { type: "number" },
    unrecoveredScrap: { type: "number" },
    otherLoss: { type: "number" },
    netMaterialUse: { type: "number" },
  },
  required: [
    "recoveredMass",
    "unrecoveredScrap",
    "otherLoss",
    "netMaterialUse",
  ],
} as const;
/** Calculate scrap recovery material balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, goodProductMass, scrapMass, recoveredFraction } = request;
  const compute = (): Output => {
    H.domain(
      inputMass >= 0 &&
        goodProductMass >= 0 &&
        scrapMass >= 0 &&
        goodProductMass + scrapMass <= inputMass,
    );
    H.probability(recoveredFraction);
    return {
      recoveredMass: scrapMass * recoveredFraction,
      unrecoveredScrap: scrapMass * (1 - recoveredFraction),
      otherLoss: inputMass - goodProductMass - scrapMass,
      netMaterialUse: inputMass - scrapMass * recoveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputMass: 100,
    goodProductMass: 70,
    scrapMass: 20,
    recoveredFraction: 0.75,
  },
  output: {
    recoveredMass: 15,
    unrecoveredScrap: 5,
    otherLoss: 10,
    netMaterialUse: 85,
  },
} satisfies ToolExample<Input, Output>;
export const scrapRecoveryMaterialBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/scrap-recovery-material-balance-term",
    title: "Scrap Recovery Material Balance Term Tool",
    description:
      "Calculate scrap recovery material balance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", minimum: 0 },
        goodProductMass: { type: "number", minimum: 0 },
        scrapMass: { type: "number", minimum: 0 },
        recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "inputMass",
        "goodProductMass",
        "scrapMass",
        "recoveredFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredMass: { type: "number" },
        unrecoveredScrap: { type: "number" },
        otherLoss: { type: "number" },
        netMaterialUse: { type: "number" },
      },
      required: [
        "recoveredMass",
        "unrecoveredScrap",
        "otherLoss",
        "netMaterialUse",
      ],
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
          id: "goodProductMass",
          label: "Good Product Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scrapMass",
          label: "Scrap Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredFraction",
          label: "Recovered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveredMass",
          label: "Recovered Mass",
          valueType: { type: "number" },
        },
        {
          id: "unrecoveredScrap",
          label: "Unrecovered Scrap",
          valueType: { type: "number" },
        },
        { id: "otherLoss", label: "Other Loss", valueType: { type: "number" } },
        {
          id: "netMaterialUse",
          label: "Net Material Use",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scrapRecoveryMaterialBalanceTermTool.execute;
export default scrapRecoveryMaterialBalanceTermTool;
