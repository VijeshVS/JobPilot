import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

const FileUpload = ({ onFileSelect, selectedFile, disabled }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "upload-zone relative rounded-2xl p-8 cursor-pointer transition-all duration-300",
        isDragging && "active",
        disabled && "opacity-50 cursor-not-allowed",
        selectedFile && "border-primary/30"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium truncate">{selectedFile.name}</p>
            <p className="text-muted-foreground text-sm">{formatFileSize(selectedFile.size)}</p>
          </div>
          {!disabled && (
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-muted-foreground">
            <Upload className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">Drop your resume here</p>
            <p className="text-muted-foreground text-sm mt-1">or click to browse (PDF only)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
