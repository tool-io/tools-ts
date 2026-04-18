import { describe, expect, it } from 'vitest';

import { createMeasurementSizeTable, measurementSizeConfigs, recommendMeasurementSize } from './tool.js';

describe('measurement-based size tools', () => {
  it('provides a valid default calculation for every configured tool', () => {
    for (const config of Object.values(measurementSizeConfigs)) {
      const values = Object.fromEntries(Object.entries(config.fields).map(([field, definition]) => [field, definition.defaultCm]));
      const result = recommendMeasurementSize(config.kind, { unit: 'cm', values });
      expect(result.ok, config.kind).toBe(true);
      if (!result.ok) continue;
      expect(result.output.primary).not.toBe('');
      expect(result.output.equivalents.length).toBeGreaterThan(0);
    }
  });

  it('converts inch inputs to centimetres', () => {
    const result = recommendMeasurementSize('watch-band', { unit: 'in', values: { wrist: 7 } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.measurementsCm.wrist).toBeCloseTo(17.78);
  });

  it('converts US customary mass inputs to kilograms', () => {
    const result = recommendMeasurementSize('life-jacket', { unit: 'in', values: { chest: 40, bodyWeight: 176.37 } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.measurementsCm.chest).toBeCloseTo(101.6);
    expect(result.output.measurementsCm.bodyWeight).toBeCloseTo(80, 1);
  });

  it('calculates garment and ring recommendations', () => {
    const shirt = recommendMeasurementSize('t-shirt', { values: { chest: 102 } });
    const ring = recommendMeasurementSize('ring', { values: { circumference: 5.44 } });
    expect(shirt.ok && shirt.output.primary).toBe('L');
    expect(ring.ok && ring.output.primary).toBe('ISO / EU 54');
  });

  it('keeps historical and safety equipment output explicitly measurement based', () => {
    const historical = recommendMeasurementSize('kimono-reconstruction', { values: { chest: 96, height: 175, sleeve: 78 } });
    const safety = recommendMeasurementSize('climbing-harness', { values: { thigh: 58, waist: 82 } });
    expect(historical.ok && historical.output.primary).toBe('Made-to-measure reconstruction');
    expect(safety.ok && safety.output.primary).toBe('Measurement-based fit profile');
  });

  it('updates jeans output when the waist changes', () => {
    const smaller = recommendMeasurementSize('jeans', { values: { waist: 76.2, hip: 95, inseam: 81 } });
    const larger = recommendMeasurementSize('jeans', { values: { waist: 101.6, hip: 115, inseam: 81 } });
    expect(smaller.ok && smaller.output.primary).toBe('W30');
    expect(larger.ok && larger.output.primary).toBe('W40');
  });

  it('builds specialized comparison tables and highlights the current row', () => {
    const jeans = createMeasurementSizeTable('jeans', { waist: 86 });
    const rings = createMeasurementSizeTable('ring', { circumference: 5.44 });
    expect(jeans).toHaveLength(27);
    expect(jeans.some((row) => row.selected)).toBe(true);
    expect(rings).toHaveLength(19);
    expect(rings.some((row) => row.selected)).toBe(true);
  });

  it('uses tool-specific measurements instead of generic body placeholders', () => {
    expect(Object.values(measurementSizeConfigs).filter((config) => 'body' in config.fields)).toEqual([]);
    expect(Object.keys(measurementSizeConfigs.choker.fields)).toEqual(['neck', 'ease']);
    expect(Object.keys(measurementSizeConfigs.bracelet.fields)).toEqual(['wrist', 'ease']);
    expect(Object.keys(measurementSizeConfigs.jeans.fields)).toEqual(['waist', 'hip', 'inseam']);
    expect(measurementSizeConfigs['life-jacket'].fields.bodyWeight?.quantity).toBe('mass');
    expect(Object.keys(measurementSizeConfigs['dog-shoe'].fields)).toEqual(['pawWidth', 'pawLength']);
  });

  it('calculates choker and bracelet finished lengths', () => {
    const choker = recommendMeasurementSize('choker', { values: { neck: 34, ease: 2 } });
    const bracelet = recommendMeasurementSize('bracelet', { values: { wrist: 17, ease: 1 } });
    expect(choker.ok && choker.output.primary).toBe('36 cm choker length');
    expect(bracelet.ok && bracelet.output.primary).toBe('18 cm finished length');
  });

  it('rejects missing, non-finite, and implausible measurements', () => {
    expect(recommendMeasurementSize('belt', { values: {} }).ok).toBe(false);
    expect(recommendMeasurementSize('belt', { values: { waist: Infinity } }).ok).toBe(false);
    expect(recommendMeasurementSize('belt', { values: { waist: 2 } }).ok).toBe(false);
  });
});
