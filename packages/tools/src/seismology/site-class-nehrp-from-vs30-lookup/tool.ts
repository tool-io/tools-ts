import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const siteClassNehrpFromVs30LookupExample = {
  input: { vs30MS: 500 },
  output: { siteClass: "C", description: "Very dense soil and soft rock" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const siteClassNehrpFromVs30LookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ vs30MS }) => {
      if (!(vs30MS > 0)) simpleError("vs30MS", "VS30 must be positive.");
      if (vs30MS > 1500) return { siteClass: "A", description: "Hard rock" };
      if (vs30MS > 760) return { siteClass: "B", description: "Rock" };
      if (vs30MS > 360)
        return { siteClass: "C", description: "Very dense soil and soft rock" };
      if (vs30MS > 180) return { siteClass: "D", description: "Stiff soil" };
      return { siteClass: "E", description: "Soft clay soil" };
    })(input as never) as Record<string, unknown>,
  description: "NEHRP site class (A–E) from time-averaged shear velocity.",
  id: "seismology/site-class-nehrp-from-vs30-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Time-averaged shear velocity in the top 30 m.",
      id: "vs30MS",
      kind: "number",
      label: "VS30",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "NEHRP site class letter.",
      id: "siteClass",
      kind: "string",
      label: "Class",
    },
    {
      description: "Soil/rock description for the class.",
      id: "description",
      kind: "string",
      label: "Description",
    },
  ],
  title: "Site Class NEHRP From VS30 Lookup",
});
export const runSiteClassNehrpFromVs30Lookup =
  siteClassNehrpFromVs30LookupTool.execute;
export { siteClassNehrpFromVs30LookupExample as example };
export default siteClassNehrpFromVs30LookupTool;
