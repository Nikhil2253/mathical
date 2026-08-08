"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";

interface ImageCropModalProps {
  file: File;
  onCancel: () => void;
  onCropComplete: (croppedFile: File) => void;
}

type CropRect = { x: number; y: number; width: number; height: number }; // all in %

export default function ImageCropModal({ file, onCancel, onCropComplete }: ImageCropModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropRect>({ x: 10, y: 10, width: 80, height: 80 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{
    mode: "move" | "resize";
    handle?: string;
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const onPointerDown = (
    e: React.PointerEvent,
    mode: "move" | "resize",
    handle?: string
  ) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { mode, handle, startX: e.clientX, startY: e.clientY, startCrop: { ...crop } };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragState.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragState.current.startY) / rect.height) * 100;
    const start = dragState.current.startCrop;

    if (dragState.current.mode === "move") {
      const newX = clamp(start.x + dxPct, 0, 100 - start.width);
      const newY = clamp(start.y + dyPct, 0, 100 - start.height);
      setCrop((c) => ({ ...c, x: newX, y: newY }));
      return;
    }

    let { x, y, width, height } = start;
    const handle = dragState.current.handle ?? "";
    if (handle.includes("e")) width = clamp(start.width + dxPct, 10, 100 - start.x);
    if (handle.includes("s")) height = clamp(start.height + dyPct, 10, 100 - start.y);
    if (handle.includes("w")) {
      const newWidth = clamp(start.width - dxPct, 10, start.x + start.width);
      x = start.x + start.width - newWidth;
      width = newWidth;
    }
    if (handle.includes("n")) {
      const newHeight = clamp(start.height - dyPct, 10, start.y + start.height);
      y = start.y + start.height - newHeight;
      height = newHeight;
    }
    setCrop({ x, y, width, height });
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const handleReset = () => setCrop({ x: 10, y: 10, width: 80, height: 80 });

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;
    setIsProcessing(true);

    const sx = (crop.x / 100) * img.naturalWidth;
    const sy = (crop.y / 100) * img.naturalHeight;
    const sw = (crop.width / 100) * img.naturalWidth;
    const sh = (crop.height / 100) * img.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob((blob) => {
      setIsProcessing(false);
      if (!blob) return;
      const croppedFile = new File(
        [blob],
        file.name.replace(/\.[^.]+$/, "") + "-cropped.png",
        { type: "image/png" }
      );
      onCropComplete(croppedFile);
    }, "image/png");
  };

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
  const cursorFor: Record<string, string> = {
    nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize",
    n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
  };
  const posFor = (h: string): React.CSSProperties => {
    const s: React.CSSProperties = { position: "absolute", cursor: cursorFor[h] };
    if (h.includes("n")) s.top = -6;
    if (h.includes("s")) s.bottom = -6;
    if (h.includes("w")) s.left = -6;
    if (h.includes("e")) s.right = -6;
    if (h === "n" || h === "s") { s.left = "50%"; s.transform = "translateX(-50%)"; }
    if (h === "e" || h === "w") { s.top = "50%"; s.transform = "translateY(-50%)"; }
    return s;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Crop your image</p>
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-muted hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative w-full touch-none select-none overflow-hidden  bg-black"
          style={{ aspectRatio: imgSize.width && imgSize.height ? `${imgSize.width}/${imgSize.height}` : "4/3" }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="To crop"
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
              onLoad={(e) => {
                const t = e.currentTarget;
                setImgSize({ width: t.naturalWidth, height: t.naturalHeight });
              }}
            />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-black/50"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${crop.y}%, ${crop.x}% ${crop.y}%, ${crop.x}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y}%, 0 ${crop.y}%)`,
            }}
          />

          <div
            className="absolute cursor-move border-2 border-white"
            style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.width}%`, height: `${crop.height}%` }}
            onPointerDown={(e) => onPointerDown(e, "move")}
          >
            {handles.map((h) => (
              <div
                key={h}
                onPointerDown={(e) => onPointerDown(e, "resize", h)}
                style={posFor(h)}
                className="h-3 w-3 rounded-full border-2 border-primary bg-white"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-ink-soft hover:bg-subtle"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-sky px-4 py-2 text-xs font-medium text-white shadow-soft hover:bg-primary-dark disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" /> {isProcessing ? "Cropping…" : "Crop & Use"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}