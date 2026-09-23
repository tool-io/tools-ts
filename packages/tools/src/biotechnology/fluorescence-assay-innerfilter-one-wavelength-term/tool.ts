import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly excitationAbsorbance: number;
  readonly emissionAbsorbance: number;
};
export type Output = { readonly corrected: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    excitationAbsorbance: { type: "number" },
    emissionAbsorbance: { type: "number" },
  },
  required: ["observed", "excitationAbsorbance", "emissionAbsorbance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, factor: { type: "number" } },
  required: ["corrected", "factor"],
} as const;
/** Apply the central-volume right-angle inner-filter approximation using supplied decadic absorbances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, excitationAbsorbance, emissionAbsorbance } = request;
  const compute = (): Output => {
    return {
      corrected:
        observed * 10 ** ((excitationAbsorbance + emissionAbsorbance) / 2),
      factor: 10 ** ((excitationAbsorbance + emissionAbsorbance) / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 100, excitationAbsorbance: 0.2, emissionAbsorbance: 0.2 },
  output: { corrected: 158.48931924611136, factor: 1.5848931924611136 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceAssayInnerfilterOneWavelengthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/fluorescence-assay-innerfilter-one-wavelength-term",
      title: "Fluorescence Assay Innerfilter One Wavelength Term Tool",
      description:
        "Apply the central-volume right-angle inner-filter approximation using supplied decadic absorbances.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          excitationAbsorbance: { type: "number" },
          emissionAbsorbance: { type: "number" },
        },
        required: ["observed", "excitationAbsorbance", "emissionAbsorbance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          corrected: { type: "number" },
          factor: { type: "number" },
        },
        required: ["corrected", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excitationAbsorbance",
            label: "Excitation Absorbance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "emissionAbsorbance",
            label: "Emission Absorbance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "corrected",
            label: "Corrected",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = fluorescenceAssayInnerfilterOneWavelengthTermTool.execute;
export default fluorescenceAssayInnerfilterOneWavelengthTermTool;
