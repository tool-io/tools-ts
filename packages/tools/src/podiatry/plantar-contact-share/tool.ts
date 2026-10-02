import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactCells: number;
  readonly assessableCells: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactCells: { type: "integer", minimum: 0 },
    assessableCells: { type: "integer", minimum: 0 },
  },
  required: ["contactCells", "assessableCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Compute an explicit research contact-cell share without plantar-risk interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactCells, assessableCells } = request;
  const compute = (): Output => {
    H.integer(assessableCells, 0);
    H.integer(contactCells, 0, assessableCells);
    return {
      share: assessableCells > 0 ? contactCells / assessableCells : 0,
      defined: assessableCells > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactCells: 20, assessableCells: 100 },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const plantarContactShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "podiatry/plantar-contact-share",
      title: "Plantar Contact Share Tool",
      description:
        "Compute an explicit research contact-cell share without plantar-risk interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactCells: { type: "integer", minimum: 0 },
          assessableCells: { type: "integer", minimum: 0 },
        },
        required: ["contactCells", "assessableCells"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { share: { type: "number" }, defined: { type: "boolean" } },
        required: ["share", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "contactCells",
            label: "Contact Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessableCells",
            label: "Assessable Cells",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = plantarContactShareTool.execute;
export default plantarContactShareTool;
