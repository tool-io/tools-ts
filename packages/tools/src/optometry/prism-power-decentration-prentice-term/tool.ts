import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lensPowerDiopters: number;
  readonly decentrationMm: number;
};
export type Output = {
  readonly signedPrismDiopters: number;
  readonly decentrationCm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lensPowerDiopters: { type: "number" },
    decentrationMm: { type: "number" },
  },
  required: ["lensPowerDiopters", "decentrationMm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedPrismDiopters: { type: "number" },
    decentrationCm: { type: "number" },
  },
  required: ["signedPrismDiopters", "decentrationCm"],
} as const;
/** Prentice thin-lens prism product with millimeters converted to centimeters; sign follows the supplied lens power and displacement, without patient base-direction assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lensPowerDiopters, decentrationMm } = request;
  const compute = (): Output => {
    return {
      signedPrismDiopters: (lensPowerDiopters * decentrationMm) / 10,
      decentrationCm: decentrationMm / 10,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lensPowerDiopters: 4, decentrationMm: 5 },
  output: { signedPrismDiopters: 2, decentrationCm: 0.5 },
} satisfies ToolExample<Input, Output>;
export const prismPowerDecentrationPrenticeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/prism-power-decentration-prentice-term",
    title: "Prism Power Decentration Prentice Term Tool",
    description:
      "Prentice thin-lens prism product with millimeters converted to centimeters; sign follows the supplied lens power and displacement, without patient base-direction assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lensPowerDiopters: { type: "number" },
        decentrationMm: { type: "number" },
      },
      required: ["lensPowerDiopters", "decentrationMm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedPrismDiopters: { type: "number" },
        decentrationCm: { type: "number" },
      },
      required: ["signedPrismDiopters", "decentrationCm"],
    },
    ports: {
      inputs: [
        {
          id: "lensPowerDiopters",
          label: "Lens Power Diopters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "decentrationMm",
          label: "Decentration Mm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedPrismDiopters",
          label: "Signed Prism Diopters",
          valueType: { type: "number" },
        },
        {
          id: "decentrationCm",
          label: "Decentration Cm",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prismPowerDecentrationPrenticeTermTool.execute;
export default prismPowerDecentrationPrenticeTermTool;
