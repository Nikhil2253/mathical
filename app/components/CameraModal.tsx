"use client";

import { useEffect, useRef } from "react";
import { Camera, X } from "lucide-react";

type Props = {
  onClose: () => void;
  onCapture: (file: File) => void;
};

export default function CameraModal({
  onClose,
  onCapture,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;

      const file = new File(
        [blob],
        "camera.jpg",
        {
          type: "image/jpeg",
        }
      );

      onCapture(file);
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">

      <div className="relative w-[90vw] max-w-2xl rounded-xl bg-white p-1">


        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-[5px]"
        />

        <canvas
          ref={canvasRef}
          className="hidden"
        />
        
        <div className="flex flex-col md:flex-row gap-1">

        <button
          onClick={capture}
          className="mt-1 w-full rounded-[5px] bg-sky-500 py-3 text-white flex items-center justify-center gap-2"
        >
          <Camera size={20} />
          Capture
        </button>
        <button
          onClick={onClose}
          className="mt-1 w-full rounded-[5px] bg-red-500 py-3 text-white flex items-center justify-center gap-2"
        >
          <X /> Cancel
        </button>
        </div>

      </div>
    </div>
  );
}