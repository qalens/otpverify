import React from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
};

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor: Record<string, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${bgColor[type]} text-white px-4 py-3 rounded-md shadow-lg fixed bottom-4 right-4 animate-in fade-in slide-in-from-bottom-2`}>
      {message}
    </div>
  );
}

export default Toast;
