import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bleedingTimeExample = {
  input: { minutes: 5 },
  output: { category: "normal" },
} satisfies ToolExample<
  { readonly minutes: number },
  { readonly category: string }
>;

export const bleedingTimeTool = createSimpleTool({
  id: "biology/bleeding-time",
  title: "Bleeding Time Category",
  description:
    "Classify a bleeding time in minutes up to 30 as normal (<= 7), borderline (<= 15), or prolonged.",
  inputs: [
    {
      id: "minutes",
      label: "Bleeding time",
      kind: "number",
      maximum: 30,
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [{ id: "category", label: "Category", kind: "string" }],
  calculate: (input) => {
    const minutes = input.minutes as number;
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 30)
      simpleError(
        "minutes",
        "Bleeding time must be a finite number between 0 and 30 min.",
        "invalid_minutes",
      );
    return {
      category:
        minutes <= 7 ? "normal" : minutes <= 15 ? "borderline" : "prolonged",
    };
  },
});
export const runBleedingTime = bleedingTimeTool.execute;
export default bleedingTimeTool;
