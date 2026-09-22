import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registerHeight: number;
  readonly muralHeight: number;
  readonly targetFraction: number;
};
export type Output = {
  readonly actualFraction: number;
  readonly heightGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registerHeight: { type: "number", minimum: 0 },
    muralHeight: { type: "number", exclusiveMinimum: 0 },
    targetFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["registerHeight", "muralHeight", "targetFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualFraction: { type: "number" },
    heightGap: { type: "number" },
  },
  required: ["actualFraction", "heightGap"],
} as const;
/** Calculate mural register height proportion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registerHeight, muralHeight, targetFraction } = request;
  const compute = (): Output => {
    H.positive(muralHeight);
    H.domain(registerHeight >= 0 && registerHeight <= muralHeight);
    H.probability(targetFraction);
    return {
      actualFraction: registerHeight / muralHeight,
      heightGap: registerHeight - targetFraction * muralHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registerHeight: 2, muralHeight: 8, targetFraction: 0.25 },
  output: { actualFraction: 0.25, heightGap: 0 },
} satisfies ToolExample<Input, Output>;
export const muralRegisterHeightProportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/mural-register-height-proportion",
    title: "Mural Register Height Proportion Tool",
    description:
      "Calculate mural register height proportion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registerHeight: { type: "number", minimum: 0 },
        muralHeight: { type: "number", exclusiveMinimum: 0 },
        targetFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["registerHeight", "muralHeight", "targetFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualFraction: { type: "number" },
        heightGap: { type: "number" },
      },
      required: ["actualFraction", "heightGap"],
    },
    ports: {
      inputs: [
        {
          id: "registerHeight",
          label: "Register Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "muralHeight",
          label: "Mural Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetFraction",
          label: "Target Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualFraction",
          label: "Actual Fraction",
          valueType: { type: "number" },
        },
        { id: "heightGap", label: "Height Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = muralRegisterHeightProportionTool.execute;
export default muralRegisterHeightProportionTool;
