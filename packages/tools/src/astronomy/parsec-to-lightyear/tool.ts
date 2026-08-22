import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const LIGHT_YEARS_PER_PARSEC = 3.2615637771674336;

export const parsecToLightYearTool = createSimpleTool({
  id: "astronomy/parsec-to-lightyear",
  title: "Parsec to Light Year Converter",
  description: "Convert a distance in parsecs to light years.",
  inputs: [
    {
      description: "Distance in parsecs.",
      id: "parsecs",
      label: "Parsecs",
      kind: "number",
      minimum: 0,
      unit: "pc",
    },
  ],
  outputs: [
    {
      description: "Distance in light years.",
      id: "lightYears",
      label: "Light years",
      kind: "number",
      unit: "ly",
    },
  ],
  calculate: (input) => {
    return { lightYears: (input.parsecs as number) * LIGHT_YEARS_PER_PARSEC };
  },
});
export const runParsecToLightYear = parsecToLightYearTool.execute;
export default parsecToLightYearTool;

export type ParsecToLightyearInput = {
  readonly parsecs: number;
};

export type ParsecToLightyearOutput = {
  readonly lightYears: number;
};

export const parsecToLightyearExample = {
  input: {
    parsecs: 1,
  },
  output: {
    lightYears: 3.2615637771674337,
  },
} satisfies ToolExample<ParsecToLightyearInput, ParsecToLightyearOutput>;
