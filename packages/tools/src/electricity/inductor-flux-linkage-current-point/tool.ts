import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inductance: number; readonly current: number };
export type Output = {
  readonly fluxLinkage: number;
  readonly differentialInductance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductance: { type: "number", minimum: 0 },
    current: { type: "number" },
  },
  required: ["inductance", "current"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluxLinkage: { type: "number" },
    differentialInductance: { type: "number" },
  },
  required: ["fluxLinkage", "differentialInductance"],
} as const;
/** Return flux linkage and differential inductance under an explicitly constant linear-inductor model. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inductance, current } = input;
  const compute = (): Output => {
    H.domain(inductance >= 0);
    return {
      fluxLinkage: inductance * current,
      differentialInductance: inductance,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inductance: 2, current: -3 },
  output: { fluxLinkage: -6, differentialInductance: 2 },
} satisfies ToolExample<Input, Output>;
export const inductorFluxLinkageCurrentPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductor-flux-linkage-current-point",
    title: "Inductor Flux Linkage Current Point Tool",
    description:
      "Return flux linkage and differential inductance under an explicitly constant linear-inductor model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inductance: { type: "number", minimum: 0 },
        current: { type: "number" },
      },
      required: ["inductance", "current"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fluxLinkage: { type: "number" },
        differentialInductance: { type: "number" },
      },
      required: ["fluxLinkage", "differentialInductance"],
    },
    ports: {
      inputs: [
        {
          id: "inductance",
          label: "Inductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fluxLinkage",
          label: "Flux Linkage",
          valueType: { type: "number" },
        },
        {
          id: "differentialInductance",
          label: "Differential Inductance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inductorFluxLinkageCurrentPointTool.execute;
export default inductorFluxLinkageCurrentPointTool;
