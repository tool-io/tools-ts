import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const BackTitrationTool = createSimpleTool({
  id: "chemistry/back-titration",
  title: "Back Titration Calculator",
  description: "Compute analyte moles from excess titrant back-titration.",
  inputs: [
    {
      id: "initialTitrantMoles",
      label: "Initial moles added",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      id: "backTitrantMoles",
      label: "Back-titration moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
  ],
  outputs: [
    { id: "analyteMoles", label: "Analyte moles", kind: "number", unit: "mol" },
  ],
  calculate: (input) => {
    if (
      (input.backTitrantMoles as number) > (input.initialTitrantMoles as number)
    )
      simpleError(
        "backTitrantMoles",
        "Back-titrant moles cannot exceed the initial excess-titrant moles for a 1:1 reaction.",
        "invalid_back_titration",
      );
    return {
      analyteMoles:
        (input.initialTitrantMoles as number) -
        (input.backTitrantMoles as number),
    };
  },
});
export default BackTitrationTool;
export const runBackTitration = BackTitrationTool.execute;

export type BackTitrationInput = {
  readonly initialTitrantMoles: number;
  readonly backTitrantMoles: number;
};

export type BackTitrationOutput = {
  readonly analyteMoles: number;
};

export const backTitrationExample = {
  input: {
    initialTitrantMoles: 1,
    backTitrantMoles: 1,
  },
  output: {
    analyteMoles: 0,
  },
} satisfies ToolExample<BackTitrationInput, BackTitrationOutput>;
