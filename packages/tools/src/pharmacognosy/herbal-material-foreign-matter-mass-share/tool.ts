import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleMass: number;
  readonly foreignMass: number;
  readonly excludedPackaging: number;
};
export type Output = {
  readonly netSample: number;
  readonly foreignFraction: number;
  readonly cleanMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMass: { type: "number" },
    foreignMass: { type: "number", minimum: 0 },
    excludedPackaging: { type: "number", minimum: 0 },
  },
  required: ["sampleMass", "foreignMass", "excludedPackaging"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netSample: { type: "number" },
    foreignFraction: { type: "number" },
    cleanMass: { type: "number" },
  },
  required: ["netSample", "foreignFraction", "cleanMass"],
} as const;
/** Calculate herbal material foreign matter mass share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleMass, foreignMass, excludedPackaging } = request;
  const compute = (): Output => {
    H.domain(
      sampleMass > excludedPackaging &&
        excludedPackaging >= 0 &&
        foreignMass >= 0 &&
        foreignMass <= sampleMass - excludedPackaging,
    );
    return {
      netSample: sampleMass - excludedPackaging,
      foreignFraction: foreignMass / (sampleMass - excludedPackaging),
      cleanMass: sampleMass - excludedPackaging - foreignMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleMass: 100, foreignMass: 4, excludedPackaging: 10 },
  output: {
    netSample: 90,
    foreignFraction: 0.044444444444444446,
    cleanMass: 86,
  },
} satisfies ToolExample<Input, Output>;
export const herbalMaterialForeignMatterMassShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/herbal-material-foreign-matter-mass-share",
      title: "Herbal Material Foreign Matter Mass Share Tool",
      description:
        "Calculate herbal material foreign matter mass share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleMass: { type: "number" },
          foreignMass: { type: "number", minimum: 0 },
          excludedPackaging: { type: "number", minimum: 0 },
        },
        required: ["sampleMass", "foreignMass", "excludedPackaging"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netSample: { type: "number" },
          foreignFraction: { type: "number" },
          cleanMass: { type: "number" },
        },
        required: ["netSample", "foreignFraction", "cleanMass"],
      },
      ports: {
        inputs: [
          {
            id: "sampleMass",
            label: "Sample Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foreignMass",
            label: "Foreign Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedPackaging",
            label: "Excluded Packaging",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netSample",
            label: "Net Sample",
            valueType: { type: "number" },
          },
          {
            id: "foreignFraction",
            label: "Foreign Fraction",
            valueType: { type: "number" },
          },
          {
            id: "cleanMass",
            label: "Clean Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = herbalMaterialForeignMatterMassShareTool.execute;
export default herbalMaterialForeignMatterMassShareTool;
