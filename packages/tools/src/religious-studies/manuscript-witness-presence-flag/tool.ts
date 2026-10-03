import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly witness: string;
  readonly suppliedWitnesses: readonly string[];
  readonly absentIsUnknown: boolean;
};
export type Output = { readonly present: boolean; readonly known: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witness: { type: "string", maxLength: 8192 },
    suppliedWitnesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    absentIsUnknown: { type: "boolean" },
  },
  required: ["witness", "suppliedWitnesses", "absentIsUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { present: { type: "boolean" }, known: { type: "boolean" } },
  required: ["present", "known"],
} as const;
/** Calculate manuscript witness presence flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witness, suppliedWitnesses, absentIsUnknown } = request;
  const compute = (): Output => {
    return {
      present: suppliedWitnesses.includes(witness),
      known: suppliedWitnesses.includes(witness) || !absentIsUnknown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { witness: "A", suppliedWitnesses: ["A", "B"], absentIsUnknown: true },
  output: { present: true, known: true },
} satisfies ToolExample<Input, Output>;
export const manuscriptWitnessPresenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/manuscript-witness-presence-flag",
    title: "Manuscript Witness Presence Flag Tool",
    description:
      "Calculate manuscript witness presence flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        witness: { type: "string", maxLength: 8192 },
        suppliedWitnesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        absentIsUnknown: { type: "boolean" },
      },
      required: ["witness", "suppliedWitnesses", "absentIsUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { present: { type: "boolean" }, known: { type: "boolean" } },
      required: ["present", "known"],
    },
    ports: {
      inputs: [
        {
          id: "witness",
          label: "Witness",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedWitnesses",
          label: "Supplied Witnesses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "absentIsUnknown",
          label: "Absent Is Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "present", label: "Present", valueType: { type: "boolean" } },
        { id: "known", label: "Known", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptWitnessPresenceFlagTool.execute;
export default manuscriptWitnessPresenceFlagTool;
