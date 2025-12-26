import { useEffect } from "react";

interface Props {
  show: boolean;
  text?: string;
}

export default function OverlaySpinner({ show, text }: Props) {
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", show);
    return () => document.body.classList.remove("overflow-hidden");
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        {text && <span className="text-sm">{text}</span>}
      </div>
    </div>
  );
}
