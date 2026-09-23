import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bladeLength: number;
  readonly petioleLength: number;
  readonly includePetiole: boolean;
};
export type Output = {
  readonly reportedLength: number;
  readonly petioleFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bladeLength: { type: "number", minimum: 0 },
    petioleLength: { type: "number", minimum: 0 },
    includePetiole: { type: "boolean" },
  },
  required: ["bladeLength", "petioleLength", "includePetiole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedLength: { type: "number" },
    petioleFraction: { type: "number" },
  },
  required: ["reportedLength", "petioleFraction"],
} as const;
/** Calculate leaf petiole inclusion base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bladeLength, petioleLength, includePetiole } = request;
  const compute = (): Output => {
    H.domain(
      bladeLength >= 0 && petioleLength >= 0 && bladeLength + petioleLength > 0,
    );
    return {
      reportedLength: bladeLength + (includePetiole ? petioleLength : 0),
      petioleFraction: petioleLength / (bladeLength + petioleLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bladeLength: 8, petioleLength: 2, includePetiole: true },
  output: { reportedLength: 10, petioleFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const leafPetioleInclusionBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/leaf-petiole-inclusion-base-flag",
    title: "Leaf Petiole Inclusion Base Flag Tool",
    description:
      "Calculate leaf petiole inclusion base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bladeLength: { type: "number", minimum: 0 },
        petioleLength: { type: "number", minimum: 0 },
        includePetiole: { type: "boolean" },
      },
      required: ["bladeLength", "petioleLength", "includePetiole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedLength: { type: "number" },
        petioleFraction: { type: "number" },
      },
      required: ["reportedLength", "petioleFraction"],
    },
    ports: {
      inputs: [
        {
          id: "bladeLength",
          label: "Blade Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "petioleLength",
          label: "Petiole Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includePetiole",
          label: "Include Petiole",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedLength",
          label: "Reported Length",
          valueType: { type: "number" },
        },
        {
          id: "petioleFraction",
          label: "Petiole Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leafPetioleInclusionBaseFlagTool.execute;
export default leafPetioleInclusionBaseFlagTool;
