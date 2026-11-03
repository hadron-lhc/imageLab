# AGENTS.md — ImageLab

## 1. Project Overview

ImageLab is a local-first image analysis and organization application.

Its goal is to let users import, analyze, filter, sort, compare and organize large image collections directly in their browser, without uploading their images to a server.

The initial engineering target is a collection of 1,000 images. The architecture must be designed to scale towards 5,000–10,000 images without requiring a complete rewrite.

The application may eventually support three use cases:

1. General photography: organize photos by color, brightness, sharpness, date, camera and other properties.
2. Machine Learning datasets: inspect image datasets, identify duplicates, detect low-quality images and analyze class distributions.
3. Scientific images: microscopy, biology and eventually medical imaging.

Do not attempt to implement all three use cases in the initial version. Build a reliable shared image-processing foundation first.

## 2. Main Engineering Principles

Always prioritize:

- Performance.
- Low memory consumption.
- Responsiveness.
- Local processing and privacy.
- Modularity.
- Testability.
- Maintainability.
- Measurable performance improvements.

Avoid premature optimization. Measure before introducing more complex technologies.

Do not introduce dependencies without a concrete technical reason.

Do not build abstractions that are not currently needed.

Do not sacrifice correctness for speed.

## 3. Architecture

Preferred initial architecture:

- TypeScript for application logic.
- React for the user interface, if a frontend framework is needed.
- Vite for development and bundling.
- Web Workers for CPU-intensive operations.
- createImageBitmap for image decoding where supported.
- OffscreenCanvas or Canvas for pixel processing.
- IndexedDB for persistent metadata and analysis results.
- Web Crypto API for cryptographic hashes.
- A modular image-analysis engine independent from the UI.

Rust and WebAssembly are potential future optimizations, not mandatory initial dependencies.

Do not rewrite working TypeScript algorithms in Rust without profiling evidence showing that doing so would provide a meaningful benefit.

The application must not require a backend for its core image-analysis functionality.

All image processing must happen locally unless the user explicitly enables a future remote feature.

Never upload user images automatically.

## 4. Initial Supported Scope

Initial image formats:

- JPEG / JPG
- PNG

Other formats must be rejected gracefully or explicitly marked as unsupported.

Initial target: 1,000 images.

The application must support:

- Multiple image import.
- Image dimensions and format extraction.
- File size extraction.
- EXIF metadata extraction where available.
- Average brightness.
- Contrast estimation.
- Average saturation.
- Dominant color extraction.
- Image sharpness estimation.
- Exact duplicate detection.
- Perceptual duplicate detection.
- Sorting and filtering using stored analysis results.
- Persistent analysis results.

Do not implement TIFF, DICOM, medical diagnosis, object detection or advanced scientific segmentation in the initial version.

## 5. Image Analysis Algorithms

Use algorithms that are explainable, deterministic where possible, and reasonably inexpensive.

### Metadata

Extract:

- File name.
- File size.
- MIME type.
- Width.
- Height.
- Aspect ratio.
- EXIF date, camera and lens when available.

Handle missing or invalid EXIF information without failing the analysis.

Respect image orientation when decoding and calculating visual metrics.

### Brightness and Contrast

Use luminance rather than averaging RGB channels directly.

A reasonable luminance approximation is:

Y = 0.2126R + 0.7152G + 0.0722B

Calculate average luminance and standard deviation.

Document the color-space assumptions.

### Saturation and Dominant Colors

Calculate average saturation using a documented color model.

For dominant colors, start with an efficient histogram-based approach or color quantization.

Do not run expensive clustering on every original full-resolution image unless benchmarks justify it.

### Sharpness

Use variance of the Laplacian as an initial sharpness estimator.

Calculate it on a reasonably sized grayscale representation rather than the original full-resolution image.

Document that the metric is an estimate and depends on image resolution and content.

### Exact Duplicates

Use SHA-256 over the original file bytes.

Do not confuse equal dimensions or equal visual appearance with byte-identical files.

### Perceptual Duplicates

Implement a perceptual hash, preferably pHash based on the discrete cosine transform.

Compare hashes using Hamming distance.

Make the similarity threshold configurable and validate it using known duplicate and non-duplicate examples.

Avoid an unnecessarily expensive all-pairs comparison when the dataset grows.

## 6. Performance and Memory Management

This is a core requirement, not a later enhancement.

Never decode all 1,000 original images simultaneously.

Never retain full-resolution RGBA buffers for the entire collection.

Use:

- Bounded processing queues.
- Controlled worker concurrency.
- Small processing batches.
- Downscaled representations for visual metrics.
- Thumbnail generation.
- Incremental result persistence.
- Backpressure when memory usage becomes high.
- Cancellation and error recovery.

Use navigator.hardwareConcurrency as a hint, not as an instruction to create an unlimited number of workers.

The main thread must remain responsive during processing.

Do not perform expensive image calculations in React rendering or UI event handlers.

The UI must display partial results while the remaining images are being processed.

Sorting and filtering must use previously calculated metadata, not reprocess images.

Cache results and avoid recalculating metrics when the source image and analysis configuration have not changed.

Avoid unnecessary copies of large ArrayBuffers. Use transferable buffers where appropriate.

## 7. Data Model

Keep the original file reference separate from the analysis results.

Each image must have:

- A stable internal ID.
- Source file information.
- Import status.
- Analysis status.
- Metadata.
- Visual metrics.
- Duplicate information.
- Analysis version.

Do not use the file name as the unique identifier.

Do not assume that two files with the same name are identical.

Keep the data model extensible so new analysis metrics can be added without breaking existing records.

Persist results using a versioned IndexedDB schema.

## 8. Benchmarking Requirements

The first milestone is a reproducible benchmark for 1,000 images.

Measure separately:

1. Import and file enumeration.
2. Image decoding.
3. Metadata extraction.
4. Brightness and contrast.
5. Saturation and dominant colors.
6. Sharpness.
7. SHA-256 hashing.
8. Perceptual hashing.
9. Persistence.
10. Total processing time.

Record:

- Total execution time.
- Images processed per second.
- Per-operation execution time.
- Median and p95 processing time.
- Failure rate.
- Peak or estimated memory consumption.
- Worker utilization.
- Main-thread responsiveness.

Run cold and warm tests separately.

Use a reproducible dataset and record its characteristics.

Do not claim that the application supports 10,000 images based only on a successful 1,000-image test.

Do not invent performance results. Every performance claim must come from an actual benchmark.

## 9. Testing

Write unit tests for individual algorithms.

Create fixtures containing:

- Identical files.
- Visually similar files with different compression.
- Resized copies.
- Rotated images.
- Images with different brightness.
- Blurry images.
- Images with missing EXIF.
- Corrupted files.
- Unsupported formats.

Test correctness independently from performance.

A fast algorithm that produces incorrect results is not an acceptable optimization.

Add regression tests whenever a bug is fixed.

## 10. Code Quality

- Use strict TypeScript.
- Prefer small, focused modules.
- Avoid large monolithic components.
- Separate UI, file handling, scheduling, algorithms and persistence.
- Use descriptive names.
- Document non-obvious algorithms.
- Handle errors explicitly.
- Avoid unnecessary dependencies.
- Do not silently swallow errors.
- Do not use `any` as a shortcut.

Keep the project easy to run locally.

Maintain a README with setup instructions, architecture decisions and benchmark methodology.

## 11. Agent Workflow

Before modifying code:

1. Inspect the existing repository.
2. Read this file.
3. Understand the current architecture and dependencies.
4. Identify what already exists.
5. Present a short implementation plan.

Work incrementally.

Implement one meaningful milestone at a time.

After each milestone:

1. Run relevant tests.
2. Run type checking and linting if configured.
3. Verify the application still works.
4. Report changed files.
5. Report benchmark results when relevant.
6. Explain remaining limitations.

Do not rewrite the project or replace existing dependencies without a clear reason.

Do not make destructive changes without explicit approval.

Do not claim that a feature works if it has not been tested.

## 12. Reasoning Effort Policy

Use the following reasoning levels when the coding environment supports them.

### LOW — Default

Use LOW for:

- Routine implementation.
- Simple UI components.
- Basic metadata extraction.
- Straightforward tests.
- Documentation.
- Small refactors.
- Formatting and lint fixes.
- Tasks with an already established design.

Do not spend MAX reasoning on routine coding.

### HIGH — Engineering Decisions

Switch to HIGH for:

- Architecture decisions.
- Worker scheduling and concurrency.
- Memory management.
- Image-processing algorithm selection.
- IndexedDB schema design.
- Performance bottlenecks.
- Difficult bugs.
- Browser compatibility issues.
- Benchmark analysis.
- Changes that affect multiple modules.

Use HIGH before implementing a significant architectural change.

### MAX — Critical Problems Only

Use MAX only when:

- A major architectural decision could cause expensive rework.
- A serious concurrency or memory problem cannot be resolved with HIGH.
- There is a difficult performance regression.
- Data integrity or privacy could be compromised.
- Multiple technically valid approaches require deep comparison.
- HIGH-level investigation has not produced a reliable solution.

Do not use MAX for routine implementation or ordinary debugging.

### Switching Rules

- Start in LOW unless the task clearly requires deeper reasoning.
- Increase reasoning effort when the complexity justifies it.
- Return to LOW after resolving the difficult decision.
- Explain briefly why a higher reasoning level is necessary.
- Never pretend to change the model's reasoning setting if the environment does not allow it.
- If manual switching is required, tell the user which level to select and why.
- Do not interrupt the user for permission to use HIGH on an ordinary engineering problem.

## 13. Final Principle

Build a fast, reliable and useful application.

Prefer a small working system with measured performance over a sophisticated architecture that has not been validated.

The goal is not to use the most advanced technologies.

The goal is to make ImageLab genuinely useful when processing thousands of images.
