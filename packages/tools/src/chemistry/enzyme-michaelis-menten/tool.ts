import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const enzymeMichaelisMentenTool = createSimpleTool({
  id: "chemistry/enzyme-michaelis-menten",
  title: "Michaelis-Menten Rate Calculator",
  description: "Compute Michaelis-Menten rate v = Vmax*S/(Km+S).",
  inputs: [
    { id: "vmax", label: "Vmax", kind: "number", minimum: 0 },
    { id: "substrateS", label: "[S]", kind: "number", minimum: 0 },
    { id: "km", label: "Km", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "velocityV", label: "Rate v", kind: "number" }],
  calculate: (input) => {
    const km = input.km as number;
    const substrate = input.substrateS as number;
    if (!(km > 0))
      simpleError("km", "Km must be greater than zero.", "invalid_km");
    return {
      velocityV: ((input.vmax as number) * substrate) / (km + substrate),
    };
  },
});
export default enzymeMichaelisMentenTool;
export const runEnzymeMichaelisMenten = enzymeMichaelisMentenTool.execute;

export type EnzymeMichaelisMentenInput = {
  readonly vmax: number;
  readonly substrateS: number;
  readonly km: number;
};

export type EnzymeMichaelisMentenOutput = {
  readonly velocityV: number;
};

export const enzymeMichaelisMentenExample = {
  input: {
    vmax: 1,
    substrateS: 1,
    km: 1,
  },
  output: {
    velocityV: 0.5,
  },
} satisfies ToolExample<
  EnzymeMichaelisMentenInput,
  EnzymeMichaelisMentenOutput
>;
