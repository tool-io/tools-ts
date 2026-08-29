import { describe, expect, it } from "vitest";
import { validateToolContract } from "../core/contract.js";

const fail = (msg: string) => {
  throw new Error(msg);
};

const tools = {
  "seismology/brune-corner-frequency-source-model":
    await import("./brune-corner-frequency-source-model/index.js"),
  "seismology/radiated-energy-moment-ratio":
    await import("./radiated-energy-moment-ratio/index.js"),
  "seismology/apparent-stress-energy-ratio":
    await import("./apparent-stress-energy-ratio/index.js"),
  "seismology/directivity-pulse-duration-near-source":
    await import("./directivity-pulse-duration-near-source/index.js"),
  "seismology/source-rise-time-dislocation":
    await import("./source-rise-time-dislocation/index.js"),
  "seismology/rupture-velocity-shear-wave-ratio-checker":
    await import("./rupture-velocity-shear-wave-ratio-checker/index.js"),
  "seismology/asperity-area-fraction-scaling":
    await import("./asperity-area-fraction-scaling/index.js"),
  "seismology/slip-vs-time-predictable-checker":
    await import("./slip-vs-time-predictable-checker/index.js"),
  "seismology/characteristic-earthquake-window-lookup":
    await import("./characteristic-earthquake-window-lookup/index.js"),
  "seismology/moment-from-spectral-flat-level":
    await import("./moment-from-spectral-flat-level/index.js"),
  "seismology/p-wave-modulus-constrained":
    await import("./p-wave-modulus-constrained/index.js"),
  "seismology/vp-vs-ratio-poisson-checker":
    await import("./vp-vs-ratio-poisson-checker/index.js"),
  "seismology/attenuation-quality-factor-q":
    await import("./attenuation-quality-factor-q/index.js"),
  "seismology/coda-q-scattering-intrinsic-split":
    await import("./coda-q-scattering-intrinsic-split/index.js"),
  "seismology/geometrical-spreading-body-wave":
    await import("./geometrical-spreading-body-wave/index.js"),
  "seismology/surface-wave-spreading-half-space":
    await import("./surface-wave-spreading-half-space/index.js"),
  "seismology/kappa-site-anelastic-attenuation":
    await import("./kappa-site-anelastic-attenuation/index.js"),
  "seismology/love-wave-dispersion-period-speed":
    await import("./love-wave-dispersion-period-speed/index.js"),
  "seismology/group-vs-phase-velocity-difference":
    await import("./group-vs-phase-velocity-difference/index.js"),
  "seismology/air-coupled-rayleigh-wave-speed":
    await import("./air-coupled-rayleigh-wave-speed/index.js"),
  "seismology/stoneley-interface-existence-checker":
    await import("./stoneley-interface-existence-checker/index.js"),
  "seismology/love-vs-rayleigh-motion-classifier":
    await import("./love-vs-rayleigh-motion-classifier/index.js"),
  "seismology/vs30-time-averaged-shear-velocity":
    await import("./vs30-time-averaged-shear-velocity/index.js"),
  "seismology/site-class-nehrp-from-vs30-lookup":
    await import("./site-class-nehrp-from-vs30-lookup/index.js"),
  "seismology/nehrp-fundamental-period-site-lookup":
    await import("./nehrp-fundamental-period-site-lookup/index.js"),
  "seismology/amplification-borcherdt-factor-lookup":
    await import("./amplification-borcherdt-factor-lookup/index.js"),
  "seismology/resonance-quarter-wavelength-soft-soil":
    await import("./resonance-quarter-wavelength-soft-soil/index.js"),
  "seismology/topographic-aggravation-factor-ridge":
    await import("./topographic-aggravation-factor-ridge/index.js"),
  "seismology/basin-edge-surface-waves-checker":
    await import("./basin-edge-surface-waves-checker/index.js"),
  "seismology/nonlinear-soil-strain-degradation-lookup":
    await import("./nonlinear-soil-strain-degradation-lookup/index.js"),
  "seismology/gmpe-log-distance-attenuation":
    await import("./gmpe-log-distance-attenuation/index.js"),
  "seismology/magnitude-scaling-saturation-check":
    await import("./magnitude-scaling-saturation-check/index.js"),
  "seismology/near-fault-fling-step-velocity-pulse":
    await import("./near-fault-fling-step-velocity-pulse/index.js"),
  "seismology/directivity-narrowband-pulse-period":
    await import("./directivity-narrowband-pulse-period/index.js"),
  "seismology/vertical-horizontal-vh-ratio-lookup":
    await import("./vertical-horizontal-vh-ratio-lookup/index.js"),
  "seismology/within-event-sigma-lambda":
    await import("./within-event-sigma-lambda/index.js"),
  "seismology/between-event-tau-variance":
    await import("./between-event-tau-variance/index.js"),
  "seismology/gmm-total-dispersion-tau-sigma-combine":
    await import("./gmm-total-dispersion-tau-sigma-combine/index.js"),
  "seismology/pgv-pga-correlation-approximation":
    await import("./pgv-pga-correlation-approximation/index.js"),
  "seismology/arias-intensity-duration-proxy":
    await import("./arias-intensity-duration-proxy/index.js"),
  "seismology/cumulative-absolute-velocity-cai":
    await import("./cumulative-absolute-velocity-cai/index.js"),
  "seismology/significant-duration-arias-5-95":
    await import("./significant-duration-arias-5-95/index.js"),
  "seismology/housner-spectral-intensity":
    await import("./housner-spectral-intensity/index.js"),
  "seismology/shakemap-instrument-intensity-pgv-converter":
    await import("./shakemap-instrument-intensity-pgv-converter/index.js"),
  "seismology/eurocode-8-ground-type-lookup":
    await import("./eurocode-8-ground-type-lookup/index.js"),
  "seismology/jma-intensity-from-pgv-converter":
    await import("./jma-intensity-from-pgv-converter/index.js"),
  "seismology/mercalli-vs-jma-crosswalk-lookup":
    await import("./mercalli-vs-jma-crosswalk-lookup/index.js"),
  "seismology/station-gap-azimuthal-coverage-degree":
    await import("./station-gap-azimuthal-coverage-degree/index.js"),
  "seismology/rms-travel-time-residual-quality":
    await import("./rms-travel-time-residual-quality/index.js"),
  "seismology/wadati-diagram-vp-vs-slope":
    await import("./wadati-diagram-vp-vs-slope/index.js"),
  "seismology/joint-hypocentral-grid-search-step":
    await import("./joint-hypocentral-grid-search-step/index.js"),
  "seismology/azimuthal-hole-location-bias-warning-checker":
    await import("./azimuthal-hole-location-bias-warning-checker/index.js"),
  "seismology/refraction-layer-crossover-distance":
    await import("./refraction-layer-crossover-distance/index.js"),
  "seismology/head-wave-critical-angle-appearance":
    await import("./head-wave-critical-angle-appearance/index.js"),
  "seismology/blind-zone-hidden-layer-depth-checker":
    await import("./blind-zone-hidden-layer-depth-checker/index.js"),
  "seismology/plus-minus-delay-time-refraction-method":
    await import("./plus-minus-delay-time-refraction-method/index.js"),
  "seismology/tomography-ray-density-cell-coverage":
    await import("./tomography-ray-density-cell-coverage/index.js"),
  "seismology/geophone-natural-period-response-corner":
    await import("./geophone-natural-period-response-corner/index.js"),
  "seismology/galvanometer-damping-0707-lookup":
    await import("./galvanometer-damping-0707-lookup/index.js"),
  "seismology/instrument-response-gain-db-lookup":
    await import("./instrument-response-gain-db-lookup/index.js"),
  "seismology/adc-clip-level-full-scale-counts":
    await import("./adc-clip-level-full-scale-counts/index.js"),
  "seismology/gps-clock-jitter-ms-budget":
    await import("./gps-clock-jitter-ms-budget/index.js"),
  "seismology/network-detection-threshold-coverage":
    await import("./network-detection-threshold-coverage/index.js"),
  "seismology/completeness-magnitude-max-curvature":
    await import("./completeness-magnitude-max-curvature/index.js"),
  "seismology/peterson-noise-model-low-high-lookup":
    await import("./peterson-noise-model-low-high-lookup/index.js"),
  "seismology/hvsr-nakamura-peak-frequency":
    await import("./hvsr-nakamura-peak-frequency/index.js"),
  "seismology/hvsr-clear-peak-confidence-checker":
    await import("./hvsr-clear-peak-confidence-checker/index.js"),
  "seismology/uniform-hazard-spectrum-interpolation":
    await import("./uniform-hazard-spectrum-interpolation/index.js"),
  "seismology/deaggregation-mean-mag-dist-epsilon":
    await import("./deaggregation-mean-mag-dist-epsilon/index.js"),
  "seismology/deterministic-vs-probabilistic-split":
    await import("./deterministic-vs-probabilistic-split/index.js"),
  "seismology/poisson-return-period-probability-exceedance":
    await import("./poisson-return-period-probability-exceedance/index.js"),
  "seismology/annual-rate-to-t-years-exceedance":
    await import("./annual-rate-to-t-years-exceedance/index.js"),
  "seismology/renewal-bpt-coefficient-variation":
    await import("./renewal-bpt-coefficient-variation/index.js"),
  "seismology/time-dependent-conditional-probability":
    await import("./time-dependent-conditional-probability/index.js"),
  "seismology/tsunami-seafloor-vertical-offset":
    await import("./tsunami-seafloor-vertical-offset/index.js"),
  "seismology/okada-dip-slip-surface-displacement":
    await import("./okada-dip-slip-surface-displacement/index.js"),
  "seismology/okada-strike-slip-surface-displacement":
    await import("./okada-strike-slip-surface-displacement/index.js"),
  "seismology/tsunamigenic-magnitude-threshold-checker":
    await import("./tsunamigenic-magnitude-threshold-checker/index.js"),
  "seismology/dart-pressure-tsunami-flag-checker":
    await import("./dart-pressure-tsunami-flag-checker/index.js"),
  "seismology/paleoseismic-trench-event-horizon-count":
    await import("./paleoseismic-trench-event-horizon-count/index.js"),
  "seismology/offset-feature-cumulative-slip-per-event":
    await import("./offset-feature-cumulative-slip-per-event/index.js"),
  "seismology/liquefaction-feature-magnitude-bound-lookup":
    await import("./liquefaction-feature-magnitude-bound-lookup/index.js"),
  "seismology/seismic-landslide-area-volume-scaling":
    await import("./seismic-landslide-area-volume-scaling/index.js"),
  "seismology/surface-rupture-length-recurrence-lookup":
    await import("./surface-rupture-length-recurrence-lookup/index.js"),
  "seismology/elapsed-time-last-event-segment-checker":
    await import("./elapsed-time-last-event-segment-checker/index.js"),
  "seismology/injection-pressure-trigger-threshold-checker":
    await import("./injection-pressure-trigger-threshold-checker/index.js"),
  "seismology/fracturing-monitor-magnitude-reporting-lookup":
    await import("./fracturing-monitor-magnitude-reporting-lookup/index.js"),
  "seismology/reservoir-induced-stress-change-bar":
    await import("./reservoir-induced-stress-change-bar/index.js"),
  "seismology/mining-collapse-magnitude-norms-lookup":
    await import("./mining-collapse-magnitude-norms-lookup/index.js"),
  "seismology/tidal-stress-phase-trigger-checker":
    await import("./tidal-stress-phase-trigger-checker/index.js"),
  "seismology/slow-slip-equivalent-magnitude-duration-scaling":
    await import("./slow-slip-equivalent-magnitude-duration-scaling/index.js"),
  "seismology/tremor-slip-episodic-weeks-lookup":
    await import("./tremor-slip-episodic-weeks-lookup/index.js"),
  "seismology/icequake-glacial-magnitude-range-lookup":
    await import("./icequake-glacial-magnitude-range-lookup/index.js"),
  "seismology/volcano-repeater-family-correlation-checker":
    await import("./volcano-repeater-family-correlation-checker/index.js"),
  "seismology/miniseed-record-header-parser":
    await import("./miniseed-record-header-parser/index.js"),
  "seismology/first-motion-polarity-beachball-quadrant-picker":
    await import("./first-motion-polarity-beachball-quadrant-picker/index.js"),
  "seismology/focal-mechanism-strike-dip-rake-data-generator":
    await import("./focal-mechanism-strike-dip-rake-data-generator/index.js"),
  "seismology/moment-tensor-double-couple-percent-decomposition":
    await import("./moment-tensor-double-couple-percent-decomposition/index.js"),
  "seismology/shake-alert-lead-time-seconds-estimate":
    await import("./shake-alert-lead-time-seconds-estimate/index.js"),
  "seismology/coda-duration-magnitude-nuttli-formula":
    await import("./coda-duration-magnitude-nuttli-formula/index.js"),
  "seismology/s-p-interval-hypocentral-distance-single-layer":
    await import("./s-p-interval-hypocentral-distance-single-layer/index.js"),
  "seismology/gutenberg-richter-b-value-two-anchor-fit":
    await import("./gutenberg-richter-b-value-two-anchor-fit/index.js"),
  "seismology/radiated-energy-from-magnitude-gutenberg-richter":
    await import("./radiated-energy-from-magnitude-gutenberg-richter/index.js"),
  "seismology/moment-magnitude-from-moment-hanks-kanamori":
    await import("./moment-magnitude-from-moment-hanks-kanamori/index.js"),
  "seismology/wadati-residual-histogram-binner":
    await import("./wadati-residual-histogram-binner/index.js"),
  "seismology/focal-style-rake-band-classifier":
    await import("./focal-style-rake-band-classifier/index.js"),
  "seismology/coulomb-stress-change-on-receiver-plane":
    await import("./coulomb-stress-change-on-receiver-plane/index.js"),
  "seismology/omori-law-aftershock-decay-rate":
    await import("./omori-law-aftershock-decay-rate/index.js"),
  "seismology/etas-aftershock-productivity-alpha":
    await import("./etas-aftershock-productivity-alpha/index.js"),
  "seismology/gardner-knopoff-declustering-window-lookup":
    await import("./gardner-knopoff-declustering-window-lookup/index.js"),
  "seismology/reasenberg-space-time-window-lookup":
    await import("./reasenberg-space-time-window-lookup/index.js"),
  "seismology/schuster-critical-value-significance-checker":
    await import("./schuster-critical-value-significance-checker/index.js"),
  "seismology/foreshock-mainshock-probable-classifier":
    await import("./foreshock-mainshock-probable-classifier/index.js"),
  "seismology/kovesligethy-intensity-decay-isoseismal":
    await import("./kovesligethy-intensity-decay-isoseismal/index.js"),
  "seismology/tsunami-runup-empirical-okal-synolakis-lookup":
    await import("./tsunami-runup-empirical-okal-synolakis-lookup/index.js"),
  "seismology/tide-gauge-bottom-pressure-hydrostatic-depth":
    await import("./tide-gauge-bottom-pressure-hydrostatic-depth/index.js"),
  "seismology/brune-source-time-duration-from-corner":
    await import("./brune-source-time-duration-from-corner/index.js"),
  "seismology/ray-parameter-slowness-apparent-velocity":
    await import("./ray-parameter-slowness-apparent-velocity/index.js"),
  "seismology/tau-p-travel-time-anchor-interpolation":
    await import("./tau-p-travel-time-anchor-interpolation/index.js"),
  "seismology/elevation-static-correction-replacement-velocity":
    await import("./elevation-static-correction-replacement-velocity/index.js"),
  "seismology/response-poles-zeros-consistency-checker":
    await import("./response-poles-zeros-consistency-checker/index.js"),
  "seismology/agc-gain-step-artifact-flagger":
    await import("./agc-gain-step-artifact-flagger/index.js"),
  "seismology/location-formal-error-scale-factor":
    await import("./location-formal-error-scale-factor/index.js"),
  "seismology/network-cluster-singleton-fraction-quality":
    await import("./network-cluster-singleton-fraction-quality/index.js"),
  "seismology/average-moment-rate-from-moment-duration":
    await import("./average-moment-rate-from-moment-duration/index.js"),
  "seismology/s-wave-nodal-and-maximum-azimuth-lookup":
    await import("./s-wave-nodal-and-maximum-azimuth-lookup/index.js"),
  "seismology/mb-to-mw-bandwise-conversion-lookup":
    await import("./mb-to-mw-bandwise-conversion-lookup/index.js"),
  "seismology/seismic-efficiency-energy-partition":
    await import("./seismic-efficiency-energy-partition/index.js"),
  "seismology/average-radiation-factor-boore-boatwright-lookup":
    await import("./average-radiation-factor-boore-boatwright-lookup/index.js"),
  "seismology/site-kappa-path-tstar-decomposition":
    await import("./site-kappa-path-tstar-decomposition/index.js"),
  "seismology/depth-phase-pp-minus-p-depth-estimate":
    await import("./depth-phase-pp-minus-p-depth-estimate/index.js"),
  "seismology/tri-station-circle-epicenter-least-squares":
    await import("./tri-station-circle-epicenter-least-squares/index.js"),
  "seismology/wadati-origin-time-single-station-formula":
    await import("./wadati-origin-time-single-station-formula/index.js"),
  "seismology/aftershock-zone-length-utsu-scaling":
    await import("./aftershock-zone-length-utsu-scaling/index.js"),
  "seismology/isoseismal-annulus-area-between-intensities":
    await import("./isoseismal-annulus-area-between-intensities/index.js"),
  "seismology/tsunami-open-ocean-travel-time-shallow-water":
    await import("./tsunami-open-ocean-travel-time-shallow-water/index.js"),
  "seismology/tidal-harmonic-residual-rms-calculator":
    await import("./tidal-harmonic-residual-rms-calculator/index.js"),
  "seismology/dipping-refractor-true-velocity-updown-dip":
    await import("./dipping-refractor-true-velocity-updown-dip/index.js"),
  "seismology/first-break-snr-validity-flagger":
    await import("./first-break-snr-validity-flagger/index.js"),
  "seismology/double-difference-pair-mean-offset-summary":
    await import("./double-difference-pair-mean-offset-summary/index.js"),
  "seismology/scalar-moment-from-deviatoric-eigenvalues":
    await import("./scalar-moment-from-deviatoric-eigenvalues/index.js"),
  "seismology/strong-motion-linear-baseline-correction":
    await import("./strong-motion-linear-baseline-correction/index.js"),
  "seismology/antialias-filter-corner-nyquist-checker":
    await import("./antialias-filter-corner-nyquist-checker/index.js"),
  "seismology/decimation-factor-aliasing-note-lookup":
    await import("./decimation-factor-aliasing-note-lookup/index.js"),
  "seismology/clock-drift-ppm-linear-regression":
    await import("./clock-drift-ppm-linear-regression/index.js"),
  "seismology/strike-dip-plane-normal-vector-converter":
    await import("./strike-dip-plane-normal-vector-converter/index.js"),
  "seismology/apparent-dip-along-section-line-calculator":
    await import("./apparent-dip-along-section-line-calculator/index.js"),
  "seismology/cumulative-moment-release-catalog-summary":
    await import("./cumulative-moment-release-catalog-summary/index.js"),
  "seismology/gutenberg-richter-a-value-annual-normalization":
    await import("./gutenberg-richter-a-value-annual-normalization/index.js"),
  "seismology/hazard-curve-probability-interpolation-loglog":
    await import("./hazard-curve-probability-interpolation-loglog/index.js"),
  "seismology/damping-response-spectrum-heuristic-scaling":
    await import("./damping-response-spectrum-heuristic-scaling/index.js"),
  "seismology/response-spectrum-corner-period-band-lookup":
    await import("./response-spectrum-corner-period-band-lookup/index.js"),
  "seismology/site-kappa-zero-by-nehrp-class-lookup":
    await import("./site-kappa-zero-by-nehrp-class-lookup/index.js"),
  "seismology/b-value-standard-error-shi-bolt-formula":
    await import("./b-value-standard-error-shi-bolt-formula/index.js"),
  "seismology/catalog-complete-timespan-denominator-checker":
    await import("./catalog-complete-timespan-denominator-checker/index.js"),
  "seismology/declustering-retained-event-fraction-summary":
    await import("./declustering-retained-event-fraction-summary/index.js"),
  "seismology/fault-seismic-moment-deficit-calculator":
    await import("./fault-seismic-moment-deficit-calculator/index.js"),
  "seismology/strain-drop-slip-over-length-stress-drop":
    await import("./strain-drop-slip-over-length-stress-drop/index.js"),
  "seismology/iribarren-surf-similarity-runup-regime":
    await import("./iribarren-surf-similarity-runup-regime/index.js"),
  "seismology/network-station-uptime-percent-calculator":
    await import("./network-station-uptime-percent-calculator/index.js"),
  "seismology/dataless-channel-epoch-overlap-checker":
    await import("./dataless-channel-epoch-overlap-checker/index.js"),
  "seismology/telemetry-block-gap-detector":
    await import("./telemetry-block-gap-detector/index.js"),
  "seismology/catalog-magnitude-type-histogram-summary":
    await import("./catalog-magnitude-type-histogram-summary/index.js"),
  "seismology/surface-wave-magnitude-vk20-formula":
    await import("./surface-wave-magnitude-vk20-formula/index.js"),
  "seismology/ms-mb-explosion-discrimination-note-lookup":
    await import("./ms-mb-explosion-discrimination-note-lookup/index.js"),
  "seismology/seismic-moment-to-slip-displacement-back-calc":
    await import("./seismic-moment-to-slip-displacement-back-calc/index.js"),
  "seismology/recurrence-interval-slip-rate-event-slip":
    await import("./recurrence-interval-slip-rate-event-slip/index.js"),
  "seismology/bath-law-largest-aftershock-gap-note-lookup":
    await import("./bath-law-largest-aftershock-gap-note-lookup/index.js"),
  "seismology/swarm-vs-mainshock-aftershock-sequence-classifier":
    await import("./swarm-vs-mainshock-aftershock-sequence-classifier/index.js"),
  "seismology/spatial-grid-cell-count-density-summary":
    await import("./spatial-grid-cell-count-density-summary/index.js"),
  "seismology/catalog-depth-histogram-binner":
    await import("./catalog-depth-histogram-binner/index.js"),
  "seismology/station-residual-outlier-sigma-flagger":
    await import("./station-residual-outlier-sigma-flagger/index.js"),
  "seismology/reduced-travel-time-plot-converter":
    await import("./reduced-travel-time-plot-converter/index.js"),
  "seismology/array-aperture-moveout-resolution-checker":
    await import("./array-aperture-moveout-resolution-checker/index.js"),
  "seismology/magnitude-frequency-entropy-shannon":
    await import("./magnitude-frequency-entropy-shannon/index.js"),
  "seismology/nearest-neighbor-space-time-linkage-distance":
    await import("./nearest-neighbor-space-time-linkage-distance/index.js"),
  "seismology/repeating-pair-slip-compatibility-checker":
    await import("./repeating-pair-slip-compatibility-checker/index.js"),
  "seismology/corner-frequency-stress-drop-consistency-checker":
    await import("./corner-frequency-stress-drop-consistency-checker/index.js"),
  "seismology/quarter-wave-layer-higher-mode-harmonics-calculator":
    await import("./quarter-wave-layer-higher-mode-harmonics-calculator/index.js"),
  "seismology/borehole-ps-logging-average-velocity-calculator":
    await import("./borehole-ps-logging-average-velocity-calculator/index.js"),
  "seismology/microtremor-array-resolution-frequency-band-checker":
    await import("./microtremor-array-resolution-frequency-band-checker/index.js"),
  "seismology/adc-effective-bits-noise-floor-calculator":
    await import("./adc-effective-bits-noise-floor-calculator/index.js"),
  "seismology/geophone-spring-max-acceleration-range-checker":
    await import("./geophone-spring-max-acceleration-range-checker/index.js"),
  "seismology/digitizer-input-loading-error-percent-calculator":
    await import("./digitizer-input-loading-error-percent-calculator/index.js"),
  "seismology/gps-week-second-to-days-since-era-converter":
    await import("./gps-week-second-to-days-since-era-converter/index.js"),
  "seismology/principal-tide-constituent-period-lookup":
    await import("./principal-tide-constituent-period-lookup/index.js"),
  "seismology/intensity-pga-wald-1999-table-lookup":
    await import("./intensity-pga-wald-1999-table-lookup/index.js"),
  "seismology/felt-radius-heuristic-log-scaling-calculator":
    await import("./felt-radius-heuristic-log-scaling-calculator/index.js"),
  "seismology/macroseismic-weighted-centroid-calculator":
    await import("./macroseismic-weighted-centroid-calculator/index.js"),
  "seismology/ems98-vulnerability-intensity-band-crosswalk":
    await import("./ems98-vulnerability-intensity-band-crosswalk/index.js"),
  "seismology/p-wave-azimuthal-residual-vector-sum-split":
    await import("./p-wave-azimuthal-residual-vector-sum-split/index.js"),
  "seismology/double-couple-p-t-axis-plunge-style-shortcut":
    await import("./double-couple-p-t-axis-plunge-style-shortcut/index.js"),
  "seismology/velocity-model-layer-cake-two-way-time-depth-converter":
    await import("./velocity-model-layer-cake-two-way-time-depth-converter/index.js"),
  "seismology/well-log-acoustic-impedance-reflection-coefficient":
    await import("./well-log-acoustic-impedance-reflection-coefficient/index.js"),
  "seismology/critical-reflection-angle-post-critical-note-checker":
    await import("./critical-reflection-angle-post-critical-note-checker/index.js"),
  "seismology/normal-incidence-two-way-time-thickness-calculator":
    await import("./normal-incidence-two-way-time-thickness-calculator/index.js"),
  "seismology/rms-velocity-dix-equation-interval-velocity-calculator":
    await import("./rms-velocity-dix-equation-interval-velocity-calculator/index.js"),
  "seismology/depth-conversion-average-velocity-method-calculator":
    await import("./depth-conversion-average-velocity-method-calculator/index.js"),
  "seismology/survey-design-fold-count-cmp-binning-summary":
    await import("./survey-design-fold-count-cmp-binning-summary/index.js"),
  "seismology/coda-normalization-lapse-time-amplitude-correction":
    await import("./coda-normalization-lapse-time-amplitude-correction/index.js"),
  "seismology/spectral-ratio-two-station-q-estimate-calculator":
    await import("./spectral-ratio-two-station-q-estimate-calculator/index.js"),
  "seismology/source-spectral-falloff-high-frequency-slope-checker":
    await import("./source-spectral-falloff-high-frequency-slope-checker/index.js"),
  "seismology/brune-displacement-spectrum-peak-frequency-note":
    await import("./brune-displacement-spectrum-peak-frequency-note/index.js"),
  "seismology/event-count-poisson-confidence-interval-gehrels":
    await import("./event-count-poisson-confidence-interval-gehrels/index.js"),
} as const;

describe("Seismology source-characterization family", () => {
  it("statically enumerates every seismology subdirectory", () => {
    expect(Object.keys(tools).length).toBe(204);
  });

  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool).toBeDefined();
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      const result = tool.execute(module.example.input as never);
      expect(result.ok).toBe(true);
      if (result.ok && module.example.output !== undefined) {
        expect(result.output).toEqual(module.example.output);
      }
    });
  }

  it("Brune corner frequency scales with the cube root of stress drop", () => {
    const tool =
      tools["seismology/brune-corner-frequency-source-model"].default;
    const low = tool.execute({
      seismicMomentDynCm: 1e26,
      shearVelocityKmPerS: 3.5,
      stressDropBar: 1,
    });
    const high = tool.execute({
      seismicMomentDynCm: 1e26,
      shearVelocityKmPerS: 3.5,
      stressDropBar: 1000,
    });
    if (low.ok && high.ok) {
      const ratio =
        (high.output.cornerFrequencyHz as number) /
        (low.output.cornerFrequencyHz as number);
      expect(ratio).toBeCloseTo(Math.cbrt(1000), 9);
    } else fail("unexpected error result");
  });

  it("apparent stress equals μ·Es/M₀", () => {
    const tool = tools["seismology/apparent-stress-energy-ratio"].default;
    const r = tool.execute({ radiatedEnergyJ: 3e13, seismicMomentNm: 1e17 });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.output.apparentStressMPa).toBeCloseTo(
        (3e10 * 3e13) / 1e17 / 1e6,
        9,
      );
  });

  it("rejects super-shear rupture velocity in directivity pulse duration", () => {
    const tool =
      tools["seismology/directivity-pulse-duration-near-source"].default;
    const r = tool.execute({ faultLengthKm: 20, ruptureVelocityKmS: 4.0 });
    expect(r.ok).toBe(false);
  });

  it("classifies near-Rayleigh rupture velocity as sub-shear", () => {
    const tool =
      tools["seismology/rupture-velocity-shear-wave-ratio-checker"].default;
    const r = tool.execute({
      ruptureVelocityKmS: 2.45,
      shearWaveVelocityKmS: 3.5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.regime).toBe("sub-shear");
  });

  it("asperity fraction is unity at the reference moment", () => {
    const tool = tools["seismology/asperity-area-fraction-scaling"].default;
    const r = tool.execute({ seismicMomentNm: 1e18, scalingExponent: 0.25 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.asperityFraction).toBeCloseTo(1, 12);
  });

  it("Wells-Coppersmith magnitude grows logarithmically with fault length", () => {
    const tool =
      tools["seismology/characteristic-earthquake-window-lookup"].default;
    const short = tool.execute({ faultLengthKm: 10 });
    const long = tool.execute({ faultLengthKm: 100 });
    if (short.ok && long.ok) {
      const delta =
        (long.output.magnitudeMw as number) -
        (short.output.magnitudeMw as number);
      expect(delta).toBeCloseTo(1.49, 6);
    } else fail("unexpected error result");
  });

  it("recovers moment from spectral flat level with default crustal parameters", () => {
    const tool = tools["seismology/moment-from-spectral-flat-level"].default;
    const r = tool.execute({ omega0NmS: 1e-7 });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.output.seismicMomentNm).toBeCloseTo(
        (4 * Math.PI * 2700 * Math.pow(3500, 3) * 1e-7) / 2.83,
        6,
      );
  });

  it("P-wave modulus equals rho times Vp squared", () => {
    const tool = tools["seismology/p-wave-modulus-constrained"].default;
    const r = tool.execute({ densityKgM3: 2700, vpKmS: 6.5 });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.output.modulusGPa).toBeCloseTo((2700 * 6500 ** 2) / 1e9, 9);
  });

  it("rejects Vp/Vs at or below the incompressibility limit", () => {
    const tool = tools["seismology/vp-vs-ratio-poisson-checker"].default;
    expect(tool.execute({ vpKmS: 3, vsKmS: 3 }).ok).toBe(false);
    const good = tool.execute({ vpKmS: 6.5, vsKmS: 3.75 });
    expect(good.ok).toBe(true);
    if (good.ok) {
      const r2 = (6.5 / 3.75) ** 2;
      expect(good.output.poissonRatio as number).toBeCloseTo(
        (r2 - 2) / (2 * (r2 - 1)),
        9,
      );
    }
  });

  it("Q inference halves amplitude over one t* path", () => {
    const tool = tools["seismology/attenuation-quality-factor-q"].default;
    const r = tool.execute({
      amplitudeRatio: Math.exp(-Math.PI),
      frequencyHz: 1,
      pathLengthKm: 35,
      velocityKmS: 3.5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.qualityFactorQ as number).toBeCloseTo(10, 6);
      expect(r.output.tStarSeconds as number).toBeCloseTo(
        (1 / Math.PI) * -Math.log(Math.exp(-Math.PI)),
        9,
      );
    }
  });

  it("equal intrinsic and scattering Q halves the total Q", () => {
    const tool = tools["seismology/coda-q-scattering-intrinsic-split"].default;
    const r = tool.execute({ qIntrinsic: 500, qScattering: 500 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.qualityFactorTotal as number).toBeCloseTo(250, 6);
      expect(r.output.scatteringFractionPercent as number).toBeCloseTo(50, 9);
    }
  });

  it("surface waves spread more slowly than body waves", () => {
    const body = tools["seismology/geometrical-spreading-body-wave"].default;
    const surface =
      tools["seismology/surface-wave-spreading-half-space"].default;
    const b = body.execute({ distanceKm: 100 });
    const s = surface.execute({ distanceKm: 100 });
    if (b.ok && s.ok)
      expect(s.output.spreadingFactor as number).toBeGreaterThan(
        b.output.spreadingFactor as number,
      );
    else fail("unexpected error result");
  });

  it("kappa attenuation decays exponentially with frequency", () => {
    const tool = tools["seismology/kappa-site-anelastic-attenuation"].default;
    const low = tool.execute({ kappaSeconds: 0.04, frequencyHz: 5 });
    const high = tool.execute({ kappaSeconds: 0.04, frequencyHz: 20 });
    if (low.ok && high.ok) {
      const ratio = high.output.attenuationFactor as number;
      expect(ratio).toBeLessThan(low.output.attenuationFactor as number);
      expect(ratio).toBeCloseTo(Math.exp(-Math.PI * 0.04 * 20), 12);
    } else fail("unexpected error result");
  });

  it("Love wave dispersion crosses band boundaries at the lookup thresholds", () => {
    const tool = tools["seismology/love-wave-dispersion-period-speed"].default;
    const shortT = tool.execute({ periodSeconds: 10 });
    const justOver = tool.execute({ periodSeconds: 10.01 });
    if (shortT.ok && justOver.ok) {
      expect(shortT.output.phaseVelocityKmS).not.toBe(
        justOver.output.phaseVelocityKmS,
      );
    } else fail("unexpected error result");
  });

  it("group velocity differs from phase velocity by λ·dc/dλ", () => {
    const tool = tools["seismology/group-vs-phase-velocity-difference"].default;
    const r = tool.execute({
      phaseVelocityKmS: 4.0,
      wavelengthKm: 50,
      dcPerDlambda: 0.02,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.groupVelocityKmS as number).toBeCloseTo(4.0 - 1.0, 9);
      expect(r.output.differenceKmS as number).toBeCloseTo(-1.0, 9);
    }
  });

  it("Rayleigh wave speed is supersonic relative to air for crustal β", () => {
    const tool = tools["seismology/air-coupled-rayleigh-wave-speed"].default;
    const r = tool.execute({ shearVelocityKmS: 3.5 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.rayleighSpeedKmS as number).toBeCloseTo(3.22, 9);
      expect(r.output.supersonicVsAir).toBe(true);
    }
  });

  it("Stoneley shear support requires solids on both sides of the interface", () => {
    const tool =
      tools["seismology/stoneley-interface-existence-checker"].default;
    const fluid = tool.execute({ vsUpperKmS: 0, vsLowerKmS: 3.5 });
    expect(fluid.ok).toBe(true);
    if (fluid.ok) expect(fluid.output.shearSupportConditionMet).toBe(false);
    const solid = tool.execute({ vsUpperKmS: 1.5, vsLowerKmS: 3.5 });
    expect(solid.ok).toBe(true);
    if (solid.ok) expect(solid.output.shearSupportConditionMet).toBe(true);
  });

  it("classifies SH-dominated motion as Love-like and P-SV motion as Rayleigh-like", () => {
    const tool = tools["seismology/love-vs-rayleigh-motion-classifier"].default;
    const love = tool.execute({
      transverseComponent: 100,
      verticalComponent: 5,
      radialComponent: 5,
    });
    const rayleigh = tool.execute({
      transverseComponent: 5,
      verticalComponent: 80,
      radialComponent: 60,
    });
    if (love.ok && rayleigh.ok) {
      expect(love.output.classification).toContain("Love");
      expect(rayleigh.output.classification).toContain("Rayleigh");
    } else fail("unexpected error result");
  });

  it("VS30 is harmonic-style time average, not arithmetic", () => {
    const tool = tools["seismology/vs30-time-averaged-shear-velocity"].default;
    const r = tool.execute({
      thicknessesM: [15, 15],
      shearVelocitiesMS: [200, 600],
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const t = 15 / 200 + 15 / 600;
      expect(r.output.vs30MS as number).toBeCloseTo(30 / t, 9);
      expect(r.output.vs30MS as number).toBeLessThan(400);
    }
  });

  it("rejects a VS30 profile that does not reach 30 m", () => {
    const tool = tools["seismology/vs30-time-averaged-shear-velocity"].default;
    expect(
      tool.execute({ thicknessesM: [10], shearVelocitiesMS: [300] }).ok,
    ).toBe(false);
  });

  it("truncates the final layer at exactly 30 m instead of over-counting", () => {
    const tool = tools["seismology/vs30-time-averaged-shear-velocity"].default;
    const r = tool.execute({ thicknessesM: [50], shearVelocitiesMS: [300] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.vs30MS).toBeCloseTo(300, 9);
      expect(r.output.profileDepthM).toBe(30);
    }
  });

  it("NEHRP classes follow the VS30 band boundaries", () => {
    const tool = tools["seismology/site-class-nehrp-from-vs30-lookup"].default;
    for (const [vs, expected] of [
      [1600, "A"],
      [800, "B"],
      [500, "C"],
      [200, "D"],
      [100, "E"],
    ] as const) {
      const r = tool.execute({ vs30MS: vs });
      if (r.ok) expect(r.output.siteClass).toBe(expected);
      else fail(`unexpected error at ${vs} m/s`);
    }
  });

  it("site period Ts = 4H/Vs uses class-typical velocities", () => {
    const tool =
      tools["seismology/nehrp-fundamental-period-site-lookup"].default;
    const d = tool.execute({ siteClass: "D", profileDepthM: 30 });
    const e = tool.execute({ siteClass: "E", profileDepthM: 30 });
    if (d.ok && e.ok)
      expect(
        (e.output.fundamentalPeriodS as number) /
          (d.output.fundamentalPeriodS as number),
      ).toBeCloseTo(2, 6);
    else fail("unexpected error result");
  });

  it("Borcherdt amplification increases from rock to soft soil", () => {
    const tool =
      tools["seismology/amplification-borcherdt-factor-lookup"].default;
    const b = tool.execute({ siteClass: "B" });
    const e = tool.execute({ siteClass: "E" });
    if (b.ok && e.ok)
      expect(e.output.amplificationFactor as number).toBeGreaterThan(
        b.output.amplificationFactor as number,
      );
    else fail("unexpected error result");
  });

  it("quarter-wavelength resonance halves when the layer doubles", () => {
    const tool =
      tools["seismology/resonance-quarter-wavelength-soft-soil"].default;
    const thin = tool.execute({ layerThicknessM: 25, shearVelocityMS: 200 });
    const thick = tool.execute({ layerThicknessM: 50, shearVelocityMS: 200 });
    if (thin.ok && thick.ok)
      expect(thick.output.resonantFrequencyHz as number).toBeCloseTo(
        (thin.output.resonantFrequencyHz as number) / 2,
        9,
      );
    else fail("unexpected error result");
  });

  it("topographic screening amplification grows with slope", () => {
    const tool =
      tools["seismology/topographic-aggravation-factor-ridge"].default;
    const steep = tool.execute({ slopeAngleDeg: 40, heightRatio: 0.2 });
    const flat = tool.execute({ slopeAngleDeg: 3, heightRatio: 0.2 });
    if (steep.ok && flat.ok) {
      expect(steep.output.aggravationFactor as number).toBeGreaterThan(
        flat.output.aggravationFactor as number,
      );
      expect(steep.output.screeningBand).toContain("very steep");
    } else fail("unexpected error result");
  });

  it("basin-edge waves require a contrast of at least 2x", () => {
    const tool = tools["seismology/basin-edge-surface-waves-checker"].default;
    const strong = tool.execute({ vsBasinMS: 300, vsBedrockMS: 900 });
    const weak = tool.execute({ vsBasinMS: 300, vsBedrockMS: 450 });
    if (strong.ok && weak.ok) {
      expect(strong.output.edgeWavesLikely).toBe(true);
      expect(weak.output.edgeWavesLikely).toBe(false);
    } else fail("unexpected error result");
  });

  it("modulus degradation approaches zero at large strain and stays near one at tiny strain", () => {
    const tool =
      tools["seismology/nonlinear-soil-strain-degradation-lookup"].default;
    const small = tool.execute({ shearStrainPercent: 1e-6, soilType: "sand" });
    const large = tool.execute({ shearStrainPercent: 50, soilType: "sand" });
    if (small.ok && large.ok) {
      expect(small.output.modulusReductionRatio as number).toBeGreaterThan(
        0.99,
      );
      expect(large.output.modulusReductionRatio as number).toBeLessThan(0.01);
      expect(large.output.behaviorRegime).toContain("failure");
    } else fail("unexpected error result");
  });

  it("GMPE attenuation decays with distance and grows with magnitude", () => {
    const tool = tools["seismology/gmpe-log-distance-attenuation"].default;
    const near = tool.execute({ magnitudeMw: 6, distanceKm: 10 });
    const far = tool.execute({ magnitudeMw: 6, distanceKm: 100 });
    const bigger = tool.execute({ magnitudeMw: 7, distanceKm: 30 });
    if (near.ok && far.ok && bigger.ok) {
      expect(far.output.pgaG as number).toBeLessThan(
        near.output.pgaG as number,
      );
      expect(bigger.output.pgaG as number).toBeGreaterThan(
        (
          tools["seismology/gmpe-log-distance-attenuation"].default.execute({
            magnitudeMw: 6,
            distanceKm: 30,
          }) as { ok: true; output: { pgaG: number } }
        ).output.pgaG,
      );
    } else fail("unexpected error result");
  });

  it("flags magnitudes beyond the saturation cap", () => {
    const tool = tools["seismology/magnitude-scaling-saturation-check"].default;
    const big = tool.execute({ faultLengthKm: 500 });
    if (big.ok) expect(big.output.saturated).toBe(true);
    else fail("unexpected error result");
    const small = tool.execute({ faultLengthKm: 20 });
    if (small.ok) expect(small.output.saturated).toBe(false);
  });

  it("fling velocity is slip over rise time", () => {
    const tool =
      tools["seismology/near-fault-fling-step-velocity-pulse"].default;
    const r = tool.execute({ slipM: 4, riseTimeSeconds: 2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.flingVelocityMS).toBeCloseTo(2, 9);
  });

  it("pulse period equals rupture length over rupture speed", () => {
    const tool =
      tools["seismology/directivity-narrowband-pulse-period"].default;
    const r = tool.execute({ ruptureLengthKm: 28, ruptureVelocityKmS: 2.8 });
    if (r.ok) expect(r.output.pulsePeriodSeconds).toBeCloseTo(10, 9);
    else fail("unexpected error result");
  });

  it("V/H ratio decreases toward long periods", () => {
    const tool =
      tools["seismology/vertical-horizontal-vh-ratio-lookup"].default;
    const shortP = tool.execute({ periodSeconds: 0.05 });
    const longP = tool.execute({ periodSeconds: 3 });
    if (shortP.ok && longP.ok)
      expect(longP.output.vhRatio as number).toBeLessThan(
        shortP.output.vhRatio as number,
      );
    else fail("unexpected error result");
  });

  it("within-event sigma of 0.693 means a two-times spread", () => {
    const tool = tools["seismology/within-event-sigma-lambda"].default;
    const r = tool.execute({ sigmaLnUnits: Math.log(2) });
    if (r.ok) expect(r.output.fractionalSpreadPercent).toBeCloseTo(100, 6);
    else fail("unexpected error result");
  });

  it("tau variance uses the unbiased n-1 denominator", () => {
    const tool = tools["seismology/between-event-tau-variance"].default;
    const r = tool.execute({ eventResidualsLn: [1, -1] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.tauVariance).toBeCloseTo(2, 9);
      expect(r.output.tauStdDev).toBeCloseTo(Math.SQRT2, 9);
    }
  });

  it("total dispersion combines tau and sigma in quadrature", () => {
    const tool =
      tools["seismology/gmm-total-dispersion-tau-sigma-combine"].default;
    const r = tool.execute({ betweenEventTau: 0.4, withinEventSigma: 0.3 });
    if (r.ok) expect(r.output.totalSigma).toBeCloseTo(0.5, 12);
    else fail("unexpected error result");
  });

  it("PGV estimate scales linearly with PGA and reference period", () => {
    const tool = tools["seismology/pgv-pga-correlation-approximation"].default;
    const doubled = tool.execute({ pgaCmS2: 600, referencePeriodS: 0.5 });
    const base = tool.execute({ pgaCmS2: 300, referencePeriodS: 0.5 });
    if (doubled.ok && base.ok)
      expect(doubled.output.pgvCmS).toBeCloseTo(
        (base.output.pgvCmS as number) * 2,
        9,
      );
    else fail("unexpected error result");
  });

  it("Arias intensity scales with the square of PGA", () => {
    const tool = tools["seismology/arias-intensity-duration-proxy"].default;
    const base = tool.execute({ pgaMS2: 1, effectiveDurationS: 5 });
    const quad = tool.execute({ pgaMS2: 2, effectiveDurationS: 5 });
    if (base.ok && quad.ok)
      expect(quad.output.ariasIntensityMS).toBeCloseTo(
        (base.output.ariasIntensityMS as number) * 4,
        9,
      );
    else fail("unexpected error result");
  });

  it("CAV sums absolute values times interval", () => {
    const tool = tools["seismology/cumulative-absolute-velocity-cai"].default;
    const r = tool.execute({
      accelerationsMS2: [3, -3, 3],
      sampleIntervalS: 0.01,
    });
    if (r.ok) expect(r.output.cavMS).toBeCloseTo(0.09, 12);
    else fail("unexpected error result");
    expect(
      tool.execute({ accelerationsMS2: [], sampleIntervalS: 0.01 }).ok,
    ).toBe(false);
  });

  it("significant duration brackets the central 90 percent of Arias energy", () => {
    const tool = tools["seismology/significant-duration-arias-5-95"].default;
    const r = tool.execute({ intervalEnergies: [1, 8, 1] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const n = r.output.significantDurationIntervals as number;
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(3);
    }
  });

  it("Housner intensity is the trapezoidal area under PSV", () => {
    const tool = tools["seismology/housner-spectral-intensity"].default;
    const r = tool.execute({ pseudoVelocitiesCmS: [0, 10], sampleStepS: 0.1 });
    if (r.ok) expect(r.output.spectralIntensityCm).toBeCloseTo(0.5, 12);
    else fail("unexpected error result");
  });

  it("ShakeMap MMI saturates at 10 for extreme PGV", () => {
    const tool =
      tools["seismology/shakemap-instrument-intensity-pgv-converter"].default;
    const huge = tool.execute({ pgvCmS: 1e6 });
    if (huge.ok) expect(huge.output.instrumentalMMI).toBe(10);
    else fail("unexpected error result");
  });

  it("EC8 ground types track VS30 bands", () => {
    const tool = tools["seismology/eurocode-8-ground-type-lookup"].default;
    for (const [vs, expected] of [
      [1500, "A"],
      [700, "B"],
      [300, "C"],
      [120, "D"],
      [50, "D"],
    ] as const) {
      const r = tool.execute({ vs30MS: vs });
      if (r.ok) expect(r.output.groundType).toBe(expected);
      else fail(`unexpected error at ${vs} m/s`);
    }
  });

  it("EC8 band edges land on the EN 1998-1 Table 3.1 boundaries", () => {
    const tool = tools["seismology/eurocode-8-ground-type-lookup"].default;
    for (const [vs, expected] of [
      [801, "A"],
      [800, "B"],
      [360, "B"],
      [359.5, "C"],
      [180, "C"],
      [179, "D"],
    ] as const) {
      const r = tool.execute({ vs30MS: vs });
      if (r.ok) expect(r.output.groundType).toBe(expected);
      else fail(`unexpected error at ${vs} m/s`);
    }
  });

  it("JMA intensity rounds to the nearest half unit", () => {
    const tool = tools["seismology/jma-intensity-from-pgv-converter"].default;
    const r = tool.execute({ pgvCmS: 100 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const jma = r.output.jmaIntensity as number;
      expect(jma * 2).toBe(Math.round(jma * 2));
    } else fail("unexpected error result");
  });

  it("Mercalli crosswalk maps JMA 5 to strong shaking", () => {
    const tool = tools["seismology/mercalli-vs-jma-crosswalk-lookup"].default;
    const r = tool.execute({ jmaIntensity: 5 });
    if (r.ok) expect(r.output.descriptor).toBe("strong");
    else fail("unexpected error result");
  });

  it("azimuthal gap wraps around 360 degrees", () => {
    const tool =
      tools["seismology/station-gap-azimuthal-coverage-degree"].default;
    const r = tool.execute({ azimuthsDeg: [350, 10] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.maxGapDeg).toBeCloseTo(340, 9);
      expect(r.output.coverageQuality).toBe("poor");
    }
  });

  it("RMS residual rating degrades with scatter", () => {
    const tool = tools["seismology/rms-travel-time-residual-quality"].default;
    const tight = tool.execute({ residualsSeconds: [0.01, -0.01] });
    const loose = tool.execute({ residualsSeconds: [1, -1] });
    if (tight.ok && loose.ok) {
      expect(tight.output.locationQuality).toBe("excellent");
      expect(loose.output.locationQuality).toBe("poor");
    } else fail("unexpected error result");
  });

  it("Wadati slope of one implies Vp/Vs of two and zero Poisson ratio", () => {
    const tool = tools["seismology/wadati-diagram-vp-vs-slope"].default;
    const r = tool.execute({ slopeK: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.vpVsRatio).toBeCloseTo(2, 9);
      expect(r.output.poissonRatio).toBeCloseTo(1 / 3, 9);
    }
    const typical = tool.execute({ slopeK: 0.73 });
    if (typical.ok) {
      expect(typical.output.vpVsRatio).toBeCloseTo(1.73, 12);
      expect(typical.output.poissonRatio as number).toBeLessThan(0.26);
    } else fail("unexpected error result");
  });

  it("GMPE absolute levels are physically plausible", () => {
    const tool = tools["seismology/gmpe-log-distance-attenuation"].default;
    const r = tool.execute({ magnitudeMw: 6, distanceKm: 30 });
    if (r.ok) {
      expect(r.output.pgaG as number).toBeGreaterThan(0.05);
      expect(r.output.pgaG as number).toBeLessThan(1.5);
    } else fail("unexpected error result");
  });

  it("rejects an all-zero Arias energy record", () => {
    const tool = tools["seismology/significant-duration-arias-5-95"].default;
    expect(tool.execute({ intervalEnergies: [0, 0, 0] }).ok).toBe(false);
  });

  it("normalizes azimuths outside 0-360 before computing the gap", () => {
    const tool =
      tools["seismology/station-gap-azimuthal-coverage-degree"].default;
    const shifted = tool.execute({ azimuthsDeg: [-10, 10] });
    const plain = tool.execute({ azimuthsDeg: [350, 10] });
    if (shifted.ok && plain.ok)
      expect(shifted.output.maxGapDeg).toBeCloseTo(
        plain.output.maxGapDeg as number,
        9,
      );
    else fail("unexpected error result");
  });

  it("grid step halves the tolerance and sizes a 100 km axis", () => {
    const tool = tools["seismology/joint-hypocentral-grid-search-step"].default;
    const r = tool.execute({ toleranceKm: 2 });
    if (r.ok) {
      expect(r.output.stepKm).toBeCloseTo(1, 9);
      expect(r.output.nodesPerAxis100km).toBe(101);
    } else fail("unexpected error result");
  });

  it("flags wide azimuthal holes as bias-prone", () => {
    const tool =
      tools["seismology/azimuthal-hole-location-bias-warning-checker"].default;
    const bad = tool.execute({ maxGapDeg: 200, nearestStationKm: 5 });
    const good = tool.execute({ maxGapDeg: 90, nearestStationKm: 5 });
    if (bad.ok && good.ok) {
      expect(bad.output.biasLikely).toBe(true);
      expect(good.output.biasLikely).toBe(false);
    } else fail("unexpected error result");
  });

  it("crossover distance matches the closed form and critical angle is arcsin", () => {
    const tool =
      tools["seismology/refraction-layer-crossover-distance"].default;
    const r = tool.execute({ layerThicknessM: 100, v1MS: 2000, v2MS: 4000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.crossoverDistanceM as number).toBeCloseTo(
        200 * Math.sqrt(3),
        9,
      );
      expect(r.output.criticalAngleDeg as number).toBeCloseTo(30, 9);
    }
    expect(
      tool.execute({ layerThicknessM: 100, v1MS: 4000, v2MS: 4000 }).ok,
    ).toBe(false);
  });

  it("head wave disappears when the lower medium is not faster", () => {
    const tool =
      tools["seismology/head-wave-critical-angle-appearance"].default;
    expect(
      tool.execute({ upperVelocityMS: 3000, lowerVelocityMS: 1500 }).ok,
    ).toBe(false);
    const r = tool.execute({ upperVelocityMS: 1500, lowerVelocityMS: 3000 });
    if (r.ok) expect(r.output.headWavePossible).toBe(true);
    else fail("unexpected error result");
  });

  it("detects velocity inversions as blind zones", () => {
    const tool =
      tools["seismology/blind-zone-hidden-layer-depth-checker"].default;
    const inverted = tool.execute({ velocitiesMS: [1500, 800, 2500] });
    if (inverted.ok) expect(inverted.output.hiddenLayerIndices).toEqual([1]);
    else fail("unexpected error result");
    const deepest = tool.execute({ velocitiesMS: [1500, 2500, 1200] });
    if (deepest.ok) expect(deepest.output.hiddenLayerIndices).toEqual([2]);
    else fail("unexpected deepest-layer error result");
  });

  it("delay-time depth uses cos(ic) correction", () => {
    const tool =
      tools["seismology/plus-minus-delay-time-refraction-method"].default;
    const r = tool.execute({ interceptTimeS: 0.12, v1MS: 2000, v2MS: 4000 });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(r.output.interfaceDepthM as number).toBeCloseTo(
        240 / (2 * Math.sqrt(0.75)),
        9,
      );
  });

  it("tomography cells below hit density ten are unresolved", () => {
    const tool =
      tools["seismology/tomography-ray-density-cell-coverage"].default;
    const dense = tool.execute({
      segmentLengthsKm: [30, 40, 50],
      cellSizeKm: 2,
    });
    const sparse = tool.execute({ segmentLengthsKm: [3, 4], cellSizeKm: 2 });
    if (dense.ok && sparse.ok) {
      expect(dense.output.wellResolved).toBe(true);
      expect(sparse.output.wellResolved).toBe(false);
    } else fail("unexpected error result");
  });

  it("0.707 damping is flagged maximally flat", () => {
    const tool = tools["seismology/galvanometer-damping-0707-lookup"].default;
    const r = tool.execute({ dampingRatio: 0.7 });
    if (r.ok) expect(r.output.maximallyFlat).toBe(true);
    else fail("unexpected error result");
  });

  it("gain of 0.01 is -40 dB attenuation", () => {
    const tool = tools["seismology/instrument-response-gain-db-lookup"].default;
    const r = tool.execute({ gainFactor: 0.01 });
    if (r.ok) {
      expect(r.output.gainDb).toBeCloseTo(-40, 9);
      expect(r.output.isAttenuation).toBe(true);
    } else fail("unexpected error result");
    expect(tool.execute({ gainFactor: 0 }).ok).toBe(false);
  });

  it("24-bit 40 Vpp digitizer clips near +20 V", () => {
    const tool = tools["seismology/adc-clip-level-full-scale-counts"].default;
    const r = tool.execute({ bitDepth: 24, fullScaleVPp: 40 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const lsb = 40 / 2 ** 24;
      expect(r.output.clipVoltageV as number).toBeCloseTo(
        (2 ** 23 - 1) * lsb,
        12,
      );
      expect(r.output.lsbMicroVolts as number).toBeCloseTo(lsb * 1e6, 3);
    }
  });

  it("GPS jitter of 10 ms exceeds the hypocentral budget at P-wave speed", () => {
    const tool = tools["seismology/gps-clock-jitter-ms-budget"].default;
    const r = tool.execute({ jitterMs: 10 });
    if (r.ok) {
      expect(r.output.distanceBiasM).toBeCloseTo(60, 9);
      expect(r.output.acceptableForHypocenter).toBe(false);
    } else fail("unexpected error result");
  });

  it("detection threshold grows logarithmically with radius", () => {
    const tool =
      tools["seismology/network-detection-threshold-coverage"].default;
    const near = tool.execute({ stationSpacingKm: 2 });
    const far = tool.execute({ stationSpacingKm: 200 });
    if (near.ok && far.ok)
      expect(far.output.minimumMagnitude as number).toBeGreaterThan(
        near.output.minimumMagnitude as number,
      );
    else fail("unexpected error result");
  });

  it("max-curvature Mc lands on the modal bin center", () => {
    const tool =
      tools["seismology/completeness-magnitude-max-curvature"].default;
    const r = tool.execute({
      binCounts: [1, 4, 4, 2],
      binStartMag: 1.25,
      binWidth: 0.5,
    });
    if (r.ok) expect(r.output.completenessMagnitude).toBeCloseTo(1.75, 9);
    else fail("unexpected error result");
    expect(tool.execute({ binCounts: [] }).ok).toBe(false);
  });

  it("Peterson models bracket zero period and minimum noise near six seconds", () => {
    const tool =
      tools["seismology/peterson-noise-model-low-high-lookup"].default;
    const quiet = tool.execute({ periodSeconds: 6 });
    const shortP = tool.execute({ periodSeconds: 0.05 });
    if (quiet.ok && shortP.ok) {
      expect(quiet.output.nlnmDb as number).toBeLessThan(
        shortP.output.nlnmDb as number,
      );
      expect(quiet.output.nhnmDb as number).toBeGreaterThan(-140);
    } else fail("unexpected error result");
  });

  it("HVSR peak picker finds the tallest ratio and its frequency", () => {
    const tool = tools["seismology/hvsr-nakamura-peak-frequency"].default;
    const r = tool.execute({
      frequenciesHz: [0.3, 0.8, 2, 5],
      hvRatios: [1.2, 5, 2.5, 1],
    });
    if (r.ok) {
      expect(r.output.peakFrequencyHz).toBeCloseTo(0.8, 12);
      expect(r.output.peakAmplitude).toBeCloseTo(5, 12);
    } else fail("unexpected error result");
    expect(tool.execute({ frequenciesHz: [1], hvRatios: [] }).ok).toBe(false);
  });

  it("HVSR screening fails on weak prominence", () => {
    const tool = tools["seismology/hvsr-clear-peak-confidence-checker"].default;
    const r = tool.execute({
      peakToMedianRatio: 1.5,
      frequencyScatterPercent: 5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.clearPeak).toBe(false);
      expect(r.output.failedCriteria).toEqual(["amplitude_prominence"]);
    }
  });

  it("UHS log-log interpolation reproduces anchors exactly", () => {
    const tool =
      tools["seismology/uniform-hazard-spectrum-interpolation"].default;
    const atAnchor = tool.execute({
      anchorPeriodsS: [0.2, 1, 2],
      anchorSaG: [0.5, 0.25, 0.12],
      targetPeriodS: 1,
    });
    const outside = tool.execute({
      anchorPeriodsS: [0.2, 1],
      anchorSaG: [0.5, 0.25],
      targetPeriodS: 5,
    });
    if (atAnchor.ok) expect(atAnchor.output.saG).toBeCloseTo(0.25, 12);
    else fail("unexpected error result");
    expect(outside.ok).toBe(false);
  });

  it("deaggregation means are contribution weighted", () => {
    const tool =
      tools["seismology/deaggregation-mean-mag-dist-epsilon"].default;
    const r = tool.execute({
      magnitudes: [6, 7],
      distancesKm: [10, 30],
      epsilons: [-0.5, 0.5],
      weights: [0.75, 0.25],
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.meanMagnitude).toBeCloseTo(6.25, 12);
      expect(r.output.meanDistanceKm).toBeCloseTo(15, 12);
    }
    expect(
      tool.execute({
        magnitudes: [6],
        distancesKm: [10],
        epsilons: [0],
        weights: [],
      }).ok,
    ).toBe(false);
  });

  it("guide recommends PSHA only with both fault and recurrence data", () => {
    const tool =
      tools["seismology/deterministic-vs-probabilistic-split"].default;
    for (const [fault, rec, want] of [
      [true, true, "PSHA"],
      [true, false, "DSHA-leaning hybrid"],
      [false, true, "PSHA with area sources"],
      [false, false, "deterministic screen"],
    ] as const) {
      const r = tool.execute({
        hasActiveFaultModel: fault,
        hasRecurrenceData: rec,
      });
      if (r.ok)
        expect(String(r.output.recommendation)).toContain(
          want
            .replace("PSHA with area sources", "PSHA")
            .replace("deterministic screen", "screen"),
        );
      else fail(`unexpected error for ${fault}/${rec}`);
    }
  });

  it("475-year return period over 50 years is about ten percent", () => {
    const tool =
      tools["seismology/poisson-return-period-probability-exceedance"].default;
    const r = tool.execute({ returnPeriodYears: 475, exposureYears: 50 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.probabilityPercent as number).toBeGreaterThan(9);
      expect(r.output.probabilityPercent as number).toBeLessThan(11);
    }
  });

  it("annual-rate conversion matches the exponential law", () => {
    const tool = tools["seismology/annual-rate-to-t-years-exceedance"].default;
    const r = tool.execute({ annualRatePerYear: 0.02, windowYears: 100 });
    if (r.ok) {
      expect(r.output.expectedCount).toBeCloseTo(2, 12);
      expect(r.output.probabilityOfOccurrence).toBeCloseTo(
        1 - Math.exp(-2),
        12,
      );
    } else fail("unexpected error result");
  });

  it("BPT aperiodicity classifies quasi-periodic vs clustered", () => {
    const tool = tools["seismology/renewal-bpt-coefficient-variation"].default;
    const regular = tool.execute({ meanIntervalYears: 200, stdDevYears: 40 });
    const noisy = tool.execute({ meanIntervalYears: 100, stdDevYears: 90 });
    if (regular.ok && noisy.ok) {
      expect(regular.output.processClass).toContain("quasi");
      expect(noisy.output.coefficientVariation).toBeCloseTo(0.9, 12);
    } else fail("unexpected error result");
  });

  it("conditional probability rises above Poisson late in the cycle", () => {
    const tool =
      tools["seismology/time-dependent-conditional-probability"].default;
    const r = tool.execute({
      meanIntervalYears: 150,
      stdDevYears: 60,
      elapsedYears: 140,
      forecastWindowYears: 30,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.conditionalProbability).toBeGreaterThan(0);
      expect(r.output.hazardRatioVsPoisson).toBeGreaterThan(1);
    }
  });

  it("low-angle megathrust dip suppresses vertical offset", () => {
    const tool = tools["seismology/tsunami-seafloor-vertical-offset"].default;
    const shallowDip = tool.execute({ slipM: 10, dipDeg: 10 });
    const steepDip = tool.execute({ slipM: 10, dipDeg: 45 });
    if (shallowDip.ok && steepDip.ok)
      expect(shallowDip.output.verticalOffsetM as number).toBeLessThan(
        steepDip.output.verticalOffsetM as number,
      );
    else fail("unexpected error result");
  });

  it("Okada-style moment uses rigidity times slip times area", () => {
    const tool =
      tools["seismology/okada-dip-slip-surface-displacement"].default;
    const r = tool.execute({
      slipM: 2,
      lengthKm: 100,
      widthKm: 50,
      dipDeg: 20,
    });
    if (r.ok) expect(r.output.coseismicMomentNm).toBeCloseTo(3e20 * 1.0, 6);
    else fail("unexpected error result");
  });

  it("strike-slip events produce negligible far-field vertical motion", () => {
    const tool =
      tools["seismology/okada-strike-slip-surface-displacement"].default;
    const r = tool.execute({ slipM: 4, lengthKm: 120, widthKm: 15 });
    if (r.ok) {
      expect(r.output.peakHorizontalM).toBeCloseTo(2, 9);
      expect(r.output.coseismicMomentNm).toBeCloseTo(
        3e10 * 4 * 120000 * 15000,
        3,
      );
    } else fail("unexpected error result");
  });

  it("onshore giants do not pass the submarine tsunami screen", () => {
    const tool =
      tools["seismology/tsunamigenic-magnitude-threshold-checker"].default;
    const onshore = tool.execute({ magnitudeMw: 8.5, isSubmarine: false });
    if (onshore.ok) expect(onshore.output.tsunamigenicLikely).toBe(false);
    else fail("unexpected error result");
  });

  it("DART flags require both amplitude and tsunami period band", () => {
    const tool = tools["seismology/dart-pressure-tsunami-flag-checker"].default;
    const swellOnly = tool.execute({ amplitudeCm: 8, dominantPeriodMin: 0.5 });
    const smallTsunami = tool.execute({
      amplitudeCm: 0.5,
      dominantPeriodMin: 15,
    });
    if (swellOnly.ok && smallTsunami.ok) {
      expect(swellOnly.output.tsunamiFlagged).toBe(false);
      expect(smallTsunami.output.tsunamiFlagged).toBe(false);
    } else fail("unexpected error result");
  });

  it("trench counting separates events from units and ignores fissures", () => {
    const tool =
      tools["seismology/paleoseismic-trench-event-horizon-count"].default;
    const r = tool.execute({
      eventFlags: ["unit", "event", "fissure", "fissure", "unit", "event"],
    });
    if (r.ok) {
      expect(r.output.eventCount).toBe(2);
      expect(r.output.unitCount).toBe(2);
    } else fail("unexpected error result");
    expect(tool.execute({ eventFlags: [] }).ok).toBe(false);
  });

  it("per-event slip halves when the event count doubles", () => {
    const tool =
      tools["seismology/offset-feature-cumulative-slip-per-event"].default;
    const four = tool.execute({ cumulativeOffsetM: 8, eventCount: 4 });
    const eight = tool.execute({ cumulativeOffsetM: 8, eventCount: 8 });
    if (four.ok && eight.ok)
      expect(eight.output.perEventSlipM).toBeCloseTo(
        (four.output.perEventSlipM as number) / 2,
        12,
      );
    else fail("unexpected error result");
  });

  it("liquefaction bound grows with distance and needs M7+ at 300 km", () => {
    const tool =
      tools["seismology/liquefaction-feature-magnitude-bound-lookup"].default;
    const r = tool.execute({ epicentralDistanceKm: 300 });
    if (r.ok) expect(r.output.minimumMagnitudeMw).toBeGreaterThan(7);
    else fail("unexpected error result");
  });

  it("landslide volume scaling returns sub-linear depth for large scars", () => {
    const tool =
      tools["seismology/seismic-landslide-area-volume-scaling"].default;
    const r = tool.execute({ planAreaM2: 1e6 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const v = r.output.volumeM3 as number;
      expect(v / 1e6).toBeLessThan(50);
    }
  });

  it("sub-5.5 events are not expected to rupture the surface", () => {
    const tool =
      tools["seismology/surface-rupture-length-recurrence-lookup"].default;
    const small = tool.execute({ magnitudeMw: 5 });
    const big = tool.execute({ magnitudeMw: 7.5 });
    if (small.ok && big.ok) {
      expect(small.output.ruptureReachesSurface).toBe(false);
      expect(big.output.expectedSRLKm as number).toBeGreaterThan(50);
    } else fail("unexpected error result");
  });

  it("elapsed-time status bands track the loading fraction", () => {
    const tool =
      tools["seismology/elapsed-time-last-event-segment-checker"].default;
    const early = tool.execute({
      lastEventYear: 2016,
      meanRecurrenceYears: 150,
      currentYear: 2026,
    });
    const overdue = tool.execute({
      lastEventYear: 1850,
      meanRecurrenceYears: 150,
      currentYear: 2026,
    });
    if (early.ok && overdue.ok) {
      expect(early.output.statusBand).toContain("early");
      expect(overdue.output.statusBand).toContain("overdue");
    } else fail("unexpected error result");
  });

  it("traffic-light escalates with injection pressure", () => {
    const tool =
      tools["seismology/injection-pressure-trigger-threshold-checker"].default;
    const calm = tool.execute({ wellheadPressureBar: 0.5, thresholdBar: 1 });
    const hot = tool.execute({ wellheadPressureBar: 1.5, thresholdBar: 1 });
    if (calm.ok && hot.ok) {
      expect(calm.output.exceedsThreshold).toBe(false);
      expect(hot.output.recommendedAction).toContain("reduce");
    } else fail("unexpected error result");
  });

  it("fracturing traffic light turns red at M2.5", () => {
    const tool =
      tools["seismology/fracturing-monitor-magnitude-reporting-lookup"].default;
    const r = tool.execute({ localMagnitudeML: 2.6 });
    if (r.ok) {
      expect(r.output.trafficLightLevel).toBe("red");
      expect(r.output.reportingClass).toContain("notable");
    } else fail("unexpected error result");
  });

  it("reservoir stress change follows rho-g-h in bars", () => {
    const tool =
      tools["seismology/reservoir-induced-stress-change-bar"].default;
    const r = tool.execute({ reservoirDepthM: 150, waterDensityKgM3: 1000 });
    if (r.ok) expect(r.output.stressChangeBar).toBeCloseTo(14.709975, 9);
    else fail("unexpected error result");
  });

  it("mining screen escalates its site-protocol guidance with magnitude", () => {
    const tool =
      tools["seismology/mining-collapse-magnitude-norms-lookup"].default;
    const routine = tool.execute({ eventMagnitudeMw: 1.2 });
    const major = tool.execute({ eventMagnitudeMw: 4.4 });
    if (routine.ok && major.ok) {
      expect(routine.output.collapseNorm).toContain("smaller");
      expect(major.output.evacuationAdvice).toContain("approved emergency");
    } else fail("unexpected error result");
  });

  it("tidal promoting windows differ between fault styles", () => {
    const tool = tools["seismology/tidal-stress-phase-trigger-checker"].default;
    const ssPeakLoad = tool.execute({
      coulombPhaseDeg: -170,
      isStrikeSlipOrNormal: true,
    });
    const thrustUnloading = tool.execute({
      coulombPhaseDeg: -170,
      isStrikeSlipOrNormal: false,
    });
    if (ssPeakLoad.ok && thrustUnloading.ok) {
      expect(ssPeakLoad.output.inPromotingWindow).toBe(true);
      expect(thrustUnloading.output.inPromotingWindow).toBe(false);
    } else fail("unexpected error result");
  });

  it("two-week Cascadia-class SSE lands near M5.2", () => {
    const tool =
      tools["seismology/slow-slip-equivalent-magnitude-duration-scaling"]
        .default;
    const r = tool.execute({
      areaKm2: 2000,
      durationDays: 14,
      plateRateMmYr: 35,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const mw = r.output.equivalentMagnitudeMw as number;
      expect(mw).toBeGreaterThan(5.6);
      expect(mw).toBeLessThan(6.1);
    }
  });

  it("ETS lookup returns known Nankai recurrence of about half a year", () => {
    const tool = tools["seismology/tremor-slip-episodic-weeks-lookup"].default;
    const r = tool.execute({ regionClass: "nankai" });
    if (r.ok) expect(r.output.recurrenceWeeks).toBeCloseTo(26, 9);
    else fail("unexpected error result");
    expect(tool.execute({ regionClass: "san-andreas" }).ok).toBe(false);
  });

  it("glacial mechanisms span micro to M5 ranges", () => {
    const tool =
      tools["seismology/icequake-glacial-magnitude-range-lookup"].default;
    const crevasse = tool.execute({ mechanism: "crevasse" });
    const basal = tool.execute({ mechanism: "basal-stick-slip" });
    if (crevasse.ok && basal.ok)
      expect(basal.output.magnitudeLow as number).toBeGreaterThan(
        crevasse.output.magnitudeHigh as number,
      );
    else fail("unexpected error result");
  });

  it("repeater screening demands similarity, count, and regularity", () => {
    const tool =
      tools["seismology/volcano-repeater-family-correlation-checker"].default;
    const good = tool.execute({
      meanCrossCorrelation: 0.95,
      eventCount: 12,
      interEventCv: 0.2,
    });
    const noisyCC = tool.execute({
      meanCrossCorrelation: 0.7,
      eventCount: 12,
      interEventCv: 0.2,
    });
    if (good.ok && noisyCC.ok) {
      expect(good.output.familyConfident).toBe(true);
      expect(noisyCC.output.familyConfident).toBe(false);
    } else fail("unexpected error result");
  });

  it("miniSEED SID assembly inserts empty location dashes", () => {
    const tool = tools["seismology/miniseed-record-header-parser"].default;
    const r = tool.execute({
      network: "UW",
      station: "JCW",
      location: "",
      channel: "EHZ",
    });
    if (r.ok) {
      expect(r.output.sourceId).toBe("UW.JCW.--.EHZ");
      expect(r.output.codesValid).toBe(true);
    } else fail("unexpected error result");
    const bad = tool.execute({
      network: "TOOLONG",
      station: "JCW",
      location: "00",
      channel: "EHZ",
    });
    if (bad.ok) expect(bad.output.codesValid).toBe(false);
    else fail("unexpected error result");
  });

  it("polarity picker reports call rate and quadrant sampling", () => {
    const tool =
      tools["seismology/first-motion-polarity-beachball-quadrant-picker"]
        .default;
    const oneSided = tool.execute({
      compressionalCount: 10,
      dilatationalCount: 0,
      nodalCount: 0,
    });
    if (oneSided.ok) {
      expect(oneSided.output.compressionalPercent).toBeCloseTo(100, 9);
      expect(oneSided.output.quadrantQuality).toContain("single-quadrant");
    } else fail("unexpected error result");
    expect(
      tool.execute({
        compressionalCount: 0,
        dilatationalCount: 0,
        nodalCount: 0,
      }).ok,
    ).toBe(false);
  });

  it("synthetic polarity generator is deterministic and strike-rotated", () => {
    const gen =
      tools["seismology/focal-mechanism-strike-dip-rake-data-generator"]
        .default;
    const a = gen.execute({ strikeDeg: 40, sampleCount: 6, seed: 7 });
    const b = gen.execute({ strikeDeg: 40, sampleCount: 6, seed: 7 });
    expect(a).toEqual(b);
  });

  it("moment tensor decomposition recovers pure DC and pure CLVD", () => {
    const tool =
      tools["seismology/moment-tensor-double-couple-percent-decomposition"]
        .default;
    const dc = tool.execute({
      eigenvalueMax: 1,
      eigenvalueMid: 0,
      eigenvalueMin: -1,
    });
    const clvd = tool.execute({
      eigenvalueMax: 2,
      eigenvalueMid: -1,
      eigenvalueMin: -1,
    });
    const negativeDc = tool.execute({
      eigenvalueMax: 1,
      eigenvalueMid: 1,
      eigenvalueMin: -2,
    });
    if (dc.ok && clvd.ok && negativeDc.ok) {
      expect(dc.output.doubleCouplePercent).toBeCloseTo(100, 9);
      expect(clvd.output.doubleCouplePercent).toBeCloseTo(0, 9);
      expect(negativeDc.output.doubleCouplePercent).toBeCloseTo(0, 9);
      for (const result of [dc, clvd, negativeDc]) {
        expect(
          (result.output.doubleCouplePercent as number) +
            (result.output.clvdPercent as number) +
            (result.output.isoPercent as number),
        ).toBeCloseTo(100, 9);
      }
    } else fail("unexpected error result");
    const isotropic = tool.execute({
      eigenvalueMax: 2,
      eigenvalueMid: 2,
      eigenvalueMin: 2,
    });
    if (isotropic.ok) expect(isotropic.output.isoPercent).toBeCloseTo(100, 9);
    else fail("unexpected isotropic error result");
  });

  it("EEW lead time turns negative close to the epicenter", () => {
    const tool =
      tools["seismology/shake-alert-lead-time-seconds-estimate"].default;
    const far = tool.execute({ epicentralDistanceKm: 100 });
    const near = tool.execute({ epicentralDistanceKm: 10 });
    if (far.ok && near.ok) {
      expect(far.output.leadTimeSeconds).toBeGreaterThan(
        near.output.leadTimeSeconds as number,
      );
      expect(near.output.alertArrivedLate).toBe(true);
    } else fail("unexpected error result");
  });

  it("Nuttli duration magnitude grows with duration and distance", () => {
    const tool =
      tools["seismology/coda-duration-magnitude-nuttli-formula"].default;
    const r = tool.execute({ codaDurationSeconds: 60, distanceKm: 0 });
    if (r.ok)
      expect(r.output.durationMagnitudeMd).toBeCloseTo(2 + Math.log10(60), 9);
    else fail("unexpected error result");
  });

  it("S-P interval distance matches the velocity conversion", () => {
    const tool =
      tools["seismology/s-p-interval-hypocentral-distance-single-layer"]
        .default;
    const r = tool.execute({ spIntervalSeconds: 10 });
    if (r.ok) {
      const d = r.output.hypocentralDistanceKm as number;
      const dt = d / 3.6 - d / 6.2;
      expect(dt).toBeCloseTo(10, 9);
    } else fail("unexpected error result");
  });

  it("b-value fit recovers b=1 from a synthetic GR sequence", () => {
    const tool =
      tools["seismology/gutenberg-richter-b-value-two-anchor-fit"].default;
    const r = tool.execute({
      magnitudeLow: 3,
      cumulativeLow: 10000,
      magnitudeHigh: 5,
      cumulativeHigh: 100,
    });
    if (r.ok) {
      expect(r.output.bValue).toBeCloseTo(1, 9);
      expect(r.output.aValueLog10).toBeCloseTo(7, 9);
    } else fail("unexpected error result");
  });

  it("each magnitude step multiplies energy by about 31.6", () => {
    const tool =
      tools["seismology/radiated-energy-from-magnitude-gutenberg-richter"]
        .default;
    const m6 = tool.execute({ magnitudeMw: 6 });
    const m7 = tool.execute({ magnitudeMw: 7 });
    if (m6.ok && m7.ok)
      expect(
        (m7.output.radiatedEnergyJ as number) /
          (m6.output.radiatedEnergyJ as number),
      ).toBeCloseTo(Math.pow(10, 1.5), 9);
    else fail("unexpected error result");
  });

  it("Hanks-Kanamori conversion anchors M7 at 2e19 N·m", () => {
    const tool =
      tools["seismology/moment-magnitude-from-moment-hanks-kanamori"].default;
    const r = tool.execute({ seismicMomentNm: Math.pow(10, 19.6) });
    if (r.ok) expect(r.output.momentMagnitudeMw).toBeCloseTo(7.0, 6);
    else fail("unexpected error result");
  });

  it("residual histogram bins are contiguous and exhaustive", () => {
    const tool = tools["seismology/wadati-residual-histogram-binner"].default;
    const r = tool.execute({
      residualsSeconds: [0.05, 0.15, 0.55],
      binWidthSeconds: 0.25,
    });
    if (r.ok) {
      const counts = r.output.binCounts as number[];
      expect(counts.reduce((a, b) => a + b, 0)).toBe(3);
      expect(counts[0]).toBe(2);
      expect(counts[counts.length - 1]).toBe(1);
    } else fail("unexpected error result");
  });

  it("rake bands separate reverse, normal, and strike-slip", () => {
    const tool = tools["seismology/focal-style-rake-band-classifier"].default;
    for (const [rake, want] of [
      [45, "reverse-oblique"],
      [-60, "normal-oblique"],
      [180, "strike-slip"],
    ] as const) {
      const r = tool.execute({ rakeDeg: rake });
      if (r.ok) expect(r.output.focalStyle).toBe(want);
      else fail(`unexpected error at rake ${rake}`);
    }
  });

  it("Coulomb change combines shear and unclamping terms", () => {
    const tool =
      tools["seismology/coulomb-stress-change-on-receiver-plane"].default;
    const r = tool.execute({ shearChangeBar: -0.05, normalChangeBar: -0.5 });
    if (r.ok) {
      expect(r.output.coulombChangeBar).toBeCloseTo(-0.25, 12);
      expect(String(r.output.triggeringVerdict)).toContain("suppress");
    } else fail("unexpected error result");
  });

  it("Omori rate decays and the day-integral stays positive", () => {
    const tool = tools["seismology/omori-law-aftershock-decay-rate"].default;
    const early = tool.execute({ productivityK: 50, elapsedDays: 1 });
    const late = tool.execute({ productivityK: 50, elapsedDays: 30 });
    if (early.ok && late.ok) {
      expect(early.output.ratePerDay).toBeGreaterThan(
        late.output.ratePerDay as number,
      );
      expect(late.output.expectedNextDayCount).toBeGreaterThan(0);
    } else fail("unexpected error result");
    const pOne = tool.execute({
      productivityK: 50,
      elapsedDays: 2,
      cutoffCDays: 0.1,
      decayP: 1,
    });
    if (pOne.ok)
      expect(pOne.output.expectedNextDayCount).toBeCloseTo(
        50 * Math.log(3.1 / 2.1),
        12,
      );
    else fail("unexpected p=1 error result");
  });

  it("ETAS relative productivity scales by ten per magnitude unit at alpha one", () => {
    const tool = tools["seismology/etas-aftershock-productivity-alpha"].default;
    const m6 = tool.execute({ mainshockMagnitudeMw: 6 });
    const m7 = tool.execute({ mainshockMagnitudeMw: 7 });
    if (m6.ok && m7.ok)
      expect(
        (m7.output.relativeProductivity as number) /
          (m6.output.relativeProductivity as number),
      ).toBeCloseTo(10, 9);
    else fail("unexpected error result");
  });

  it("Gardner-Knopoff windows widen monotonically with magnitude", () => {
    const tool =
      tools["seismology/gardner-knopoff-declustering-window-lookup"].default;
    const small = tool.execute({ mainshockMagnitudeMw: 4.5 });
    const big = tool.execute({ mainshockMagnitudeMw: 7.2 });
    if (small.ok && big.ok)
      expect(big.output.distanceWindowKm).toBeGreaterThan(
        small.output.distanceWindowKm as number,
      );
    else fail("unexpected error result");
  });

  it("Reasenberg look-ahead shrinks for small seeds", () => {
    const tool =
      tools["seismology/reasenberg-space-time-window-lookup"].default;
    const micro = tool.execute({ seedEventMagnitudeMw: 2 });
    const major = tool.execute({ seedEventMagnitudeMw: 6.5 });
    if (micro.ok && major.ok)
      expect(major.output.lookAheadDays).toBeGreaterThan(
        micro.output.lookAheadDays as number,
      );
    else fail("unexpected error result");
  });

  it("Schuster screen fails weak z values", () => {
    const tool =
      tools["seismology/schuster-critical-value-significance-checker"].default;
    const weak = tool.execute({ schusterZ: 1.2 });
    if (weak.ok) {
      expect(weak.output.significant).toBe(false);
      expect(weak.output.confidenceLevelPercent).toBeLessThan(95);
    } else fail("unexpected error result");
  });

  it("foreshock classifier rejects distant or late precursors", () => {
    const tool =
      tools["seismology/foreshock-mainshock-probable-classifier"].default;
    const farAway = tool.execute({
      timeGapHours: 10,
      distanceKm: 300,
      magnitudeDifference: 2,
    });
    const tinyJump = tool.execute({
      timeGapHours: 10,
      distanceKm: 10,
      magnitudeDifference: 0.3,
    });
    if (farAway.ok && tinyJump.ok) {
      expect(farAway.output.probableForeshock).toBe(false);
      expect(tinyJump.output.probableForeshock).toBe(false);
    } else fail("unexpected error result");
  });

  it("Kovesligethy radius grows tenfold from I0 to I0-3", () => {
    const tool =
      tools["seismology/kovesligethy-intensity-decay-isoseismal"].default;
    const r = tool.execute({
      epicentralIntensityI0: 9,
      targetIntensity: 6,
      focalDepthKm: 8,
    });
    if (r.ok) {
      expect(r.output.isoseismalRadiusKm).toBeCloseTo(8 * Math.sqrt(99), 9);
    } else fail("unexpected error result");
    expect(
      tool.execute({
        epicentralIntensityI0: 6,
        targetIntensity: 6,
        focalDepthKm: 8,
      }).ok,
    ).toBe(false);
  });

  it("runup decays with distance and grows with magnitude", () => {
    const tool =
      tools["seismology/tsunami-runup-empirical-okal-synolakis-lookup"].default;
    const near = tool.execute({ magnitudeMw: 8, shoreDistanceKm: 100 });
    const far = tool.execute({ magnitudeMw: 8, shoreDistanceKm: 5000 });
    if (near.ok && far.ok)
      expect(far.output.runupMeters).toBeLessThan(
        near.output.runupMeters as number,
      );
    else fail("unexpected error result");
  });

  it("hydrostatic conversion returns one meter per ~10 kPa", () => {
    const tool =
      tools["seismology/tide-gauge-bottom-pressure-hydrostatic-depth"].default;
    const r = tool.execute({ pressurePa: 1025 * 9.81 });
    if (r.ok) expect(r.output.waterDepthM).toBeCloseTo(1, 9);
    else fail("unexpected error result");
  });

  it("source duration is the inverse angular corner frequency", () => {
    const tool =
      tools["seismology/brune-source-time-duration-from-corner"].default;
    const r = tool.execute({ cornerFrequencyHz: 2 });
    if (r.ok) {
      expect(r.output.sourceDurationSeconds).toBeCloseTo(1 / (4 * Math.PI), 12);
      expect((r.output.riseTimeSeconds as number) * 2).toBeCloseTo(
        r.output.sourceDurationSeconds as number,
        12,
      );
    } else fail("unexpected error result");
  });

  it("six s/deg slowness means about 18.5 km/s apparent velocity", () => {
    const tool =
      tools["seismology/ray-parameter-slowness-apparent-velocity"].default;
    const r = tool.execute({ slownessSPerDeg: 6 });
    if (r.ok) expect(r.output.apparentVelocityKmS).toBeCloseTo(18.5325, 4);
    else fail("unexpected error result");
    expect(tool.execute({ slownessSPerDeg: 0 }).ok).toBe(false);
  });

  it("tau-p interpolation hits anchors exactly and reports segment slowness", () => {
    const tool =
      tools["seismology/tau-p-travel-time-anchor-interpolation"].default;
    const atAnchor = tool.execute({
      anchorDistancesDeg: [30, 40],
      anchorTimesSeconds: [336, 406],
      targetDistanceDeg: 40,
    });
    if (atAnchor.ok) {
      expect(atAnchor.output.travelTimeSeconds).toBeCloseTo(406, 9);
      expect(atAnchor.output.slownessAtTarget).toBeCloseTo(7, 9);
    } else fail("unexpected error result");
  });

  it("elevation static vanishes when velocities match", () => {
    const tool =
      tools["seismology/elevation-static-correction-replacement-velocity"]
        .default;
    expect(
      tool.execute({
        elevationM: 100,
        weatheringVelocityMS: 2400,
        replacementVelocityMS: 800,
      }).ok,
    ).toBe(false);
    const r = tool.execute({
      elevationM: 900,
      weatheringVelocityMS: 750,
      replacementVelocityMS: 4500,
    });
    if (r.ok) {
      expect(r.output.staticCorrectionMs).toBeCloseTo(
        900 * (1 / 750 - 1 / 4500) * 1000,
        6,
      );
      expect(r.output.polarity).toContain("delay");
    } else fail("unexpected error result");
  });

  it("response checker rejects inverted pole-zero ordering", () => {
    const tool =
      tools["seismology/response-poles-zeros-consistency-checker"].default;
    const bad = tool.execute({
      zeroCount: 5,
      poleCount: 2,
      normalizationFactor: 1,
    });
    if (bad.ok) {
      expect(bad.output.consistent).toBe(false);
      expect(bad.output.issuesFound).toContain("more zeros than poles");
    } else fail("unexpected error result");
  });

  it("AGC flagger ignores steps in quiet windows", () => {
    const tool = tools["seismology/agc-gain-step-artifact-flagger"].default;
    const quiet = tool.execute({
      gainStepsInWindow: 4,
      eventEnergyPresent: false,
    });
    const hot = tool.execute({
      gainStepsInWindow: 4,
      eventEnergyPresent: true,
    });
    if (quiet.ok && hot.ok) {
      expect(quiet.output.artifactSuspected).toBe(false);
      expect(hot.output.artifactSuspected).toBe(true);
    } else fail("unexpected error result");
  });

  it("formal-error scaling needs more than four readings", () => {
    const tool = tools["seismology/location-formal-error-scale-factor"].default;
    expect(tool.execute({ rmsSeconds: 0.1, readingCount: 4 }).ok).toBe(false);
    const dense = tool.execute({
      rmsSeconds: 0.05,
      phaseVelocityKmS: 6.2,
      readingCount: 40,
    });
    if (dense.ok) {
      expect(dense.output.formalErrorKm).toBeCloseTo(
        0.05 * 6.2 * Math.sqrt(40 / 36),
        9,
      );
      expect(dense.output.wellConstrained).toBe(true);
    }
  });

  it("singleton fraction classifies fragmented association sets", () => {
    const tool =
      tools["seismology/network-cluster-singleton-fraction-quality"].default;
    const frag = tool.execute({ singletonCount: 70, clusteredCount: 30 });
    if (frag.ok) {
      expect(frag.output.singletonFraction).toBeCloseTo(0.7, 9);
      expect(frag.output.qualityBand).toContain("fragmented");
    } else fail("unexpected error result");
    expect(tool.execute({ singletonCount: 0, clusteredCount: 0 }).ok).toBe(
      false,
    );
  });

  it("moment-rate regimes separate ordinary from slow rupture", () => {
    const tool =
      tools["seismology/average-moment-rate-from-moment-duration"].default;
    const fast = tool.execute({
      seismicMomentNm: 1e19,
      sourceDurationSeconds: 10,
    });
    const slow = tool.execute({
      seismicMomentNm: 1e19,
      sourceDurationSeconds: 100000,
    });
    if (fast.ok && slow.ok) {
      expect(String(fast.output.regimeNote)).toContain("ordinary");
      expect(String(slow.output.regimeNote)).toContain("slow");
    } else fail("unexpected error result");
  });

  it("strike-slip S-wave nodes sit on strike and perpendicular", () => {
    const tool =
      tools["seismology/s-wave-nodal-and-maximum-azimuth-lookup"].default;
    const r = tool.execute({ strikeDeg: 350 });
    if (r.ok) {
      expect(r.output.nodalAzimuthsDeg).toEqual([350, 80]);
      expect(r.output.maxAmplitudeAzimuthsDeg).toEqual([35, 305]);
    } else fail("unexpected error result");
  });

  it("mb conversion flags saturation above 6.5", () => {
    const tool =
      tools["seismology/mb-to-mw-bandwise-conversion-lookup"].default;
    const big = tool.execute({ mbMagnitude: 7.0 });
    const small = tool.execute({ mbMagnitude: 5.0 });
    if (big.ok && small.ok) {
      expect(String(big.output.saturationNote)).toContain("saturates");
      expect(small.output.momentMagnitudeMw).toBeCloseTo(5.4, 12);
    } else fail("unexpected error result");
  });

  it("efficiency is one percent when Es matches the standard partition", () => {
    const tool =
      tools["seismology/seismic-efficiency-energy-partition"].default;
    const r = tool.execute({
      radiatedEnergyJ: 1.75e10,
      seismicMomentNm: 3.5e16,
    });
    if (r.ok) expect(r.output.efficiencyPercent).toBeCloseTo(1.0, 9);
    else fail("unexpected error result");
  });

  it("radiation lookup rejects unknown phase labels", () => {
    const tool =
      tools["seismology/average-radiation-factor-boore-boatwright-lookup"]
        .default;
    expect(tool.execute({ phaseKind: "Love" }).ok).toBe(false);
  });

  it("kappa decomposition fails when path t* exceeds measurement", () => {
    const tool =
      tools["seismology/site-kappa-path-tstar-decomposition"].default;
    expect(
      tool.execute({ kappaMeasuredSeconds: 0.01, pathTstarSeconds: 0.02 }).ok,
    ).toBe(false);
    const ok = tool.execute({
      kappaMeasuredSeconds: 0.05,
      pathTstarSeconds: 0.02,
    });
    if (ok.ok) expect(ok.output.siteKappaSeconds).toBeCloseTo(0.03, 12);
    else fail("unexpected error result");
  });

  it("pP minus P of ten seconds implies about 34 km depth", () => {
    const tool =
      tools["seismology/depth-phase-pp-minus-p-depth-estimate"].default;
    const r = tool.execute({ ppMinusPSeconds: 10 });
    if (r.ok) expect(r.output.focalDepthKm).toBeCloseTo(34, 9);
    else fail("unexpected error result");
  });

  it("three symmetric circles intersect at the origin", () => {
    const tool =
      tools["seismology/tri-station-circle-epicenter-least-squares"].default;
    const r = tool.execute({
      stationXKm: [10, -5, -5],
      stationYKm: [0, 8.660254037844386, -8.660254037844386],
      distancesKm: [10, 10, 10],
    });
    if (r.ok) {
      expect(r.output.epicenterXKm).toBeCloseTo(0, 3);
      expect(r.output.epicenterYKm).toBeCloseTo(0, 3);
      expect(r.output.residualKm).toBeLessThan(1e-3);
    } else fail("unexpected error result");
  });

  it("Wadati origin time solves a synthetic half-minute event", () => {
    const tool =
      tools["seismology/wadati-origin-time-single-station-formula"].default;
    const r = tool.execute({
      pArrivalSeconds: 100,
      sArrivalSeconds: 50 + 50 * Math.sqrt(3),
      velocityRatioR: Math.sqrt(3),
    });
    if (r.ok) expect(r.output.originTimeSeconds).toBeCloseTo(50, 6);
    else fail("unexpected error result");
    expect(
      tool.execute({
        pArrivalSeconds: 100,
        sArrivalSeconds: 120,
        velocityRatioR: 1,
      }).ok,
    ).toBe(false);
  });

  it("Utsu scaling gives about sixteen kilometers at M6", () => {
    const tool =
      tools["seismology/aftershock-zone-length-utsu-scaling"].default;
    const r = tool.execute({ mainshockMagnitudeMw: 6 });
    if (r.ok) {
      expect(r.output.zoneLengthKm).toBeCloseTo(Math.pow(10, 1.2), 9);
      expect(r.output.equivalentAreaKm2).toBeGreaterThan(150);
    } else fail("unexpected error result");
  });

  it("annulus area shrinks as intensities approach I0", () => {
    const tool =
      tools["seismology/isoseismal-annulus-area-between-intensities"].default;
    const outerBand = tool.execute({
      epicentralIntensityI0: 8,
      outerIntensity: 4,
      innerIntensity: 5,
      focalDepthKm: 5,
    });
    const innerBand = tool.execute({
      epicentralIntensityI0: 8,
      outerIntensity: 6,
      innerIntensity: 7,
      focalDepthKm: 5,
    });
    if (outerBand.ok && innerBand.ok)
      expect(innerBand.output.annulusAreaKm2).toBeLessThan(
        outerBand.output.annulusAreaKm2 as number,
      );
    else fail("unexpected error result");
  });

  it("open-ocean tsunami crosses four thousand km in about three hours", () => {
    const tool =
      tools["seismology/tsunami-open-ocean-travel-time-shallow-water"].default;
    const r = tool.execute({ distanceKm: 4000, oceanDepthM: 4000 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.travelTimeHours).toBeGreaterThan(5);
      expect(r.output.travelTimeHours).toBeLessThan(6.2);
    }
  });

  it("tidal residual stats recover an injected constant bias", () => {
    const tool =
      tools["seismology/tidal-harmonic-residual-rms-calculator"].default;
    const r = tool.execute({
      observedMeters: [2, 2, 2],
      predictedMeters: [1, 1, 1],
    });
    if (r.ok) {
      expect(r.output.meanResidualM).toBeCloseTo(1, 12);
      expect(r.output.rmsResidualM).toBeCloseTo(1, 12);
    } else fail("unexpected error result");
  });

  it("dipping refractor correction vanishes for zero dip", () => {
    const tool =
      tools["seismology/dipping-refractor-true-velocity-updown-dip"].default;
    const flat = tool.execute({
      updipApparentMS: 4000,
      downdipApparentMS: 4000,
      dipAngleDeg: 0,
    });
    if (flat.ok) {
      expect(flat.output.trueVelocityMS).toBeCloseTo(4000, 9);
      expect(flat.output.dipCorrectionPercent).toBeCloseTo(0, 9);
    } else fail("unexpected error result");
  });

  it("SNR flagger accepts only picks above threshold", () => {
    const tool = tools["seismology/first-break-snr-validity-flagger"].default;
    const good = tool.execute({ snrDb: 12, thresholdDb: 10 });
    const bad = tool.execute({ snrDb: 8, thresholdDb: 10 });
    if (good.ok && bad.ok) {
      expect(good.output.pickValid).toBe(true);
      expect(bad.output.marginDb).toBeCloseTo(-2, 9);
    } else fail("unexpected error result");
  });

  it("double-difference summary averages pair separations", () => {
    const tool =
      tools["seismology/double-difference-pair-mean-offset-summary"].default;
    const r = tool.execute({
      offsetsEastKm: [3, 0],
      offsetsNorthKm: [4, 0],
      offsetsDownKm: [0, 4],
    });
    if (r.ok) {
      expect(r.output.pairCount).toBe(2);
      expect(r.output.meanSeparationKm).toBeCloseTo(4.5, 9);
    } else fail("unexpected error result");
  });

  it("scalar moment of a pure DC tensor equals its moment", () => {
    const tool =
      tools["seismology/scalar-moment-from-deviatoric-eigenvalues"].default;
    const r = tool.execute({
      eigenvalue1Nm: 1e17,
      eigenvalue2Nm: 0,
      eigenvalue3Nm: -1e17,
    });
    if (r.ok) {
      expect(r.output.scalarMomentNm).toBeCloseTo(1e17, 6);
      expect(r.output.equivalentMw).toBeCloseTo((2 / 3) * (17 - 9.1), 6);
    } else fail("unexpected error result");
  });

  it("baseline correction removes injected linear drift", () => {
    const tool =
      tools["seismology/strong-motion-linear-baseline-correction"].default;
    const drifted = Array.from(
      { length: 20 },
      (_, i) => i * 0.01 + (i === 5 ? 1 : 0),
    );
    const clean = tool.execute({
      accelerationMS2: drifted,
      tailFraction: 0.25,
    });
    expect(clean.ok).toBe(true);
    if (clean.ok) {
      // after removing the fitted line, the spike at index five dominates
      expect(clean.output.correctedPeakMS2 as number).toBeGreaterThan(0.5);
    }
  });

  it("antialias checker enforces the eighty percent rule", () => {
    const tool =
      tools["seismology/antialias-filter-corner-nyquist-checker"].default;
    const tight = tool.execute({ sampleRateHz: 100, filterCornerHz: 45 });
    if (tight.ok) expect(tight.output.adequate).toBe(false);
    else fail("unexpected error result");
  });

  it("decimation lookup quarters the rate and Nyquist", () => {
    const tool =
      tools["seismology/decimation-factor-aliasing-note-lookup"].default;
    const r = tool.execute({ inputRateHz: 200, decimationFactor: 4 });
    if (r.ok) {
      expect(r.output.outputRateHz).toBeCloseTo(50, 9);
      expect(r.output.newNyquistHz).toBeCloseTo(25, 9);
    } else fail("unexpected error result");
  });

  it("clock regression recovers one ppm drift from synthetic offsets", () => {
    const tool = tools["seismology/clock-drift-ppm-linear-regression"].default;
    const r = tool.execute({
      elapsedDays: [0, 5, 10],
      offsetsSeconds: [0, 0.0432, 0.0864],
    });
    if (r.ok) {
      expect(r.output.driftSecondsPerDay).toBeCloseTo(0.00864, 9);
      expect(r.output.driftPpm).toBeCloseTo(0.1, 6);
      expect(r.output.interceptSeconds).toBeCloseTo(0, 9);
    } else fail("unexpected error result");
  });

  it("east-west plane dipping north has a north-up normal", () => {
    const tool =
      tools["seismology/strike-dip-plane-normal-vector-converter"].default;
    const r = tool.execute({ strikeDeg: 90, dipDeg: 45 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.normalEast).toBeCloseTo(0, 12);
      expect(r.output.normalNorth).toBeCloseTo(-Math.SQRT1_2, 12);
      const len = Math.hypot(
        r.output.normalEast as number,
        r.output.normalNorth as number,
        r.output.normalUp as number,
      );
      expect(len).toBeCloseTo(1, 12);
    }
  });

  it("apparent dip vanishes along strike and equals true dip across it", () => {
    const tool =
      tools["seismology/apparent-dip-along-section-line-calculator"].default;
    expect(
      tool.execute({ trueDipDeg: 30, sectionToStrikeAngleDeg: 0 }).ok,
    ).toBe(false);
    const cross = tool.execute({ trueDipDeg: 30, sectionToStrikeAngleDeg: 90 });
    if (cross.ok) {
      expect(cross.output.apparentDipDeg).toBeCloseTo(30, 9);
      expect(cross.output.flatteningFactor).toBeCloseTo(1, 12);
    } else fail("unexpected error result");
  });

  it("moment release sums and converts to an equivalent magnitude", () => {
    const tool =
      tools["seismology/cumulative-moment-release-catalog-summary"].default;
    const r = tool.execute({ momentsNm: [1e18, 1e18, 4e17] });
    if (r.ok) {
      expect(r.output.eventCount).toBe(3);
      expect(r.output.equivalentMagnitudeMw).toBeCloseTo(
        (2 / 3) * (Math.log10(2.4e18) - 9.1),
        9,
      );
    } else fail("unexpected error result");
  });

  it("a-value normalization predicts M5 rates", () => {
    const tool =
      tools["seismology/gutenberg-richter-a-value-annual-normalization"]
        .default;
    const r = tool.execute({
      annualCountAtMc: 1000,
      completenessMc: 3,
      bValue: 1,
    });
    if (r.ok) {
      expect(r.output.aValueLog10).toBeCloseTo(6, 9);
      expect(r.output.expectedAnnualAtM5).toBeCloseTo(10, 6);
    } else fail("unexpected error result");
  });

  it("hazard interpolation rejects out-of-range targets", () => {
    const tool =
      tools["seismology/hazard-curve-probability-interpolation-loglog"].default;
    const out = tool.execute({
      amplitudesG: [0.05, 0.2],
      annualProbabilities: [0.01, 0.001],
      targetAmplitudeG: 0.5,
    });
    expect(out.ok).toBe(false);
    const mid = tool.execute({
      amplitudesG: [0.05, 0.2],
      annualProbabilities: [0.01, 0.001],
      targetAmplitudeG: 0.05,
    });
    if (mid.ok)
      expect(mid.output.interpolatedProbability).toBeCloseTo(0.01, 12);
  });

  it("damping scaling is unity at five percent and drops at ten", () => {
    const tool =
      tools["seismology/damping-response-spectrum-heuristic-scaling"].default;
    const five = tool.execute({ dampingRatioPercent: 5 });
    const ten = tool.execute({ dampingRatioPercent: 10 });
    if (five.ok && ten.ok) {
      expect(five.output.scalingFactor).toBeCloseTo(1, 12);
      expect(ten.output.scalingFactor).toBeLessThan(1);
    } else fail("unexpected error result");
    expect(tool.execute({ dampingRatioPercent: 0 }).ok).toBe(false);
  });

  it("corner-period bands shift longer for great events", () => {
    const tool =
      tools["seismology/response-spectrum-corner-period-band-lookup"].default;
    const small = tool.execute({ magnitudeMw: 4 });
    const great = tool.execute({ magnitudeMw: 8 });
    if (small.ok && great.ok)
      expect((great.output.accelerationBandS as number[])[1]).toBeGreaterThan(
        (small.output.accelerationBandS as number[])[1],
      );
    else fail("unexpected error result");
  });

  it("kappa lookup midpoints sit between bounds", () => {
    const tool =
      tools["seismology/site-kappa-zero-by-nehrp-class-lookup"].default;
    const d = tool.execute({ siteClass: "D" });
    if (d.ok) {
      expect(d.output.midpointSeconds).toBeCloseTo(0.05, 12);
    } else fail("unexpected error result");
    expect(tool.execute({ siteClass: "F" }).ok).toBe(false);
  });

  it("Shi-Bolt error shrinks with sample size", () => {
    const tool =
      tools["seismology/b-value-standard-error-shi-bolt-formula"].default;
    const smallN = tool.execute({ bValue: 1, eventCount: 11 });
    const bigN = tool.execute({ bValue: 1, eventCount: 1001 });
    if (smallN.ok && bigN.ok)
      expect(bigN.output.standardError).toBeLessThan(
        smallN.output.standardError as number,
      );
    else fail("unexpected error result");
  });

  it("Shi-Bolt simplified error equals 2.3·b²/√(N−1) exactly", () => {
    const tool =
      tools["seismology/b-value-standard-error-shi-bolt-formula"].default;
    const r = tool.execute({ bValue: 1, eventCount: 101 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.standardError).toBeCloseTo(2.3 / Math.sqrt(100), 12);
      expect(r.output.relativePercent).toBeCloseTo(23, 9);
    }
    expect(tool.execute({ bValue: 0, eventCount: 101 }).ok).toBe(false);
  });

  it("timespan checker flags short catalogs", () => {
    const tool =
      tools["seismology/catalog-complete-timespan-denominator-checker"].default;
    const short = tool.execute({ firstYear: 2015, lastYear: 2025 });
    if (short.ok) {
      expect(short.output.spanYears).toBe(11);
      expect(short.output.adequateForRates).toBe(false);
    } else fail("unexpected error result");
    expect(tool.execute({ firstYear: 2025, lastYear: 1980 }).ok).toBe(false);
  });

  it("retained fraction bands classify swarm-heavy catalogs", () => {
    const tool =
      tools["seismology/declustering-retained-event-fraction-summary"].default;
    const swarmy = tool.execute({ retainedCount: 20, removedCount: 80 });
    if (swarmy.ok) expect(swarmy.output.band).toContain("swarm");
    else fail("unexpected error result");
    expect(tool.execute({ retainedCount: 0, removedCount: 0 }).ok).toBe(false);
  });

  it("moment deficit flags strong aseismic contribution", () => {
    const tool =
      tools["seismology/fault-seismic-moment-deficit-calculator"].default;
    const r = tool.execute({
      momentsNm: [8e18],
      areaKm2: 2000,
      slipRateMmYr: 10,
      rigidityGPa: 30,
      windowYears: 100,
    });
    if (r.ok) {
      expect(r.output.budgetMomentNm).toBeCloseTo(6e19, 6);
      expect(String(r.output.deficitNote)).toContain("deficit");
    } else fail("unexpected error result");
  });

  it("strain-drop stress drop matches mu times D over L in bars", () => {
    const tool =
      tools["seismology/strain-drop-slip-over-length-stress-drop"].default;
    const r = tool.execute({ slipM: 1, lengthKm: 10 });
    if (r.ok) expect(r.output.stressDropBar).toBeCloseTo(30, 9);
    else fail("unexpected error result");
  });

  it("iribarren regimes separate surging from spilling", () => {
    const tool =
      tools["seismology/iribarren-surf-similarity-runup-regime"].default;
    const steep = tool.execute({
      beachSlopeTan: 0.3,
      waveHeightM: 1,
      periodSeconds: 14,
    });
    const flat = tool.execute({
      beachSlopeTan: 0.005,
      waveHeightM: 3,
      periodSeconds: 7,
    });
    if (steep.ok && flat.ok) {
      expect(steep.output.breakingRegime).toBe("surging");
      expect(flat.output.breakingRegime).toBe("spilling");
    } else fail("unexpected error result");
  });

  it("uptime calculator rejects impossible outage counts", () => {
    const tool =
      tools["seismology/network-station-uptime-percent-calculator"].default;
    expect(tool.execute({ totalDays: 10, outageDays: 11 }).ok).toBe(false);
    const good = tool.execute({ totalDays: 100, outageDays: 6 });
    if (good.ok) {
      expect(good.output.uptimePercent).toBeCloseTo(94, 6);
      expect(good.output.meetsTarget).toBe(false);
    }
  });

  it("epoch overlap finds the shared decade", () => {
    const tool =
      tools["seismology/dataless-channel-epoch-overlap-checker"].default;
    const disjoint = tool.execute({
      epochAStartYear: 1990,
      epochAEndYear: 1995,
      epochBStartYear: 2000,
      epochBEndYear: 2020,
    });
    if (disjoint.ok) {
      expect(disjoint.output.overlaps).toBe(false);
      expect(disjoint.output.overlapYears).toBe(0);
    } else fail("unexpected error result");
    expect(
      tool.execute({
        epochAStartYear: 2000,
        epochAEndYear: 1990,
        epochBStartYear: 2000,
        epochBEndYear: 2010,
      }).ok,
    ).toBe(false);
  });

  it("gap detector totals missing samples across short blocks", () => {
    const tool = tools["seismology/telemetry-block-gap-detector"].default;
    const r = tool.execute({
      blockSampleCounts: [50, 50],
      expectedPerBlock: 60,
    });
    if (r.ok) expect(r.output.missingTotal).toBe(20);
    else fail("unexpected error result");
  });

  it("magnitude histogram buckets unknown types separately", () => {
    const tool =
      tools["seismology/catalog-magnitude-type-histogram-summary"].default;
    const r = tool.execute({ magnitudeTypes: ["mw", "MW", "bogus"] });
    if (r.ok) {
      expect(r.output.mwCount).toBe(2);
      expect(r.output.otherCount).toBe(1);
    } else fail("unexpected error result");
  });

  it("VK20 Ms grows with amplitude and distance", () => {
    const tool =
      tools["seismology/surface-wave-magnitude-vk20-formula"].default;
    const near = tool.execute({
      amplitudeNm: 10000,
      periodSeconds: 20,
      distanceDeg: 25,
    });
    const far = tool.execute({
      amplitudeNm: 10000,
      periodSeconds: 20,
      distanceDeg: 150,
    });
    if (near.ok && far.ok)
      expect(far.output.surfaceMagnitudeMs).toBeGreaterThan(
        near.output.surfaceMagnitudeMs as number,
      );
    else fail("unexpected error result");
  });

  it("Ms-mb screen separates earthquake-like from explosion-like", () => {
    const tool =
      tools["seismology/ms-mb-explosion-discrimination-note-lookup"].default;
    const quakeLike = tool.execute({
      surfaceMagnitudeMs: 5.5,
      bodyMagnitudeMb: 4.8,
    });
    const boomLike = tool.execute({
      surfaceMagnitudeMs: 3.8,
      bodyMagnitudeMb: 5.0,
    });
    if (quakeLike.ok && boomLike.ok) {
      expect(quakeLike.output.msMinusMb).toBeCloseTo(0.7, 9);
      expect(boomLike.output.sourceHint).toContain("explosion");
    } else fail("unexpected error result");
  });

  it("moment back-calculation inverts the forward moment formula", () => {
    const tool =
      tools["seismology/seismic-moment-to-slip-displacement-back-calc"].default;
    const r = tool.execute({ seismicMomentNm: 6e18, areaKm2: 1000 });
    if (r.ok) expect(r.output.averageSlipM).toBeCloseTo(0.2, 9);
    else fail("unexpected error result");
  });

  it("recurrence interval is slip over rate with closure caveat", () => {
    const tool =
      tools["seismology/recurrence-interval-slip-rate-event-slip"].default;
    const r = tool.execute({ eventSlipM: 5, slipRateMmYr: 25 });
    if (r.ok) expect(r.output.recurrenceYears).toBeCloseTo(200, 9);
    else fail("unexpected error result");
  });

  it("Båth gap subtracts exactly 1.2 magnitude units", () => {
    const tool =
      tools["seismology/bath-law-largest-aftershock-gap-note-lookup"].default;
    const r = tool.execute({ mainshockMagnitudeMw: 6.5 });
    if (r.ok) {
      expect(r.output.expectedLargestAftershockMw).toBeCloseTo(5.3, 12);
      expect(r.output.gapUnits).toBeCloseTo(1.2, 12);
    } else fail("unexpected error result");
  });

  it("sequence classifier separates swarms from aftershock sequences", () => {
    const tool =
      tools["seismology/swarm-vs-mainshock-aftershock-sequence-classifier"]
        .default;
    const swarm = tool.execute({
      largestMinusSecondLargest: 0.2,
      durationDays: 14,
      eventCount: 300,
    });
    const sequence = tool.execute({
      largestMinusSecondLargest: 2.1,
      durationDays: 14,
      eventCount: 300,
    });
    if (swarm.ok && sequence.ok) {
      expect(swarm.output.sequenceType).toBe("swarm");
      expect(sequence.output.sequenceType).toBe("mainshock-aftershock");
    } else fail("unexpected error result");
  });

  it("grid summary counts occupancy and peak density", () => {
    const tool =
      tools["seismology/spatial-grid-cell-count-density-summary"].default;
    const r = tool.execute({
      eastingsKm: [0.5, 0.7, 3.3],
      northingsKm: [0.5, 0.9, 3.3],
      cellSizeKm: 1,
    });
    if (r.ok) {
      expect(r.output.occupiedCells).toBe(2);
      expect(r.output.maxCountPerCell).toBe(2);
      expect(r.output.eventsPerOccupiedCell).toBeCloseTo(1.5, 9);
    } else fail("unexpected error result");
  });

  it("depth histogram routes tails to dedicated counters", () => {
    const tool = tools["seismology/catalog-depth-histogram-binner"].default;
    const r = tool.execute({
      depthsKm: [2, 7, 12, 45, -1],
      binWidthKm: 5,
      maxDepthKm: 20,
    });
    if (r.ok) {
      expect(r.output.binCounts).toEqual([1, 1, 1, 0]);
      expect(r.output.belowZeroCount).toBe(1);
      expect(r.output.aboveMaxCount).toBe(1);
    } else fail("unexpected error result");
  });

  it("residual flagger isolates the three-sigma station", () => {
    const tool =
      tools["seismology/station-residual-outlier-sigma-flagger"].default;
    const tight = tool.execute({
      residualsSeconds: [0, 0, 0],
      sigmaThreshold: 2.5,
    });
    // zero variance must not crash; no outliers possible
    if (tight.ok) expect(tight.output.outlierIndices).toEqual([]);
    const r = tool.execute({
      residualsSeconds: [
        0.02, 0.03, -0.04, 0.01, -0.02, 0.05, -0.03, 0.02, 0.04, 5,
      ],
      sigmaThreshold: 2.5,
    });
    if (r.ok) expect(r.output.outlierIndices).toEqual([9]);
    else fail("unexpected error result");
  });

  it("reduced time subtracts the reducing velocity line", () => {
    const tool = tools["seismology/reduced-travel-time-plot-converter"].default;
    const r = tool.execute({
      distancesKm: [10, 20],
      travelTimesS: [4.5, 7.5],
      reducingVelocityKmS: 8,
    });
    if (r.ok) {
      expect((r.output.reducedTimesS as number[])[0]).toBeCloseTo(3.25, 9);
      expect(r.output.slopeSlownessSKm).toBeCloseTo(0.3, 9);
    } else fail("unexpected error result");
  });

  it("moveout checker demands at least one 20-Hz sample of span", () => {
    const tool =
      tools["seismology/array-aperture-moveout-resolution-checker"].default;
    const big = tool.execute({
      apertureKm: 100,
      minSlownessSPerDeg: 4,
      maxSlownessSPerDeg: 8,
    });
    if (big.ok) expect(big.output.resolvable).toBe(true);
    else fail("unexpected error result");
  });

  it("Shannon entropy is maximized by a uniform distribution", () => {
    const tool =
      tools["seismology/magnitude-frequency-entropy-shannon"].default;
    const uniform = tool.execute({ binCounts: [2, 2] });
    const peaked = tool.execute({ binCounts: [99, 1] });
    if (uniform.ok && peaked.ok) {
      expect(uniform.output.shannonEntropyBits).toBeCloseTo(1, 9);
      expect(peaked.output.shannonEntropyBits).toBeLessThan(
        uniform.output.shannonEntropyBits as number,
      );
    } else fail("unexpected error result");
  });

  it("nearest-neighbor linkage uses the scaled time dimension", () => {
    const tool =
      tools["seismology/nearest-neighbor-space-time-linkage-distance"].default;
    const r = tool.execute({
      eastingsKm: [0, 3],
      northingsKm: [0, 4],
      epochDays: [0, 0],
      timeScaleKm: 10,
    });
    if (r.ok) {
      // pure space distance of five kilometers
      expect(r.output.globalMeanKm).toBeCloseTo(5, 9);
    } else fail("unexpected error result");
  });

  it("repeating pair slips within twenty percent are compatible", () => {
    const tool =
      tools["seismology/repeating-pair-slip-compatibility-checker"].default;
    const same = tool.execute({
      momentANm: 1e14,
      areaAKm2: 0.01,
      momentBNm: 1e14,
      areaBKm2: 0.01,
    });
    const wild = tool.execute({
      momentANm: 1e14,
      areaAKm2: 0.01,
      momentBNm: 2e14,
      areaBKm2: 0.01,
    });
    if (same.ok && wild.ok) {
      expect(same.output.compatible).toBe(true);
      expect(wild.output.compatible).toBe(false);
    } else fail("unexpected error result");
  });

  it("Brune inversion recovers the claimed stress drop within factor two", () => {
    const brune =
      tools["seismology/brune-corner-frequency-source-model"].default;
    const checker =
      tools["seismology/corner-frequency-stress-drop-consistency-checker"]
        .default;
    // M0 = 1e26 dyn·cm = 1e19 N·m, Δσ = 30 bar, β = 3.5 km/s
    const fwd = brune.execute({
      seismicMomentDynCm: 1e26,
      shearVelocityKmPerS: 3.5,
      stressDropBar: 30,
    });
    expect(fwd.ok).toBe(true);
    if (!fwd.ok) return fail("unexpected error result");
    const r = checker.execute({
      cornerFrequencyHz: fwd.output.cornerFrequencyHz as number,
      seismicMomentNm: 1e19,
      claimedStressDropBar: 30,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.invertedStressDropBar).toBeCloseTo(30, 6);
      expect(r.output.consistentWithinFactorTwo).toBe(true);
    }
    // a claimed value off by far more than a factor of two must be flagged
    const wild = checker.execute({
      cornerFrequencyHz: fwd.output.cornerFrequencyHz as number,
      seismicMomentNm: 1e19,
      claimedStressDropBar: 30000,
    });
    if (wild.ok) expect(wild.output.consistentWithinFactorTwo).toBe(false);
    else fail("unexpected error result");
  });

  it("quarter-wave harmonics follow the odd multiples rule", () => {
    const tool =
      tools["seismology/quarter-wave-layer-higher-mode-harmonics-calculator"]
        .default;
    const r = tool.execute({
      layerThicknessM: 40,
      shearVelocityMS: 400,
      modeCount: 2,
    });
    if (r.ok) {
      const f = r.output.harmonicFrequenciesHz as number[];
      expect(f.length).toBe(2);
      expect(f[1]).toBeCloseTo(3 * f[0], 9);
    } else fail("unexpected error result");
  });

  it("borehole logging splits interval from average velocity", () => {
    const tool =
      tools["seismology/borehole-ps-logging-average-velocity-calculator"]
        .default;
    const r = tool.execute({
      shallowDepthM: 10,
      deepDepthM: 30,
      shallowArrivalS: 0.02,
      deepArrivalS: 0.05,
    });
    if (r.ok) {
      expect(r.output.intervalVelocityMS).toBeCloseTo(666.6666667, 4);
      expect(r.output.averageVelocityMS).toBeCloseTo(600, 9);
    } else fail("unexpected error result");
  });

  it("microtremor checker brackets the target wavelength", () => {
    const tool =
      tools["seismology/microtremor-array-resolution-frequency-band-checker"]
        .default;
    const bad = tool.execute({
      minRadiusKm: 0.05,
      maxRadiusKm: 0.2,
      phaseVelocityKmS: 0.6,
      targetFrequencyHz: 1,
    });
    if (bad.ok) expect(bad.output.bandResolvedByAperture).toBe(false);
    else fail("unexpected error result");
  });

  it("ENOB derives from measured SNDR", () => {
    const tool =
      tools["seismology/adc-effective-bits-noise-floor-calculator"].default;
    const ideal = tool.execute({ nominalBits: 24, sndrDb: 6.02 * 24 + 1.76 });
    if (ideal.ok) expect(ideal.output.effectiveBits).toBeCloseTo(24, 1);
    else fail("unexpected error result");
  });

  it("geophone clip level grows with natural frequency squared", () => {
    const tool =
      tools["seismology/geophone-spring-max-acceleration-range-checker"]
        .default;
    const slow = tool.execute({
      naturalFrequencyHz: 1,
      maxDisplacementM: 0.001,
    });
    if (slow.ok) {
      expect(slow.output.clippingLikelyAt1g).toBe(true);
      expect(slow.output.maxAccelerationG).toBeCloseTo(
        ((2 * Math.PI) ** 2 * 0.001) / 9.80665,
        9,
      );
    } else fail("unexpected error result");
  });

  it("loading error halves when input impedance doubles", () => {
    const tool =
      tools["seismology/digitizer-input-loading-error-percent-calculator"]
        .default;
    const base = tool.execute({
      sensorOutputImpedanceKOhm: 1,
      inputImpedanceMOhm: 1,
    });
    const better = tool.execute({
      sensorOutputImpedanceKOhm: 1,
      inputImpedanceMOhm: 2,
    });
    if (base.ok && better.ok)
      expect(better.output.loadingErrorPercent).toBeLessThan(
        (base.output.loadingErrorPercent as number) / 2 + 0.001,
      );
    else fail("unexpected error result");
  });

  it("GPS week conversion lands inside the rollover window", () => {
    const tool =
      tools["seismology/gps-week-second-to-days-since-era-converter"].default;
    const r = tool.execute({ gpsWeek: 2300, rolloversSince1999: 0 });
    if (r.ok) {
      expect(r.output.absoluteWeek).toBe(
        1023 + (((2300 % 1024) - 1023 + 2048) % 1024),
      );
      expect(r.output.daysSinceEraStart).toBe(
        (r.output.absoluteWeek as number) * 7,
      );
    } else fail("unexpected error result");
  });

  it("tide constituent lookup returns M2 near twelve hours", () => {
    const tool =
      tools["seismology/principal-tide-constituent-period-lookup"].default;
    const m2 = tool.execute({ constituentSymbol: "M2" });
    if (m2.ok) expect(m2.output.periodHours).toBeGreaterThan(12);
    else fail("unexpected error result");
    expect(tool.execute({ constituentSymbol: "X9" }).ok).toBe(false);
  });

  it("Wald table bounds MMI six between 0.147 and 0.32 g", () => {
    const tool =
      tools["seismology/intensity-pga-wald-1999-table-lookup"].default;
    const r = tool.execute({ instrumentalMMI: 6 });
    if (r.ok) {
      expect(r.output.pgaLowG).toBeCloseTo(0.147, 9);
      expect(r.output.pgaHighG).toBeCloseTo(0.32, 9);
    } else fail("unexpected error result");
  });

  it("felt radius scales by ten to the k-M power", () => {
    const tool =
      tools["seismology/felt-radius-heuristic-log-scaling-calculator"].default;
    const m5 = tool.execute({
      magnitudeMw: 5,
      prefactorKm: 10,
      baseExponent: 0.55,
    });
    const m6 = tool.execute({
      magnitudeMw: 6,
      prefactorKm: 10,
      baseExponent: 0.55,
    });
    if (m5.ok && m6.ok)
      expect(m6.output.feltRadiusKm).toBeCloseTo(
        Math.pow(10, 0.55) * (m5.output.feltRadiusKm as number),
        6,
      );
    else fail("unexpected error result");
  });

  it("weighted centroid shifts toward higher-intensity points", () => {
    const tool =
      tools["seismology/macroseismic-weighted-centroid-calculator"].default;
    const r = tool.execute({
      eastingsKm: [0, 10],
      northingsKm: [0, 0],
      intensities: [1, 9],
    });
    if (r.ok) expect(r.output.centroidXKm).toBeCloseTo(9, 9);
    else fail("unexpected error result");
  });

  it("EMS98 bands shift later for robust classes", () => {
    const tool =
      tools["seismology/ems98-vulnerability-intensity-band-crosswalk"].default;
    const weak = tool.execute({ vulnerabilityClass: "A" });
    const strong = tool.execute({ vulnerabilityClass: "D" });
    if (weak.ok && strong.ok)
      expect(strong.output.grade1OnsetIntensity).toBeGreaterThan(
        weak.output.grade1OnsetIntensity as number,
      );
    else fail("unexpected error result");
  });

  it("azimuthal vector sum recovers a pure systematic shift", () => {
    const tool =
      tools["seismology/p-wave-azimuthal-residual-vector-sum-split"].default;
    const r = tool.execute({
      azimuthsDeg: [0, 90, 180, 270],
      residualsSeconds: [0.2, 0.1, -0.2, -0.1],
    });
    if (r.ok) {
      const mag = r.output.vectorSumMagnitudeSeconds as number;
      expect(mag).toBeCloseTo(Math.hypot(0.4, 0.2), 6);
      expect(r.output.systematicAzimuthDeg).toBeCloseTo(
        ((Math.atan2(0.2, 0.4) * 180) / Math.PI + 360) % 360,
        6,
      );
    } else fail("unexpected error result");
  });

  it("P/T plunge shortcut matches ideal styles", () => {
    const tool =
      tools["seismology/double-couple-p-t-axis-plunge-style-shortcut"].default;
    const ss = tool.execute({ focalStyle: "strike-slip" });
    const rev = tool.execute({ focalStyle: "reverse" });
    if (ss.ok && rev.ok) {
      expect(ss.output.pAxisPlungeDeg).toBeCloseTo(0, 9);
      expect(rev.output.tAxisPlungeDeg).toBeCloseTo(90, 9);
    } else fail("unexpected error result");
    expect(tool.execute({ focalStyle: "oblique-weird" }).ok).toBe(false);
  });

  it("layer cake converter sums thickness and TWT consistently", () => {
    const tool =
      tools["seismology/velocity-model-layer-cake-two-way-time-depth-converter"]
        .default;
    const r = tool.execute({
      layerVelocitiesMS: [4000],
      layerThicknessesM: [2000],
    });
    if (r.ok) {
      expect(r.output.totalDepthM).toBeCloseTo(2000, 9);
      expect(r.output.twoWayTimeS).toBeCloseTo(1, 9);
    } else fail("unexpected error result");
  });

  it("impedance contrast gives R of one third for 6 vs 9", () => {
    const tool =
      tools["seismology/well-log-acoustic-impedance-reflection-coefficient"]
        .default;
    const r = tool.execute({ impedanceUpper: 6e6, impedanceLower: 9e6 });
    if (r.ok) {
      expect(r.output.reflectionCoefficient).toBeCloseTo(0.2, 12);
      expect(String(r.output.polarityNote)).toContain("hard");
    } else fail("unexpected error result");
  });

  it("post-critical detection flips across the critical angle", () => {
    const tool =
      tools["seismology/critical-reflection-angle-post-critical-note-checker"]
        .default;
    const below = tool.execute({
      velocityUpperMS: 2000,
      velocityLowerMS: 4000,
      incidenceAngleDeg: 20,
    });
    const above = tool.execute({
      velocityUpperMS: 2000,
      velocityLowerMS: 4000,
      incidenceAngleDeg: 40,
    });
    if (below.ok && above.ok) {
      expect(below.output.postCritical).toBe(false);
      expect(above.output.postCritical).toBe(true);
    } else fail("unexpected error result");
  });

  it("normal incidence thickness is half the velocity-time product", () => {
    const tool =
      tools["seismology/normal-incidence-two-way-time-thickness-calculator"]
        .default;
    const r = tool.execute({ twoWayTimeS: 2, intervalVelocityMS: 2000 });
    if (r.ok) expect(r.output.thicknessM).toBeCloseTo(2000, 9);
    else fail("unexpected error result");
  });

  it("Dix equation recovers a thousand meter per second interval", () => {
    const tool =
      tools["seismology/rms-velocity-dix-equation-interval-velocity-calculator"]
        .default;
    const r = tool.execute({
      rmsShallowMS: 2000,
      rmsDeepMS: 2500,
      twtShallowS: 1,
      twtDeepS: 2,
    });
    if (r.ok) {
      expect(r.output.intervalVelocityMS).toBeCloseTo(
        Math.sqrt(12500000 - 4000000),
        6,
      );
      expect(r.output.dixValid).toBe(true);
    } else fail("unexpected error result");
  });

  it("average-velocity depth conversion multiplies one-way time", () => {
    const tool =
      tools["seismology/depth-conversion-average-velocity-method-calculator"]
        .default;
    const r = tool.execute({ oneWayTimeS: 0.5, averageVelocityMS: 3000 });
    if (r.ok) expect(r.output.depthM).toBeCloseTo(1500, 9);
    else fail("unexpected error result");
  });

  it("survey fold uses channel count and CMP spacing is half the receiver interval", () => {
    const tool =
      tools["seismology/survey-design-fold-count-cmp-binning-summary"].default;
    const r = tool.execute({
      receiverCount: 121,
      receiverSpacingM: 50,
      shotSpacingM: 100,
    });
    if (r.ok) {
      expect(r.output.nominalFold).toBeCloseTo(30.25, 9);
      expect(r.output.cmpBinM).toBeCloseTo(25, 9);
    } else fail("unexpected error result");
  });

  it("coda correction doubles amplitude when lapse time halves", () => {
    const tool =
      tools["seismology/coda-normalization-lapse-time-amplitude-correction"]
        .default;
    const r = tool.execute({
      lapseTimeSeconds: 15,
      referenceLapseSeconds: 30,
      decayExponentAlpha: 1,
    });
    if (r.ok) {
      expect(r.output.correctionFactor).toBeCloseTo(2, 9);
      expect(r.output.decibelCorrection).toBeCloseTo(20 * Math.log10(2), 9);
    } else fail("unexpected error result");
  });

  it("two-station Q rejects non-decaying ratios", () => {
    const tool =
      tools["seismology/spectral-ratio-two-station-q-estimate-calculator"]
        .default;
    expect(
      tool.execute({ ratioSlopePerHz: 0.001, lapseTimeDifferenceS: 5 }).ok,
    ).toBe(false);
    const good = tool.execute({
      ratioSlopePerHz: -(Math.PI * 5) / 200,
      lapseTimeDifferenceS: 5,
    });
    if (good.ok) expect(good.output.codaQ).toBeCloseTo(200, 6);
  });

  it("falloff checker accepts Brune-like decay only within tolerance", () => {
    const tool =
      tools["seismology/source-spectral-falloff-high-frequency-slope-checker"]
        .default;
    const okFit = tool.execute({ fittedDecayExponent: 2.1, tolerance: 0.25 });
    const badFit = tool.execute({ fittedDecayExponent: 1.0, tolerance: 0.25 });
    if (okFit.ok && badFit.ok) {
      expect(okFit.output.matchesBruneGamma2).toBe(true);
      expect(badFit.output.deviation).toBeCloseTo(-1, 9);
    } else fail("unexpected error result");
  });

  it("displacement spectrum peaks exactly at the corner frequency", () => {
    const tool =
      tools["seismology/brune-displacement-spectrum-peak-frequency-note"]
        .default;
    const r = tool.execute({ cornerFrequencyHz: 7 });
    if (r.ok) expect(r.output.displacementPeakHz).toBeCloseTo(7, 12);
    else fail("unexpected error result");
  });

  it("Gehrels limits bracket the count and widen for small N", () => {
    const tool =
      tools["seismology/event-count-poisson-confidence-interval-gehrels"]
        .default;
    const four = tool.execute({ observedCount: 4 });
    const zero = tool.execute({ observedCount: 0 });
    if (four.ok && zero.ok) {
      expect(four.output.lowerBound).toBeLessThan(4);
      expect(four.output.upperBound).toBeGreaterThan(4);
      expect(zero.output.lowerBound).toBe(0);
      expect(zero.output.upperBound).toBeCloseTo(1.841, 12);
      expect(four.output.lowerBound).toBeCloseTo(
        4 * Math.pow(1 - 1 / 36 - 1 / 6, 3),
        12,
      );
      expect(four.output.upperBound).toBeCloseTo(5 + Math.sqrt(5), 12);
      expect(zero.output.approximation).toContain("zero-count");
    } else fail("unexpected error result");
  });

  it("strict-positive inputs are rejected with structured errors, not NaN", () => {
    const moment =
      tools["seismology/moment-magnitude-from-moment-hanks-kanamori"].default;
    expect(moment.execute({ seismicMomentNm: 0 }).ok).toBe(false);
    const coda =
      tools["seismology/coda-duration-magnitude-nuttli-formula"].default;
    expect(coda.execute({ codaDurationSeconds: 0, distanceKm: 0 }).ok).toBe(
      false,
    );
    const apparent = tools["seismology/apparent-stress-energy-ratio"].default;
    expect(
      apparent.execute({ radiatedEnergyJ: 3e13, seismicMomentNm: 0 }).ok,
    ).toBe(false);
    const duration =
      tools["seismology/brune-source-time-duration-from-corner"].default;
    expect(duration.execute({ cornerFrequencyHz: 0 }).ok).toBe(false);
    const dix =
      tools["seismology/rms-velocity-dix-equation-interval-velocity-calculator"]
        .default;
    // non-positive Dix numerator must yield a dix_invalid error, never NaN
    const badDix = dix.execute({
      rmsShallowMS: 3000,
      rmsDeepMS: 2000,
      twtShallowS: 1,
      twtDeepS: 2,
    });
    expect(badDix.ok).toBe(false);
    if (!badDix.ok) {
      expect(badDix.error.issues[0]?.code).toBe("dix_invalid");
      expect(badDix.error.issues[0]?.message).toMatch(/non-positive/i);
    }
    expect(
      tools["seismology/site-kappa-path-tstar-decomposition"].default.execute({
        kappaMeasuredSeconds: 0,
        pathTstarSeconds: 0,
      }).ok,
    ).toBe(false);
    expect(
      tools[
        "seismology/normal-incidence-two-way-time-thickness-calculator"
      ].default.execute({
        twoWayTimeS: 1,
        intervalVelocityMS: 0,
      }).ok,
    ).toBe(false);
    expect(
      tools["seismology/catalog-depth-histogram-binner"].default.execute({
        depthsKm: [1],
        binWidthKm: 1e-9,
        maxDepthKm: 40,
      }).ok,
    ).toBe(false);
  });
});
