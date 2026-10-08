import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEffectOnSecond: number;
  readonly secondEffectOnFirst: number;
};
export type Output = {
  readonly signedAsymmetry: number;
  readonly absoluteAsymmetry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEffectOnSecond: { type: "number" },
    secondEffectOnFirst: { type: "number" },
  },
  required: ["firstEffectOnSecond", "secondEffectOnFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedAsymmetry: { type: "number" },
    absoluteAsymmetry: { type: "number" },
  },
  required: ["signedAsymmetry", "absoluteAsymmetry"],
} as const;
/** Compare two explicitly directional interaction effects on a common measurement basis without inferring ecological mechanisms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEffectOnSecond, secondEffectOnFirst } = request;
  const compute = (): Output => {
    return {
      signedAsymmetry: firstEffectOnSecond - secondEffectOnFirst,
      absoluteAsymmetry: Math.abs(firstEffectOnSecond - secondEffectOnFirst),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstEffectOnSecond: 0.8, secondEffectOnFirst: 0.3 },
  output: { signedAsymmetry: 0.5, absoluteAsymmetry: 0.5 },
} satisfies ToolExample<Input, Output>;
export const ecologicalAsymmetryInteractionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/ecological-asymmetry-interaction-pair",
    title: "Ecological Asymmetry Interaction Pair",
    description:
      "Compare two explicitly directional interaction effects on a common measurement basis without inferring ecological mechanisms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEffectOnSecond: { type: "number" },
        secondEffectOnFirst: { type: "number" },
      },
      required: ["firstEffectOnSecond", "secondEffectOnFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedAsymmetry: { type: "number" },
        absoluteAsymmetry: { type: "number" },
      },
      required: ["signedAsymmetry", "absoluteAsymmetry"],
    },
    ports: {
      inputs: [
        {
          id: "firstEffectOnSecond",
          label: "First Effect On Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEffectOnFirst",
          label: "Second Effect On First",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedAsymmetry",
          label: "Signed Asymmetry",
          valueType: { type: "number" },
        },
        {
          id: "absoluteAsymmetry",
          label: "Absolute Asymmetry",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecologicalAsymmetryInteractionPairTool.execute;
export default ecologicalAsymmetryInteractionPairTool;
