import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const clearanceCreatinineExample = {
  input: {
    collectionMinutes: 120,
    plasmaCreatinineMgDl: 1,
    urineCreatinineMgDl: 60,
    urineVolumeMl: 60,
  },
  output: { creatinineClearanceMlMin: 30 },
} satisfies ToolExample<
  {
    readonly collectionMinutes: number;
    readonly plasmaCreatinineMgDl: number;
    readonly urineCreatinineMgDl: number;
    readonly urineVolumeMl: number;
  },
  { readonly creatinineClearanceMlMin: number }
>;

export const clearanceCreatinineTool = createSimpleTool({
  id: "biology/clearance-creatinine",
  title: "Creatinine-Based Clearance",
  description:
    "Compute renal creatinine clearance as urine volume times urine creatinine divided by plasma creatinine and the collection time in minutes.",
  inputs: [
    {
      description: "Total urine volume collected; must be greater than zero.",
      id: "urineVolumeMl",
      label: "Urine volume",
      kind: "number",
      unit: "mL",
    },
    {
      description: "Urine creatinine concentration; must be greater than zero.",
      id: "urineCreatinineMgDl",
      label: "Urine creatinine",
      kind: "number",
      unit: "mg/dL",
    },
    {
      description:
        "Plasma creatinine concentration; must be greater than zero.",
      id: "plasmaCreatinineMgDl",
      label: "Plasma creatinine",
      kind: "number",
      unit: "mg/dL",
    },
    {
      description: "Collection period length; must be greater than zero.",
      id: "collectionMinutes",
      label: "Collection time",
      kind: "number",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Creatinine clearance in millilitres per minute.",
      id: "creatinineClearanceMlMin",
      label: "Creatinine clearance",
      kind: "number",
      unit: "mL/min",
    },
  ],
  calculate: (input) => {
    const collectionMinutes = input.collectionMinutes as number;
    const plasmaCreatinineMgDl = input.plasmaCreatinineMgDl as number;
    const urineCreatinineMgDl = input.urineCreatinineMgDl as number;
    const urineVolumeMl = input.urineVolumeMl as number;
    if (!(urineVolumeMl > 0))
      simpleError(
        "urineVolumeMl",
        "The urine volume must be greater than zero.",
        "invalid_volume",
      );
    if (!(urineCreatinineMgDl > 0))
      simpleError(
        "urineCreatinineMgDl",
        "The urine creatinine must be greater than zero.",
        "invalid_urine_creatinine",
      );
    if (!(plasmaCreatinineMgDl > 0))
      simpleError(
        "plasmaCreatinineMgDl",
        "The plasma creatinine must be greater than zero.",
        "invalid_plasma_creatinine",
      );
    if (!(collectionMinutes > 0))
      simpleError(
        "collectionMinutes",
        "The collection time must be greater than zero.",
        "invalid_collection_time",
      );
    return {
      creatinineClearanceMlMin:
        (urineVolumeMl * urineCreatinineMgDl) /
        (plasmaCreatinineMgDl * collectionMinutes),
    };
  },
});
export const runClearanceCreatinine = clearanceCreatinineTool.execute;
export default clearanceCreatinineTool;
