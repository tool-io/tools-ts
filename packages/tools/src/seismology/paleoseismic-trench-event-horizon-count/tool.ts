import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const paleoseismicTrenchEventHorizonCountExample = {
  input: { eventFlags: ["unit", "event", "fissure", "unit", "event", "unit"] },
  output: { eventCount: 2, unitCount: 3 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const paleoseismicTrenchEventHorizonCountTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eventFlags }) => {
      const fs = eventFlags as unknown[];
      if (!Array.isArray(fs) || fs.length === 0)
        simpleError("eventFlags", "Provide stratigraphic flags.");
      const arr = fs as string[];
      let eventCount = 0;
      let unitCount = 0;
      for (const f of arr) {
        const key = f.toLowerCase();
        if (key === "event") eventCount++;
        else if (key === "unit") unitCount++;
      }
      return { eventCount, unitCount };
    })(input as never) as Record<string, unknown>,
  description:
    "Count earthquake event horizons between dated units from trench stratigraphy flags.",
  id: "seismology/paleoseismic-trench-event-horizon-count",
  inputs: [
    {
      description: "Stratigraphic flags in order (event/unit/fissure).",
      id: "eventFlags",
      kind: "stringList",
      label: "flags",
    },
  ],
  outputs: [
    {
      description: "Number of event horizons identified.",
      id: "eventCount",
      kind: "number",
      label: "N_ev",
    },
    {
      description: "Number of depositional units.",
      id: "unitCount",
      kind: "number",
      label: "N_u",
    },
  ],
  title: "Paleoseismic Trench Event Horizon Count Tool",
});
export const runPaleoseismicTrenchEventHorizonCount =
  paleoseismicTrenchEventHorizonCountTool.execute;
export { paleoseismicTrenchEventHorizonCountExample as example };
export default paleoseismicTrenchEventHorizonCountTool;
