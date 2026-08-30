import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const layouts = {
  typeA: {
    hourLayout: "large Arabic hour numerals 1 through 11 around the main dial",
    minuteTrack: "conventional minute divisions around the perimeter",
    twelveOClock: "triangle with two dots",
  },
  typeB: {
    hourLayout: "smaller hour scale on an inner ring",
    minuteTrack: "prominent outer minute scale labeled 5 through 55",
    twelveOClock: "triangle or arrow without the two-dot Type A arrangement",
  },
} as const;

export type FliegerDialLayout = keyof typeof layouts;

export type FliegerLayoutLookupInput = {
  readonly dialLayout: FliegerDialLayout;
};

export type FliegerLayoutLookupOutput = {
  readonly attributionCaution: string;
  readonly dialLayout: FliegerDialLayout;
  readonly hourLayout: string;
  readonly minuteTrack: string;
  readonly twelveOClock: string;
};

export const lookupFliegerDialLayout = (
  input: FliegerLayoutLookupInput,
): FliegerLayoutLookupOutput => {
  const layout = layouts[input.dialLayout];
  if (layout === undefined)
    simpleError(
      "dialLayout",
      "Flieger dial layout is not supported.",
      "unsupported_dial_layout",
    );
  return {
    attributionCaution:
      "Type A and Type B describe the historical dial arrangements, not proof that a modern watch is an original wartime B-Uhr or FL 23883 piece.",
    dialLayout: input.dialLayout,
    ...layout,
  };
};

export const fliegerLayoutExample = {
  input: { dialLayout: "typeB" },
  output: {
    attributionCaution:
      "Type A and Type B describe the historical dial arrangements, not proof that a modern watch is an original wartime B-Uhr or FL 23883 piece.",
    dialLayout: "typeB",
    hourLayout: "smaller hour scale on an inner ring",
    minuteTrack: "prominent outer minute scale labeled 5 through 55",
    twelveOClock: "triangle or arrow without the two-dot Type A arrangement",
  },
} satisfies ToolExample<FliegerLayoutLookupInput, FliegerLayoutLookupOutput>;

export const fliegerLayoutTool = createSimpleTool({
  calculate: (input) =>
    lookupFliegerDialLayout({
      dialLayout: input.dialLayout as FliegerDialLayout,
    }),
  description:
    "Identify the historical Type A or Type B Flieger hour layout, minute track, and 12 o'clock treatment without claiming original B-Uhr provenance.",
  id: "horology/flieger-dial-layout-lookup",
  inputs: [
    {
      enum: ["typeA", "typeB"],
      id: "dialLayout",
      kind: "string",
      label: "Panzer Flieger dial layout",
    },
  ],
  outputs: [
    { id: "attributionCaution", kind: "string", label: "Attribution caution" },
    { id: "dialLayout", kind: "string", label: "Panzer Flieger dial layout" },
    { id: "hourLayout", kind: "string", label: "Hour-scale layout" },
    { id: "minuteTrack", kind: "string", label: "Minute-track layout" },
    { id: "twelveOClock", kind: "string", label: "12 o'clock treatment" },
  ],
  title: "Flieger Dial Layout Lookup",
});

export const runFliegerLayout = fliegerLayoutTool.execute;
export default fliegerLayoutTool;
