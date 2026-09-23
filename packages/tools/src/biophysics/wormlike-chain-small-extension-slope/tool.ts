import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalEnergy: number;
  readonly persistenceLength: number;
  readonly contourLength: number;
  readonly extension: number;
};
export type Output = { readonly stiffness: number; readonly force: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalEnergy: { type: "number", minimum: 0 },
    persistenceLength: { type: "number", exclusiveMinimum: 0 },
    contourLength: { type: "number", exclusiveMinimum: 0 },
    extension: { type: "number", minimum: 0 },
  },
  required: [
    "thermalEnergy",
    "persistenceLength",
    "contourLength",
    "extension",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stiffness: { type: "number" }, force: { type: "number" } },
  required: ["stiffness", "force"],
} as const;
/** Linear small-extension limit of the Marko-Siggia wormlike-chain relation; caller must establish that the approximation applies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalEnergy, persistenceLength, contourLength, extension } =
    request;
  const compute = (): Output => {
    H.domain(
      thermalEnergy >= 0 && extension >= 0 && extension <= contourLength,
    );
    H.positive(persistenceLength);
    H.positive(contourLength);
    return {
      stiffness: (3 * thermalEnergy) / (2 * persistenceLength * contourLength),
      force:
        (3 * thermalEnergy * extension) /
        (2 * persistenceLength * contourLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    thermalEnergy: 4,
    persistenceLength: 2,
    contourLength: 6,
    extension: 1,
  },
  output: { stiffness: 0.5, force: 0.5 },
} satisfies ToolExample<Input, Output>;
export const wormlikeChainSmallExtensionSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/wormlike-chain-small-extension-slope",
    title: "Wormlike Chain Small Extension Slope Tool",
    description:
      "Linear small-extension limit of the Marko-Siggia wormlike-chain relation; caller must establish that the approximation applies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thermalEnergy: { type: "number", minimum: 0 },
        persistenceLength: { type: "number", exclusiveMinimum: 0 },
        contourLength: { type: "number", exclusiveMinimum: 0 },
        extension: { type: "number", minimum: 0 },
      },
      required: [
        "thermalEnergy",
        "persistenceLength",
        "contourLength",
        "extension",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stiffness: { type: "number" }, force: { type: "number" } },
      required: ["stiffness", "force"],
    },
    ports: {
      inputs: [
        {
          id: "thermalEnergy",
          label: "Thermal Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "persistenceLength",
          label: "Persistence Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contourLength",
          label: "Contour Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extension",
          label: "Extension",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stiffness", label: "Stiffness", valueType: { type: "number" } },
        { id: "force", label: "Force", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wormlikeChainSmallExtensionSlopeTool.execute;
export default wormlikeChainSmallExtensionSlopeTool;
