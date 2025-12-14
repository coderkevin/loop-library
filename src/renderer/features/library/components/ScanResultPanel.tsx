import React from 'react';

export function ScanResultPanel({
  scanCount,
  scanPreview,
}: {
  scanCount: number | null;
  scanPreview: string[];
}) {
  const filesFoundLabel = scanCount === null ? '(not scanned yet)' : String(scanCount);
  const hasPreview = scanPreview.length > 0;
  const previewItems = hasPreview
    ? scanPreview.map((p) => (
        <li key={p}>
          <code>{p}</code>
        </li>
      ))
    : null;

  return (
    <>
      <h2>Scan Result</h2>
      <p>
        Files found: <code>{filesFoundLabel}</code>
      </p>
      {hasPreview ? (
        <>
          <p>First 10 files:</p>
          <ol>{previewItems}</ol>
        </>
      ) : null}
    </>
  );
}
