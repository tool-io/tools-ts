import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly couplingMagnitude: number;
  readonly firstInductance: number;
  readonly secondInductance: number;
  readonly aiding: boolean;
};
export type Output = { readonly signedMutualInductance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    couplingMagnitude: { type: "number", minimum: 0, maximum: 1 },
    firstInductance: { type: "number", minimum: 0 },
    secondInductance: { type: "number", minimum: 0 },
    aiding: { type: "boolean" },
  },
  required: [
    "couplingMagnitude",
    "firstInductance",
    "secondInductance",
    "aiding",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedMutualInductance: { type: "number" } },
  required: ["signedMutualInductance"],
} as const;
/** Form one signed ideal mutual-inductance term from supplied coupling magnitude and aiding/opposing convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { couplingMagnitude, firstInductance, secondInductance, aiding } =
    request;
  const compute = (): Output => {
    H.probability(couplingMagnitude);
    H.domain(firstInductance >= 0 && secondInductance >= 0);
    return {
      signedMutualInductance:
        (aiding ? 1 : -1) *
        couplingMagnitude *
        Math.sqrt(firstInductance) *
        Math.sqrt(secondInductance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    couplingMagnitude: 0.5,
    firstInductance: 4,
    secondInductance: 9,
    aiding: true,
  },
  output: { signedMutualInductance: 3 },
} satisfies ToolExample<Input, Output>;
export const inductanceCouplingSignTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductance-coupling-sign-term",
    title: "Inductance Coupling Sign Term Tool",
    description:
      "Form one signed ideal mutual-inductance term from supplied coupling magnitude and aiding/opposing convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        couplingMagnitude: { type: "number", minimum: 0, maximum: 1 },
        firstInductance: { type: "number", minimum: 0 },
        secondInductance: { type: "number", minimum: 0 },
        aiding: { type: "boolean" },
      },
      required: [
        "couplingMagnitude",
        "firstInductance",
        "secondInductance",
        "aiding",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedMutualInductance: { type: "number" } },
      required: ["signedMutualInductance"],
    },
    ports: {
      inputs: [
        {
          id: "couplingMagnitude",
          label: "Coupling Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstInductance",
          label: "First Inductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondInductance",
          label: "Second Inductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aiding",
          label: "Aiding",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedMutualInductance",
          label: "Signed Mutual Inductance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inductanceCouplingSignTermTool.execute;
export default inductanceCouplingSignTermTool;
