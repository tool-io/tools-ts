import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mutualInductance: number;
  readonly firstCurrent: number;
  readonly secondCurrent: number;
  readonly dotSign: number;
};
export type Output = { readonly mutualEnergy: number; readonly sign: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mutualInductance: { type: "number" },
    firstCurrent: { type: "number" },
    secondCurrent: { type: "number" },
    dotSign: { type: "integer" },
  },
  required: ["mutualInductance", "firstCurrent", "secondCurrent", "dotSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mutualEnergy: { type: "number" },
    sign: { type: "string", maxLength: 8192 },
  },
  required: ["mutualEnergy", "sign"],
} as const;
/** Signed mutual energy term under an explicit dot-convention sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mutualInductance, firstCurrent, secondCurrent, dotSign } = request;
  const compute = (): Output => {
    H.domain(mutualInductance >= 0 && (dotSign === 1 || dotSign === -1));
    const mutualEnergy =
      dotSign * mutualInductance * firstCurrent * secondCurrent;
    return {
      mutualEnergy,
      sign:
        mutualEnergy > 0 ? "positive" : mutualEnergy < 0 ? "negative" : "zero",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mutualInductance: 2,
    firstCurrent: 3,
    secondCurrent: 4,
    dotSign: -1,
  },
  output: { mutualEnergy: -24, sign: "negative" },
} satisfies ToolExample<Input, Output>;
export const inductorMutualEnergySignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductor-mutual-energy-sign-token",
    title: "Inductor Mutual Energy Sign Token Tool",
    description:
      "Signed mutual energy term under an explicit dot-convention sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mutualInductance: { type: "number" },
        firstCurrent: { type: "number" },
        secondCurrent: { type: "number" },
        dotSign: { type: "integer" },
      },
      required: [
        "mutualInductance",
        "firstCurrent",
        "secondCurrent",
        "dotSign",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mutualEnergy: { type: "number" },
        sign: { type: "string", maxLength: 8192 },
      },
      required: ["mutualEnergy", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "mutualInductance",
          label: "Mutual Inductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCurrent",
          label: "First Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCurrent",
          label: "Second Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dotSign",
          label: "Dot Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "mutualEnergy",
          label: "Mutual Energy",
          valueType: { type: "number" },
        },
        { id: "sign", label: "Sign", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = inductorMutualEnergySignTokenTool.execute;
export default inductorMutualEnergySignTokenTool;
