import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rulerLabel: string;
  readonly regnalYear: number;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rulerLabel: { type: "string", maxLength: 8192 },
    regnalYear: { type: "integer", minimum: 1 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["rulerLabel", "regnalYear", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly sourced regnal year without converting it to a modern calendar date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rulerLabel, regnalYear, source } = request;
  const compute = (): Output => {
    H.domain(rulerLabel.length > 0 && source.length > 0, "rulerLabel");
    (H.domain(
      Number.isSafeInteger(regnalYear) &&
        regnalYear >= 1 &&
        regnalYear <= Number.MAX_SAFE_INTEGER,
      "regnalYear",
    ),
      regnalYear);
    return {
      label: rulerLabel + ", regnal year " + regnalYear + " [" + source + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rulerLabel: "Ruler A", regnalYear: 7, source: "Charter 12" },
  output: { label: "Ruler A, regnal year 7 [Charter 12]" },
} satisfies ToolExample<Input, Output>;
export const regnalYearSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/regnal-year-source-label",
    title: "Regnal Year Source Label Tool",
    description:
      "Label an explicitly sourced regnal year without converting it to a modern calendar date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rulerLabel: { type: "string", maxLength: 8192 },
        regnalYear: { type: "integer", minimum: 1 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["rulerLabel", "regnalYear", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "rulerLabel",
          label: "Ruler Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regnalYear",
          label: "Regnal Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regnalYearSourceLabelTool.execute;
export default regnalYearSourceLabelTool;
