import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const plusMinusDelayTimeRefractionMethodExample = {
  input: { interceptTimeS: 0.12, v1MS: 2000, v2MS: 4000 },
  output: { interfaceDepthM: 138.5640646055102, delayTimeS: 0.06 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const plusMinusDelayTimeRefractionMethodTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ interceptTimeS, v1MS, v2MS }) => {
      if (!(interceptTimeS > 0) || !(v1MS > 0))
        simpleError(
          "interceptTimeS",
          "Intercept time and overburden velocity must be positive.",
        );
      if (v2MS <= v1MS)
        simpleError("v2MS", "Refractor must be faster than the overburden.");
      const cosIc = Math.sqrt(1 - (v1MS / v2MS) ** 2);
      return {
        interfaceDepthM: (interceptTimeS * v1MS) / (2 * cosIc),
        delayTimeS: interceptTimeS / 2,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Intercept/delay-time method: recover interface depth from the reversed-profile intercept time t_i = 2h·cos(i_c)/V₁.",
  id: "seismology/plus-minus-delay-time-refraction-method",
  inputs: [
    {
      minimum: 0,
      description: "Head-wave intercept time.",
      id: "interceptTimeS",
      kind: "number",
      label: "t_i",
      unit: "s",
    },
    {
      minimum: 0,
      description: "Overburden velocity.",
      id: "v1MS",
      kind: "number",
      label: "V₁",
      unit: "m/s",
    },
    {
      minimum: 0,
      description: "Refractor velocity.",
      id: "v2MS",
      kind: "number",
      label: "V₂",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Interface depth beneath the shot.",
      id: "interfaceDepthM",
      kind: "number",
      label: "h",
      unit: "m",
    },
    {
      description: "One-way delay time.",
      id: "delayTimeS",
      kind: "number",
      label: "τ",
      unit: "s",
    },
  ],
  title: "Plus Minus Delay Time Refraction Method Tool",
});
export const runPlusMinusDelayTimeRefractionMethod =
  plusMinusDelayTimeRefractionMethodTool.execute;
export { plusMinusDelayTimeRefractionMethodExample as example };
export default plusMinusDelayTimeRefractionMethodTool;
