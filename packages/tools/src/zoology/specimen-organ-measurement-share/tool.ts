import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly organIds: readonly string[];
  readonly masses: readonly number[];
  readonly measured: readonly boolean[];
  readonly selectedOrgan: string;
};
export type Output = {
  readonly specimenMass: number;
  readonly selectedMeasuredMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    organIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    masses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    measured: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedOrgan: { type: "string", maxLength: 8192 },
  },
  required: ["organIds", "masses", "measured", "selectedOrgan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenMass: { type: "number" },
    selectedMeasuredMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["specimenMass", "selectedMeasuredMass", "share", "defined"],
} as const;
/** Calculate specimen organ measurement share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { organIds, masses, measured, selectedOrgan } = request;
  const compute = (): Output => {
    H.sameLength(organIds, masses);
    H.sameLength(organIds, measured);
    H.domain(masses.every((x) => x >= 0));
    return (() => {
      const specimenMass = masses.reduce((a, b) => a + b, 0),
        selectedMeasuredMass = masses.reduce(
          (s, x, i) =>
            s + (measured[i] && organIds[i] === selectedOrgan ? x : 0),
          0,
        );
      return {
        specimenMass,
        selectedMeasuredMass,
        share: specimenMass > 0 ? selectedMeasuredMass / specimenMass : 0,
        defined: specimenMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    organIds: ["A", "B"],
    masses: [2, 3],
    measured: [true, false],
    selectedOrgan: "A",
  },
  output: {
    specimenMass: 5,
    selectedMeasuredMass: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const specimenOrganMeasurementShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/specimen-organ-measurement-share",
    title: "Specimen Organ Measurement Share Tool",
    description:
      "Calculate specimen organ measurement share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        organIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        masses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        measured: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedOrgan: { type: "string", maxLength: 8192 },
      },
      required: ["organIds", "masses", "measured", "selectedOrgan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenMass: { type: "number" },
        selectedMeasuredMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["specimenMass", "selectedMeasuredMass", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "organIds",
          label: "Organ Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedOrgan",
          label: "Selected Organ",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "specimenMass",
          label: "Specimen Mass",
          valueType: { type: "number" },
        },
        {
          id: "selectedMeasuredMass",
          label: "Selected Measured Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = specimenOrganMeasurementShareTool.execute;
export default specimenOrganMeasurementShareTool;
