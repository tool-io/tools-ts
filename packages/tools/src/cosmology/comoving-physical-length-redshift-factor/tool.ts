import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly comovingLength: number;
  readonly redshift: number;
};
export type Output = {
  readonly physicalLength: number;
  readonly scaleFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comovingLength: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["comovingLength", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalLength: { type: "number" },
    scaleFactor: { type: "number" },
  },
  required: ["physicalLength", "scaleFactor"],
} as const;
/** Calculate comoving physical length redshift factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { comovingLength, redshift } = request;
  const compute = (): Output => {
    H.domain(comovingLength >= 0 && redshift > -1);
    return {
      physicalLength: comovingLength / (1 + redshift),
      scaleFactor: 1 / (1 + redshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { comovingLength: 100, redshift: 1 },
  output: { physicalLength: 50, scaleFactor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const comovingPhysicalLengthRedshiftFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/comoving-physical-length-redshift-factor",
      title: "Comoving Physical Length Redshift Factor Tool",
      description:
        "Calculate comoving physical length redshift factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          comovingLength: { type: "number", minimum: 0 },
          redshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["comovingLength", "redshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physicalLength: { type: "number" },
          scaleFactor: { type: "number" },
        },
        required: ["physicalLength", "scaleFactor"],
      },
      ports: {
        inputs: [
          {
            id: "comovingLength",
            label: "Comoving Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redshift",
            label: "Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "physicalLength",
            label: "Physical Length",
            valueType: { type: "number" },
          },
          {
            id: "scaleFactor",
            label: "Scale Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = comovingPhysicalLengthRedshiftFactorTool.execute;
export default comovingPhysicalLengthRedshiftFactorTool;
