import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const eurocode8GroundTypeLookupExample = {
  input: { vs30MS: 800 },
  output: {
    description: "Deposits of very dense sand, gravel or very stiff clay",
    groundType: "B",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const eurocode8GroundTypeLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ vs30MS }) => {
      if (!(vs30MS > 0)) simpleError("vs30MS", "VS30 must be positive.");
      if (vs30MS > 800)
        return {
          groundType: "A",
          description: "Rock or other rock-like geological formation",
        };
      if (vs30MS >= 360)
        return {
          groundType: "B",
          description: "Deposits of very dense sand, gravel or very stiff clay",
        };
      if (vs30MS >= 180)
        return {
          groundType: "C",
          description:
            "Deep deposits of dense or medium-dense sand, gravel or stiff clay",
        };
      return {
        groundType: "D",
        description:
          "Deposits of loose-to-medium cohesionless soil or soft-to-firm cohesive soil; type E cannot be inferred from VS30 alone because it requires a soft surface layer over stiffer material",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "EN 1998-1 Table 3.1 ground type from VS30: >800 m/s A, 360–800 B, 180–360 C, and <180 D. Type E is not inferred because its definition requires stratigraphic information beyond VS30.",
  id: "seismology/eurocode-8-ground-type-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Average shear velocity, top 30 m.",
      id: "vs30MS",
      kind: "number",
      label: "VS30",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Eurocode 8 ground type inferred from VS30 (A–D).",
      id: "groundType",
      kind: "string",
      label: "Type",
    },
    {
      description: "Ground description.",
      id: "description",
      kind: "string",
      label: "Description",
    },
  ],
  title: "Eurocode 8 Ground Type Lookup",
});
export const runEurocode8GroundTypeLookup =
  eurocode8GroundTypeLookupTool.execute;
export { eurocode8GroundTypeLookupExample as example };
export default eurocode8GroundTypeLookupTool;
