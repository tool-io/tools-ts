import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as fr,
  example as frExample,
} from "../grid-fr-unit-free-space-share/tool.js";
import {
  calculate as vars,
  example as varExample,
} from "../variable-fallback-chain-resolution/tool.js";
import {
  calculate as revert,
  example as revertExample,
} from "../revert-layer-cascade-order-lookup/tool.js";
import {
  calculate as unset,
  example as unsetExample,
} from "../all-unset-reset-behavior-lookup/tool.js";
import {
  calculate as custom,
  example as customExample,
} from "../custom-property-inherit-vs-initial/tool.js";
import {
  calculate as transition,
  example as transitionExample,
} from "../transition-total-duration-multi-property-sum/tool.js";
import {
  calculate as attr,
  example as attrExample,
} from "../attribute-selector-case-flag-i-lookup/tool.js";
import {
  calculate as blend,
  example as blendExample,
} from "../mix-blend-mode-difference-inversion-note/tool.js";
import {
  calculate as pointer,
  example as pointerExample,
} from "../pointer-events-none-hit-test-note/tool.js";
import {
  calculate as focus,
  example as focusExample,
} from "../focus-visible-vs-focus-ring-lookup/tool.js";
import {
  calculate as wrap,
  example as wrapExample,
} from "../shape-outside-float-wrap-note/tool.js";
import {
  calculate as printFit,
  example as printExample,
} from "../print-page-break-avoid-rules/tool.js";
import { calculate as contain } from "../contain-strictness-levels-lookup/tool.js";
import {
  calculate as order,
  example as orderExample,
} from "../transform-function-order-matters-note/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("keeps source item order while reporting dense visual backfill", () => {
    const r = calculate(example.input);
    expect(r.itemRowColumnStarts[2]).toEqual([0, 2]);
    expect(r.sourceOrderVisualInversion).toBe(true);
  });
  it("never wraps a spanning item across a row boundary", () => {
    const r = calculate({
      ...example.input,
      callerAutoPlacedItemColumnSpans: [3, 1, 3],
    });
    expect(r.itemRowColumnStarts).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
  });
  it("keeps zero fr factors unallocated", () => {
    const r = fr({ ...frExample.input, flexTrackFactors: [0, 0] });
    expect(r.initialFrSharesPx).toEqual([0, 0]);
    expect(r.unallocatedFreeSpacePx).toBe(70);
  });
  it("does not allocate negative free space to flexible tracks", () => {
    expect(
      fr({ ...frExample.input, definiteContainerPx: 10 }).initialFrSharesPx,
    ).toEqual([0, 0]);
  });
  it("rejects a deep fallback cycle instead of choosing a fallback token", () => {
    expect(() =>
      vars({
        ...varExample.input,
        variableNames: ["--a", "--b", "--c"],
        literalTokens: ["", "", ""],
        referencedVariables: ["--b", "--c", "--b"],
        fallbackTokens: ["red", "green", "blue"],
      }),
    ).toThrow();
  });
  it("resolves a missing nested reference from its own fallback", () => {
    expect(
      vars({
        ...varExample.input,
        literalTokens: ["", ""],
        referencedVariables: ["--b", "--missing"],
        fallbackTokens: ["outer", "inner"],
      }).resolvedToken,
    ).toBe("inner");
  });
  it("does not use fallback to replace an existing valid literal", () => {
    expect(
      vars({ ...varExample.input, fallbackTokens: ["blue", "green"] })
        .resolvedToken,
    ).toBe("red");
  });
  it("rejects contradictory literal and var-reference nodes", () => {
    expect(() =>
      vars({ ...varExample.input, literalTokens: ["red", "blue"] }),
    ).toThrow();
  });
  it("skips multiple normal revert-layer winners", () => {
    const r = revert({
      ...revertExample.input,
      callerOrderedLayerNames: ["a", "b", "c"],
      callerWinningTokens: ["red", "revert-layer", "revert-layer"],
    });
    expect(r.resolvedPriorLayerToken).toBe("red");
    expect(r.selectedLayerIndex).toBe(0);
  });
  it("reverses the predecessor direction for important layers", () => {
    const r = revert({
      ...revertExample.input,
      callerWinningTokens: ["red", "revert-layer", "blue"],
      currentLayerIndex: 1,
      importantDeclaration: true,
    });
    expect(r.resolvedPriorLayerToken).toBe("blue");
  });
  it("does not invent origin rollback when all prior layers revert", () => {
    expect(() =>
      revert({
        ...revertExample.input,
        callerWinningTokens: ["revert-layer", "revert-layer", "revert-layer"],
      }),
    ).toThrow();
  });
  it("excludes direction and unregistered custom properties from all:unset", () => {
    expect(
      unset({
        ...unsetExample.input,
        propertyNames: ["direction", "unicode-bidi", "--x"],
      }).resetActions,
    ).toEqual(["excluded", "excluded", "excluded"]);
  });
  it("uses registered initial token rather than guaranteed-invalid placeholder", () => {
    expect(custom({ ...customExample.input, isRegistered: true })).toEqual({
      resolvedCustomPropertyToken: "blue",
      guaranteedInvalid: false,
    });
  });
  it("does not add concurrent transition durations", () => {
    const r = transition({
      ...transitionExample.input,
      transitionDurationsSeconds: [2, 5],
      transitionDelaysSeconds: [0, 0],
    });
    expect(r.concurrentCompletionSeconds).toBe(5);
    expect(r.serialSumSeconds).toBe(7);
  });
  it("clips negative end times instead of producing negative completion", () => {
    expect(
      transition({
        ...transitionExample.input,
        transitionDelaysSeconds: [-10, -10],
      }).concurrentCompletionSeconds,
    ).toBe(0);
  });
  it("limits the attribute i flag to ASCII case folding", () => {
    expect(
      attr({
        ...attrExample.input,
        observedAttributeValue: "İ",
        selectorExpectedValue: "i",
      }).matchesEqualitySelector,
    ).toBe(false);
  });
  it("difference blend only inverts for a white source", () => {
    expect(
      blend({ ...blendExample.input, sourceEncodedChannels: [0.2, 0.5, 0.9] })
        .differenceEncodedChannels,
    ).toEqual([0, 0, 0]);
  });
  it("does not remove independent keyboard focus with pointer-events:none", () => {
    expect(pointer(pointerExample.input).keyboardFocusExcluded).toBe(false);
  });
  it("requires actual focus for focus-visible match", () => {
    expect(
      focus({
        ...focusExample.input,
        independentlyFocused: false,
        uaFocusVisibleMatch: true,
      }).focusVisibleSelectorMatches,
    ).toBe(false);
  });
  it("requires a float before shape-outside wrapping is eligible", () => {
    expect(
      wrap({ ...wrapExample.input, isFloat: false }).shapeWrapEligible,
    ).toBe(false);
  });
  it("does not promise avoidance for a block larger than a whole page", () => {
    expect(
      printFit({ ...printExample.input, observedBlockHeightPx: 201 })
        .avoidCanFitOnFreshPage,
    ).toBe(false);
  });
  it("rejects prototype-inherited lookup tokens", () => {
    expect(() => contain({ contain: "constructor" })).toThrow();
    expect(() => contain({ contain: "__proto__" })).toThrow();
  });
  it("shows noncommuting geometric transform operations", () => {
    const r = order(orderExample.input);
    expect(r.translateThenRotatePoint[1]).toBeCloseTo(11);
    expect(r.rotateThenTranslatePoint[0]).toBeCloseTo(10);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, callerAutoPlacedItemColumnSpans: [4] };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, densePacking: false };
    close(calculate(input), {
      itemRowColumnStarts: [
        [0, 0],
        [1, 0],
        [1, 2],
      ],
      sourceOrderVisualInversion: false,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        itemRowColumnStarts: [
          [0, 0],
          [1, 0],
          [1, 2],
        ],
        sourceOrderVisualInversion: false,
      });
  });
});
