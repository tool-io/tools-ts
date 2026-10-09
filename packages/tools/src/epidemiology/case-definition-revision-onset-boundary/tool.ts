import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetDate: string;
  readonly revisionBoundaryDate: string;
  readonly boundaryUsesNew: boolean;
};
export type Output = { readonly useNewDefinition: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetDate: { type: "string", maxLength: 8192 },
    revisionBoundaryDate: { type: "string", maxLength: 8192 },
    boundaryUsesNew: { type: "boolean" },
  },
  required: ["onsetDate", "revisionBoundaryDate", "boundaryUsesNew"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { useNewDefinition: { type: "boolean" } },
  required: ["useNewDefinition"],
} as const;
/** Choose an explicitly supplied case-definition revision side by onset date and boundary-equality policy without determining case status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetDate, revisionBoundaryDate, boundaryUsesNew } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return (() => {
      const onset = namedDate(onsetDate, "onsetDate").getTime(),
        boundary = namedDate(
          revisionBoundaryDate,
          "revisionBoundaryDate",
        ).getTime();
      return {
        useNewDefinition:
          onset > boundary || (onset === boundary && boundaryUsesNew),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    onsetDate: "2026-11-01",
    revisionBoundaryDate: "2026-11-01",
    boundaryUsesNew: true,
  },
  output: { useNewDefinition: true },
} satisfies ToolExample<Input, Output>;
export const caseDefinitionRevisionOnsetBoundaryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/case-definition-revision-onset-boundary",
      title: "Case Definition Revision Onset Boundary Tool",
      description:
        "Choose an explicitly supplied case-definition revision side by onset date and boundary-equality policy without determining case status.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          onsetDate: { type: "string", maxLength: 8192 },
          revisionBoundaryDate: { type: "string", maxLength: 8192 },
          boundaryUsesNew: { type: "boolean" },
        },
        required: ["onsetDate", "revisionBoundaryDate", "boundaryUsesNew"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { useNewDefinition: { type: "boolean" } },
        required: ["useNewDefinition"],
      },
      ports: {
        inputs: [
          {
            id: "onsetDate",
            label: "Onset Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "revisionBoundaryDate",
            label: "Revision Boundary Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "boundaryUsesNew",
            label: "Boundary Uses New",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "useNewDefinition",
            label: "Use New Definition",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = caseDefinitionRevisionOnsetBoundaryTool.execute;
export default caseDefinitionRevisionOnsetBoundaryTool;
