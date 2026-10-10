import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cylinderDiopters: number };
export type Output = {
  readonly signLabel: string;
  readonly magnitudeDiopters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cylinderDiopters: { type: "number" } },
  required: ["cylinderDiopters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signLabel: { type: "string", maxLength: 8192 },
    magnitudeDiopters: { type: "number" },
  },
  required: ["signLabel", "magnitudeDiopters"],
} as const;
/** Label the sign and magnitude of a supplied cylinder power without transposing or recommending a prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cylinderDiopters } = request;
  const compute = (): Output => {
    return {
      signLabel:
        cylinderDiopters > 0
          ? "plus cylinder"
          : cylinderDiopters < 0
            ? "minus cylinder"
            : "zero cylinder",
      magnitudeDiopters: Math.abs(cylinderDiopters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cylinderDiopters: -1.5 },
  output: { signLabel: "minus cylinder", magnitudeDiopters: 1.5 },
} satisfies ToolExample<Input, Output>;
export const ophthalmicRefractionCylinderSignLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["ophthalmology", "health and medicine"],
        keywords: ["ophthalmology", "health and medicine"],
      },
      id: "ophthalmology/ophthalmic-refraction-cylinder-sign-label",
      title: "Ophthalmic Refraction Cylinder Sign Label",
      description:
        "Label the sign and magnitude of a supplied cylinder power without transposing or recommending a prescription.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cylinderDiopters: { type: "number" } },
        required: ["cylinderDiopters"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signLabel: { type: "string", maxLength: 8192 },
          magnitudeDiopters: { type: "number" },
        },
        required: ["signLabel", "magnitudeDiopters"],
      },
      ports: {
        inputs: [
          {
            id: "cylinderDiopters",
            label: "Cylinder Diopters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signLabel",
            label: "Sign Label",
            valueType: { type: "string" },
          },
          {
            id: "magnitudeDiopters",
            label: "Magnitude Diopters",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ophthalmicRefractionCylinderSignLabelTool.execute;
export default ophthalmicRefractionCylinderSignLabelTool;
