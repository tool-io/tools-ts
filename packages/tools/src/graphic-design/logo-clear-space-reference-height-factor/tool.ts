import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logoWidth: number;
  readonly logoHeight: number;
  readonly referenceHeight: number;
  readonly clearanceMultiple: number;
};
export type Output = {
  readonly clearance: number;
  readonly boundingWidth: number;
  readonly boundingHeight: number;
  readonly extraArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logoWidth: { type: "number", minimum: 0 },
    logoHeight: { type: "number", minimum: 0 },
    referenceHeight: { type: "number", minimum: 0 },
    clearanceMultiple: { type: "number", minimum: 0 },
  },
  required: ["logoWidth", "logoHeight", "referenceHeight", "clearanceMultiple"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearance: { type: "number" },
    boundingWidth: { type: "number" },
    boundingHeight: { type: "number" },
    extraArea: { type: "number" },
  },
  required: ["clearance", "boundingWidth", "boundingHeight", "extraArea"],
} as const;
/** Apply an explicitly supplied brand clear-space multiple to rectangular logo bounds; no brand standard is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logoWidth, logoHeight, referenceHeight, clearanceMultiple } = request;
  const compute = (): Output => {
    H.domain(
      logoWidth >= 0 &&
        logoHeight >= 0 &&
        referenceHeight >= 0 &&
        clearanceMultiple >= 0,
    );
    return {
      clearance: referenceHeight * clearanceMultiple,
      boundingWidth: logoWidth + 2 * referenceHeight * clearanceMultiple,
      boundingHeight: logoHeight + 2 * referenceHeight * clearanceMultiple,
      extraArea:
        (logoWidth + 2 * referenceHeight * clearanceMultiple) *
          (logoHeight + 2 * referenceHeight * clearanceMultiple) -
        logoWidth * logoHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    logoWidth: 100,
    logoHeight: 40,
    referenceHeight: 10,
    clearanceMultiple: 1.5,
  },
  output: {
    clearance: 15,
    boundingWidth: 130,
    boundingHeight: 70,
    extraArea: 5100,
  },
} satisfies ToolExample<Input, Output>;
export const logoClearSpaceReferenceHeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/logo-clear-space-reference-height-factor",
      title: "Logo Clear Space Reference Height Factor Tool",
      description:
        "Apply an explicitly supplied brand clear-space multiple to rectangular logo bounds; no brand standard is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logoWidth: { type: "number", minimum: 0 },
          logoHeight: { type: "number", minimum: 0 },
          referenceHeight: { type: "number", minimum: 0 },
          clearanceMultiple: { type: "number", minimum: 0 },
        },
        required: [
          "logoWidth",
          "logoHeight",
          "referenceHeight",
          "clearanceMultiple",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clearance: { type: "number" },
          boundingWidth: { type: "number" },
          boundingHeight: { type: "number" },
          extraArea: { type: "number" },
        },
        required: ["clearance", "boundingWidth", "boundingHeight", "extraArea"],
      },
      ports: {
        inputs: [
          {
            id: "logoWidth",
            label: "Logo Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "logoHeight",
            label: "Logo Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceHeight",
            label: "Reference Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "clearanceMultiple",
            label: "Clearance Multiple",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "clearance",
            label: "Clearance",
            valueType: { type: "number" },
          },
          {
            id: "boundingWidth",
            label: "Bounding Width",
            valueType: { type: "number" },
          },
          {
            id: "boundingHeight",
            label: "Bounding Height",
            valueType: { type: "number" },
          },
          {
            id: "extraArea",
            label: "Extra Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = logoClearSpaceReferenceHeightFactorTool.execute;
export default logoClearSpaceReferenceHeightFactorTool;
