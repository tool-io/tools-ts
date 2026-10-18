import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch53-shared.js";

export type Input = Readonly<{ observedDiameterMicrometres: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedDiameterMicrometres",
    label: "Observed diameter micrometres",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  positive(i.observedDiameterMicrometres, "diameter");
  return {
    recordedDiameterMicrometres: i.observedDiameterMicrometres,
    sizeOnlySpeciesResolution: "indeterminate",
    reason:
      "E. histolytica and E. dispar cyst morphology and size overlap; no valid size-only discriminator.",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { observedDiameterMicrometres: 12 },
  output: {
    result: {
      recordedDiameterMicrometres: 12,
      sizeOnlySpeciesResolution: "indeterminate",
      reason:
        "E. histolytica and E. dispar cyst morphology and size overlap; no valid size-only discriminator.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/entamoeba-size-cutoff-classifier",
  title:
    "Entamoeba histolytica versus dispar Cyst Size Cutoff Micron Classifier",
  description:
    "Record cyst diameter and explicitly refuse the erroneous size-only histolytica/dispar classification premise.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedDiameterMicrometres: { type: "number" },
          sizeOnlySpeciesResolution: { type: "string" },
          reason: { type: "string" },
        },
        required: [
          "recordedDiameterMicrometres",
          "sizeOnlySpeciesResolution",
          "reason",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
